"use client";
import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { getAllTransactionsApi } from "@/services/transaction";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import ErrorApiText from "@/components/common/ErrorApiText";

import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";

import { getAllTransactionsByAdminApi } from "@/services/admin/transaction";
import { generateCSVApi } from "@/services/common";
import CustomTable from "@/components/common/CustomTable";
import Chip from "@/components/common/Chip";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import PermissionAccess from "@/middleware/PermissionAccess";
import { formatDateToUserTimeZone } from "@/utils/dates";
import { hasMinAccess } from "@/utils/cookies";
import { ColumnConfig, formatCSVDataByColumnOrder } from "@/utils/csv";
import { ListApiResponse } from "@/components/common/AdvancedTable/types";
import momentTZ from "moment-timezone";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import AdvancedTable from "@/components/common/AdvancedTable";

const transactionsList_table_columns: TableColumns = [
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
  { field: "transaction_type", headerName: "Currency Type", sortable: true },
  { field: "unit", headerName: "Currency", sortable: true },
  {
    field: "blockchain",
    headerName: "Blockchain",
    sortable: true,
    dataValidator(value, row: any) {
      return row?.clientWallet?.blockchain || row?.wallet?.blockchain;
    },
  },
  {
    field: "transaction_hash",
    headerName: "Transaction Hash",
    sortable: true,
    link: (row: any) => {
      const transactionExplorerLink = showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.wallet?.blockchain || row?.clientWallet?.blockchain,
        type: "hash",
        hash: row?.transaction_hash,
      });
      return transactionExplorerLink;
    },
  },
  { field: "amount", headerName: "Amount", sortable: true },
  { field: "alphaspay_fees", headerName: "Fee", sortable: true },
  {
    field: "sender_address",
    headerName: "Sender Address",
    sortable: true,
    copyable: true,
    link: (row: any) => {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.clientWallet?.blockchain || row?.wallet?.blockchain,
        type: "address",
        address: row?.sender_address,
      });
    },
  },
  {
    field: "receiveAddress",
    headerName: "Receiver Address",
    sortable: true,
    copyable: true,
    dataValidator(value, row: any) {
      return row?.withdrawal?.recipient_address || row?.wallet?.address;
    },
    link: (row: any) => {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.clientWallet?.blockchain || row?.wallet?.blockchain,
        type: "address",
        address: row?.withdrawal?.recipient_address || row?.wallet?.address,
      });
    },
  },
  {
    field: "",
    headerName: "Transacion Type",
    sortable: true,
    dataValidator(value, row: any) {
      return row?.payment ? "Payment" : "Withdrawal";
    },
    link(row: any) {
      return row?.payment
        ? `payments/details/${row?.payment?.id}`
        : `withdrawals/details/${row?.withdrawal?.id}`;
    },
    target: "_self",
  },
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
  const [transactonsList, setTransactionsList] = useState<
    ListApiResponse | any
  >(user?.role == Role.USER ? null : []);
  const [columns, setColumns] = useState([]);
  const [listConfig, setListConfig] = useState(null);
  const [isTransactionsLoading, isTransactionsError, callTransactionsApi] =
    useApi({ initailLoading: true });

  const getTransactions = async ({ pageValue, limitValue, sort, filters }) => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callTransactionsApi(
          getAllTransactionsApi(
            { sort, filters },
            { limit: limitValue, page: pageValue }
          )
        ),
        successCallBack: (response: any) => {
          console.log({ response });
          if (user?.role == Role.USER) {
            const modifiedColumns = response?.listConfig.views[0].columns.map(
              (column) => {
                if (column.listColumnsMeta.name === "wallet.address") {
                  return {
                    ...column,
                    copyable: true,
                    link: (row: {
                      wallet: { blockchain: string; address: string };
                    }) => {
                      return showExplorerDetailsByChain({
                        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
                        blockchain: row?.wallet?.blockchain,
                        type: "address",
                        address: row?.wallet.address,
                      });
                    },
                  };
                }

                if (
                  ["created_at", "updated_at"].includes(
                    column.listColumnsMeta.name
                  )
                ) {
                  return {
                    ...column,
                    dataValidator: (value: string) => {
                      const currentTimeZone = momentTZ.tz.guess();

                      let date: string | string[] = momentTZ(value)
                        .tz(currentTimeZone)
                        .format("DD-MM-YYYY.hh:mm A");

                      let [day, time] = date.split(".");
                      return (
                        <div className="flex flex-col gap-1">
                          <span className="text-caption">{day}</span>
                          <span className="text-custom-title-gray text-subtitle">
                            {time}
                          </span>
                        </div>
                      );
                    },
                  };
                }

                if (column.listColumnsMeta.name === "status") {
                  return {
                    ...column,
                    dataValidator: (value: string) => <Chip status={value} />,
                  };
                }

                return column;
              }
            );

            response.listConfig.views[0].columns = modifiedColumns;

            setColumns(modifiedColumns);

            setListConfig(response.listConfig);

            setTransactionsList(response);
          }
        },
      });
    }
    if (user?.role == Role.ADMIN) {
      await callApiHook({
        apiCall: callTransactionsApi(getAllTransactionsByAdminApi()),
        successCallBack: (response: any) => {
          setTransactionsList(response);
        },
      });
    }
  };

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
      target: "_self",
      link: (row: any) => {
        if (hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read)) {
          return `/merchants/details/${
            row?.client?.id || row?.withdrawal?.user?.id
          }`;
        }
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
    { field: "transaction_type", headerName: "Currency Type", sortable: true },
    { field: "unit", headerName: "Currency", sortable: true },
    {
      field: "blockchain",
      headerName: "Blockchain",
      sortable: true,
      dataValidator(value, row: any) {
        return row?.clientWallet?.blockchain || row?.wallet?.blockchain;
      },
    },
    {
      field: "transaction_hash",
      headerName: "Transaction Hash",
      sortable: true,
      link: (row: any) => {
        const transactionExplorerLink = showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: row?.wallet?.blockchain || row?.clientWallet?.blockchain,
          type: "hash",
          hash: row?.transaction_hash,
        });
        return transactionExplorerLink;
      },
    },
    { field: "amount", headerName: "Amount", sortable: true },
    { field: "alphaspay_fees", headerName: "Fee", sortable: true },

    {
      field: "sender_address",
      headerName: "Sender Address",
      sortable: true,
      copyable: true,
      link: (row: any) => {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: row?.clientWallet?.blockchain || row?.wallet?.blockchain,
          type: "address",
          address: row?.sender_address,
        });
      },
    },
    {
      field: "receiveAddress",
      headerName: "Receiver Address",
      sortable: true,
      copyable: true,
      dataValidator(value, row: any) {
        return row?.withdrawal?.recipient_address || row?.wallet?.address;
      },
      link: (row: any) => {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: row?.clientWallet?.blockchain || row?.wallet?.blockchain,
          type: "address",
          address: row?.withdrawal?.recipient_address || row?.wallet?.address,
        });
      },
    },
    {
      field: "",
      headerName: "Transaction Type",
      sortable: true,
      dataValidator(value, row: any) {
        return row?.payment ? "Payment" : "Withdrawal";
      },
      link(row: any) {
        if (
          row?.payment &&
          hasMinAccess(ModulesEnum.transaction, AccessLevelEnum.read)
        ) {
          return `payments/details/${row?.payment?.id}`;
        }
        if (
          row?.withdrawal &&
          hasMinAccess(ModulesEnum.withdrawal, AccessLevelEnum.read)
        ) {
          return `withdrawals/details/${row?.withdrawal?.id}`;
        }
      },
      target: "_self",
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      dataValidator: (value) => {
        return <Chip status={value} />;
      },
    },
  ];

  useEffect(() => {
    getTransactions({ limitValue: 10, pageValue: 1, filters: [], sort: [] });
  }, []);

  const formatCsvData = useMemo(() => {
    const columnOrder: ColumnConfig<any>[] = [
      { key: "id" },
      { key: "payment_transaction_uuid" },
      { key: "withdraw_transaction_uuid" },
      { key: "transaction_type" },
      { key: "transaction_hash" },
      { key: "sender_address" },
      // { key: "transaction_amount" },
      { key: "amount" },
      { key: "unit" },
      { key: "total_amount_received" },
      { key: "alphaspay_fees" },
      { key: "client_fee" },
      { key: "status" },
      { key: "createdAt" },
      { key: "updatedAt" },
      { key: "client" },
      { key: "payment" },
      { key: "withdrawal" },
      {
        key: "wallet",
        format(value, row) {
          return row?.wallet || row?.clientWallet
            ? JSON.stringify(row?.wallet || row?.clientWallet)
            : "-";
        },
      },
    ];

    return formatCSVDataByColumnOrder(
      user?.role == Role.ADMIN ? transactonsList : transactonsList?.result,
      columnOrder
    );
  }, [transactonsList]);

  return (
    <>
      <h3 className="hidden md:block mb-8 font-semibold text-blackGrey-100 text-h3">
        Transactions
      </h3>

      <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
        <CustomTable
          loading={isTransactionsLoading}
          columns={
            user?.role == Role.ADMIN
              ? transactionsList_Admin_table_columns
              : transactionsList_table_columns
          }
          rows={transactonsList}
          csv={true}
          tableName="transactions"
          initialPageSize={10}
          rowClickHandler={(row: any) => {
            router.push(
              `/transactions/details/${row?.id}?type=${
                row?.payment ? "Payment" : "Withdrawal"
              }`
            );
          }}
          pagination
          csvData={formatCsvData}
          columnClassName="max-w-[200px]"
        />
      </RenderRoleBased>

      <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
        <div>
          <AdvancedTable
            columns={columns}
            setColumns={setColumns}
            rows={transactonsList?.result}
            listConfig={listConfig}
            setListConfig={setListConfig}
            onRowClick={(row) => {
              router.push(`payments/details/${row?.id}`);
            }}
            selectable={false}
            pagination
            csvData={formatCsvData}
            loading={isTransactionsLoading}
            totalItems={transactonsList?.total}
            fetchData={getTransactions}
            tableName="payments"
          />
        </div>
      </RenderRoleBased>

      <ErrorApiText error={isTransactionsError} />
    </>
  );
};

export default PermissionAccess(
  Transactions,
  ModulesEnum.transaction,
  AccessLevelEnum.read
);
