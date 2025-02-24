"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { getAllTransactionsApi } from "@/services/transaction";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";

import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  capitalize,
  formatTransactions,
  formatTransactionsByAdmin,
} from "@/utils/dataFormatters";
import { getAllTransactionsByAdminApi } from "@/services/admin/transaction";
import { generateCSVApi } from "@/services/common";
import CustomTable from "@/components/common/CustomTable";
import Chip from "@/components/common/Chip";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import PermissionAccess from "@/middleware/PermissionAccess";

const statusList = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirm" },
  { label: "Rejected", value: "reject" },
  { label: "Pending", value: "pending" },
];

const transactionsList_table_columns: TableColumns = [
  { field: "uuid", headerName: "ID", sortable: true },
  { field: "dateReceived", headerName: "Date Received", sortable: true },
  { field: "blockchain", headerName: "Blockchain", sortable: true },
  {
    field: "transactionHash",
    headerName: "Transaction Hash",
    sortable: true,
    copyable: true,
    link: (row: { blockchain: string; transactionHash: string }) => {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "hash",
        hash: row?.transactionHash,
      });
    },
  },
  { field: "amount", headerName: "Amount", sortable: true },
  { field: "client_fee", headerName: "Client Fee", sortable: true },
  {
    field: "receiveAddress",
    headerName: "Receive Address",
    sortable: true,
    copyable: true,
    link: (row: { blockchain: string; receiveAddress: string }) => {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "address",
        address: row?.receiveAddress,
      });
    },
  },
  { field: "transactionType", headerName: "Transacion Type", sortable: true },
  {
    field: "status",
    headerName: "Status",
    sortable: true,
    dataValidator: (value) => {
      return <Chip status={value} />;
    },
  },
];

const transactionsList_Admin_table_columns: TableColumns = [
  { field: "uuid", headerName: "ID", sortable: true },
  { field: "dateReceived", headerName: "Date Received", sortable: true },
  { field: "blockchain", headerName: "Blockchain", sortable: true },
  {
    field: "transactionHash",
    headerName: "Transaction Hash",
    sortable: true,
    link: (row: { blockchain: string; transactionHash: string }) => {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "hash",
        hash: row?.transactionHash,
      });
    },
  },
  { field: "amount", headerName: "Amount", sortable: true },
  { field: "client_fee", headerName: "Client Fee", sortable: true },
  // { field: "userName", headerName: "UserName", sortable: true },
  // { field: "email", headerName: "Email", sortable: true },
  {
    field: "receiveAddress",
    headerName: "Receive Address",
    sortable: true,
    copyable: true,
    link: (row: { blockchain: string; receiveAddress: string }) => {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "address",
        address: row?.receiveAddress,
      });
    },
  },
  { field: "transactionType", headerName: "Transacion Type", sortable: true },
  {
    field: "status",
    headerName: "Status",
    sortable: true,
    dataValidator: (value) => {
      return <Chip status={value} />;
    },
  },
];

const Transactions = () => {
  const router = useRouter();

  const user = useLocalStorage("user");
  const [transactions, setTransactions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isTransactionsLoading, isTransactionsError, callTransactionsApi] =
    useApi({ initailLoading: true });
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const getTransactions = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callTransactionsApi(getAllTransactionsApi({})),
        successCallBack: (response: any) => {
          const tableData = formatTransactions(response);
          setTransactions(tableData);
        },
      });
    }
    if (user?.role == Role.ADMIN) {
      await callApiHook({
        apiCall: callTransactionsApi(getAllTransactionsByAdminApi()),
        successCallBack: (response: any) => {
          const tableData = formatTransactionsByAdmin(response);

          setTransactions(tableData);
        },
      });
    }
  };

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(transactions)),
      successCallBack: (response: any) => {
        downloadCSV(response, "transactions.csv");
      },
    });
  };

  useEffect(() => {
    getTransactions();
  }, [selectedStatus]);

  return (
    <>
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8 md:block hidden">
        Transactions
      </h3>

      <CustomTable
        loading={isTransactionsLoading}
        columns={
          user?.role == Role.ADMIN
            ? transactionsList_Admin_table_columns
            : transactionsList_table_columns
        }
        rows={transactions}
        csv={{
          handler: ExportCSVHandler,
          loading: isCSVLoading,
          error: isCSVError,
        }}
        initialPageSize={10}
        rowClickHandler={(row: any) => {
          router.push(
            `/transactions/details/${row?.id}?type=${row?.transactionType}`
          );
        }}
        pagination
        columnClassName="max-w-[200px]"
      />

      <ErrorApiText error={isTransactionsError} />
    </>
  );
};

export default PermissionAccess(
  Transactions,
  ModulesEnum.transaction,
  AccessLevelEnum.read
);
