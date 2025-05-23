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
import CustomTableV2 from "@/components/common/CustomTableV2";

const Transactions = () => {
  const router = useRouter();

  const user = useLocalStorage("user");
  const [transactonsList, setTransactionsList] = useState<
    ListApiResponse | any
  >({ result: [] });
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
        apiCall: callTransactionsApi(
          getAllTransactionsByAdminApi({
            limit: limitValue,
            page: pageValue,
            all: true,
          })
        ),
        successCallBack: (response: any) => {
          setTransactionsList(response);
        },
      });
    }
  };

  const transactionsList_Admin_table_columns: TableColumns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "created_at",
      headerName: "Date Received",
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
      field: "transaction_request.user.id",
      headerName: "Merchant ID",
      target: "_self",
      link: (row: any) => {
        if (hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read)) {
          return `/merchants/details/${row?.transaction_request.user.id}`;
        }
      },
    },
    {
      field: "transaction_request.user.first_name",
      headerName: "Merchant First Name",
    },
    {
      field: "transaction_request.user.last_name",
      headerName: "Merchant Last Name",
    },
    {
      field: "transaction_request.user.email",
      headerName: "Merchant Email",
    },
    {
      field: "transaction_request.user.username",
      headerName: "Merchant Username",
    },
    {
      field: "transaction_request.user.user_type",
      headerName: "Merchant Type",
    },
    {
      field: "transaction_request.contract_address.is_token",
      headerName: "Currency Type",
      dataValidator(value, row) {
        return value ? "Token" : "Coin";
      },
    },
    { field: "transaction_request.unit", headerName: "Currency" },
    {
      field: "transaction_request.contract_address.blockchain_name",
      headerName: "Blockchain",
    },
    {
      field: "hash",
      headerName: "Transaction Hash",
      link: (row: any) => {
        const transactionExplorerLink = showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: row?.transaction_request.contract_address.blockchain_name,
          type: "hash",
          hash: row?.hash,
        });
        return transactionExplorerLink;
      },
    },
    { field: "paid_amount", headerName: "Received Amount", sortable: true },
    { field: "fee", headerName: "Fee Amount", sortable: true },
    { field: "net_amount", headerName: "Received Net Amount ", sortable: true },

    {
      field: "sender_address",
      headerName: "Sender Address",
      copyable: true,
      link: (row: any) => {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: row?.transaction_request.contract_address.blockchain_name,
          type: "address",
          address: row?.sender_address,
        });
      },
    },
    {
      field: "transaction_request.wallet.address",
      headerName: "Receiver Address",
      copyable: true,
      dataValidator(value, row: any) {
        return value || row?.transaction_request.recipient_address;
      },
      link: (row: any) => {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: row?.transaction_request.contract_address.blockchain_name,
          type: "address",
          address:
            row?.transaction_request.recipient_address ||
            row?.transaction_request.wallet?.address,
        });
      },
    },
    {
      field: "transaction_request.type",
      headerName: "Transaction Type",
      link(row: any) {
        if (
          row?.transaction_request.type == "Depoist" &&
          hasMinAccess(ModulesEnum.transaction, AccessLevelEnum.read)
        ) {
          return `payments/details/${row?.id}`;
        }
        if (
          row?.transaction_request.type == "Withdraw" &&
          hasMinAccess(ModulesEnum.withdrawal, AccessLevelEnum.read)
        ) {
          return `withdrawals/details/${row?.id}`;
        }
      },
      target: "_self",
    },
    {
      field: "status",
      headerName: "Status",
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

    return formatCSVDataByColumnOrder(transactonsList?.result, columnOrder);
  }, [transactonsList]);

  return (
    <>
      <h3 className="hidden md:block mb-8 font-semibold text-blackGrey-100 text-h3">
        Transactions
      </h3>

      <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
        <CustomTableV2
          loading={isTransactionsLoading}
          columns={transactionsList_Admin_table_columns}
          rows={transactonsList?.result}
          csv={true}
          tableName="transactions"
          initialPageSize={10}
          rowClickHandler={(row: any) => {
            router.push(`/transactions/details/${row?.id}`);
          }}
          pagination
          csvData={formatCsvData}
          columnClassName="max-w-[250px]"
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
              router.push(`/transactions/details/${row?.id}`);
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
