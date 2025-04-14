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
import { formatDateToUserTimeZone } from "@/utils/dates";

const statusList = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirm" },
  { label: "Rejected", value: "reject" },
  { label: "Pending", value: "pending" },
];

const transactionsList_table_columns: TableColumns = [
  { field: "uuid", headerName: "ID", sortable: true },
  {
    field: "dateReceived",
    headerName: "Date Received",
    sortable: true,
    dataValidator: (value) => {
      let [day, time] = formatDateToUserTimeZone(value);
      return (
        <div className="flex flex-col gap-1">
          <span className="text-caption">{day}</span>
          <span className="text-custom-title-gray text-subtitle">{time}</span>
        </div>
      );
    },
  },
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
  {
    field: "uuid",
    headerName: "ID",
    sortable: true,
    dataValidator(value, row: any) {
      return row?.withdraw_transaction_uuid || row?.payment_transaction_uuid;
    },
  },
  {
    field: "createdAt",
    headerName: "Date Received",
    sortable: true,
    dataValidator: (value) => {
      let [day, time] = formatDateToUserTimeZone(value);
      return (
        <div className="flex flex-col gap-1">
          <span className="text-caption">{day}</span>
          <span className="text-custom-title-gray text-subtitle">{time}</span>
        </div>
      );
    },
  },
  {
    field: "client.id",
    headerName: "Merchant ID",
    dataValidator(value, row: any) {
      return row?.client?.id || row?.withdrawal?.user?.id;
    },
    link: (row: any) => {
      return `/merchants/details/${
        row?.client?.id || row?.withdrawal?.user?.id
      }`;
    },
  },
  {
    field: "client.first_name",
    headerName: "Merchant First Name",
    dataValidator(value, row: any) {
      return row?.client?.first_name || row?.withdrawal?.user?.first_name;
    },
  },
  {
    field: "client.last_name",
    headerName: "Merchant Last Name",
    dataValidator(value, row: any) {
      return row?.client?.last_name || row?.withdrawal?.user?.last_name;
    },
  },
  {
    field: "client.email",
    headerName: "Merchant Email",
    dataValidator(value, row: any) {
      return row?.client?.email || row?.withdrawal?.user?.email;
    },
  },
  {
    field: "client.username",
    headerName: "Merchant Username",
    dataValidator(value, row: any) {
      return row?.client?.username || row?.withdrawal?.user?.username;
    },
  },
  {
    field: "client.user_type",
    headerName: "Merchant Type",
    dataValidator(value, row: any) {
      return row?.client?.user_type || row?.withdrawal?.user?.user_type;
    },
  },
  {
    field: "blockchain",
    headerName: "Blockchain",
    sortable: true,
    dataValidator(value, row:any) {
      return row?.clientWallet?.blockchain || row?.wallet?.blockchain
    },
  },
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
          setTransactions(response);
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
      <h3 className="hidden md:block mb-8 font-semibold text-blackGrey-100 text-h3">
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
