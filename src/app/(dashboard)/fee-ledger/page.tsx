"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { Role } from "@/constants/roles";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";

import ErrorApiText from "@/components/common/ErrorApiText";

import { generateCSVApi } from "@/services/common";
import CustomTable from "@/components/common/CustomTable";

import CreateWithdrawalModal from "@/components/Modals/CreateWithdrawalModal";

import {
  AccessLevelEnum,
  ModulesEnum,
  TableColumns,
  transactionTypes,
} from "@/constants/types";

import PermissionAccess from "@/middleware/PermissionAccess";
import AdvancedTable from "@/components/common/AdvancedTable";
import { ListApiResponse } from "@/components/common/AdvancedTable/types";
import momentTZ from "moment-timezone";
import { formatDateToUserTimeZone } from "@/utils/dates";
import { getUserLedgerListApi } from "@/services/feeLedger";
import { getAdminLedgerListApi } from "@/services/admin/feeLedger";
import { hasMinAccess } from "@/utils/cookies";

import { ColumnConfig, formatCSVDataByColumnOrder } from "@/utils/csv";
import { standardBlockchain, unitName } from "@/constants/blockchains";

const FeeLedger = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [FeeLedgerList, setFeeLedgerList] = useState<ListApiResponse | any>(
    user?.role == Role.USER ? null : []
  );
  const [columns, setColumns] = useState([]);
  const [listConfig, setListConfig] = useState(null);
  const [isFeeLedgerListLoading, isFeeLedgerListError, callFeeLedgerListApi] =
    useApi({ initailLoading: true });

  const getFeeLedger = async ({
    pageValue,
    limitValue,
    sort,
    filters,
  }: {
    pageValue?: number;
    limitValue?: number;
    sort?: any;
    filters?: any;
  }) => {
    // if (user?.role == Role.USER) {

    let feeLeadgerCall = () => {
      return user?.role == Role.USER
        ? getUserLedgerListApi(
            { sort, filters },
            { limit: limitValue, page: pageValue }
          )
        : getAdminLedgerListApi();
    };

    await callApiHook({
      apiCall: callFeeLedgerListApi(feeLeadgerCall()),
      successCallBack: (response: any) => {
        if (user.role == Role.USER) {
          const modifiedColumns = response?.listConfig.views[0].columns.map(
            (column) => {
              if (["createdAt"].includes(column.listColumnsMeta.name)) {
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
              if (["fee"].includes(column.listColumnsMeta.name)) {
                return {
                  ...column,
                  dataValidator: (value: string) => {
                    return `${value} %`;
                  },
                };
              }

              return column;
            }
          );

          response.listConfig.views[0].columns = modifiedColumns;

          setColumns(modifiedColumns);

          setListConfig(response.listConfig);

          setFeeLedgerList(response);
        }
        if (user?.role == Role.ADMIN) {
          setFeeLedgerList(response?.result);
        }
      },
    });
    // }
  };

  const feeLedger_table_columns: TableColumns = [
    { field: "id", headerName: "ID" },
    {
      field: "transaction_request.type",
      headerName: "Transaction Type",
      link(row: any) {
        if (
          row?.transaction_request?.type == transactionTypes.Deposit &&
          hasMinAccess(ModulesEnum.payment, AccessLevelEnum.read)
        ) {
          return `/deposits/details/${row?.transaction_request?.id}`;
        }
        if (
          row?.transaction_request?.type == transactionTypes.Withdraw &&
          hasMinAccess(ModulesEnum.withdrawal, AccessLevelEnum.read)
        ) {
          return `/withdrawals/details/${row?.transaction_request?.id}`;
        }
      },
      target: "_self",
    },
    {
      field: "created_at",
      headerName: "Created At",
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
      field: "updated_at",
      headerName: "Updated At",
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
    { field: "transaction_request.fiat_currency", headerName: "Fiat Currency" },
    { field: "transaction_request.unit", headerName: "Crypto Currency" },
    {
      field: "transaction_request.standard",
      headerName: "Blockchain",
      dataValidator(value, row: any) {
        if (value) {
          return standardBlockchain[value];
        }

        return unitName[row?.transaction_request?.unit?.toLowerCase()];
      },
    },

    { field: "transaction.paid_amount", headerName: "Crypto Paid Amount" },
    { field: "transaction.net_amount", headerName: "Crypto Net Amount" },
    { field: "transaction.fee", headerName: "Crypto Fee Amount" },
    { field: "transaction.fiat_paid_amount", headerName: "Fiat Paid Amount" },
    { field: "transaction.fiat_net_amount", headerName: "Fiat Net Amount" },
    { field: "transaction.fiat_fee", headerName: "Fiat Fee Amount" },
    {
      field: "transaction_request.fee_value",
      headerName: "Fee (%)",
      sortable: true,
      dataValidator(value, row) {
        return `${value} %`;
      },
    },
    {
      field: "fiat_company_ledger.balance_before",
      headerName: "Company Fiat Before Balance",
    },
    {
      field: "fiat_company_ledger.balance_after",
      headerName: "Company Fiat After Balance",
    },
    {
      field: "crypto_company_ledger.balance_before",
      headerName: "Company Crypto Before Balance",
    },
    {
      field: "crypto_company_ledger.balance_after",
      headerName: "Company Crypto After Balance",
    },
    {
      field: "transaction_request.user.id",
      headerName: "Merchant ID",
      link(row: any) {
        if (hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read)) {
          return `/merchants/details/${row?.transaction_request?.user?.id}`;
        }
      },
      target: "_self",
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
      field: "transaction_request.user.user_type",
      headerName: "Merchant Type",
    },
    {
      field: "transaction_request.company.owner.id",
      headerName: "Company Owner ID",
      link(row: any) {
        if (hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read)) {
          return `/merchants/details/${row?.transaction_request.company.owner.id}`;
        }
      },
      target: "_self",
    },
    {
      field: "transaction_request.company.owner.first_name",
      headerName: "Company Owner First Name",
    },
    {
      field: "transaction_request.company.owner.last_name",
      headerName: "Company Owner Last Name",
    },
    {
      field: "transaction_request.company.owner.email",
      headerName: "Company Owner Email",
    },
  ];

  useEffect(() => {
    getFeeLedger({ limitValue: 10, pageValue: 1, filters: [], sort: [] });
  }, []);

  const formatCsvData = useMemo(() => {
    const columnOrderUser: ColumnConfig<any>[] = [
      { key: "id" },
      { key: "type" },
      { key: "unit" },
      { key: "received_amount" },
      { key: "paid_amount" },
      { key: "fee_amount" },
      { key: "fee" },
      { key: "fee_type" },
      { key: "transaction_type" },
      { key: "standard" },
      { key: "createdAt" },
      { key: "updatedAt" },
      { key: "merchant" },
      { key: "payment" },
      { key: "withdraw" },
    ];

    const columnOrderAdmin: ColumnConfig<any>[] = [
      { key: "id" },
      { key: "created_at" },
      { key: "updated_at" },
      { key: "fee" },
      { key: "fee_amount" },
      { key: "fee_type" },
      { key: "paid_amount" },
      { key: "received_amount" },
      { key: "standard" },
      { key: "type" },
      { key: "unit" },
      { key: "transaction_type" },
      { key: "merchant_id" },
      { key: "owner_id" },
      { key: "owner_first_name" },
      { key: "owner_last_name" },
      { key: "owner_email" },
      { key: "owner_user_type" },
      { key: "payment_id" },
      { key: "withdraw_id" },
    ];

    const isAdmin = user?.role == Role.ADMIN;

    const rows = isAdmin ? FeeLedgerList : FeeLedgerList?.result;

    return formatCSVDataByColumnOrder(
      rows,
      isAdmin ? columnOrderAdmin : columnOrderUser
    );
  }, [FeeLedgerList]);

  const toggleCreateModal = () => {
    setIsCreateOpen(!isCreateOpen);
  };

  return (
    <>
      <CreateWithdrawalModal
        isOpen={isCreateOpen}
        toggleHandler={toggleCreateModal}
        refreshHandler={() => {
          getFeeLedger({
            pageValue: 1,
            filters: [],
            limitValue: 10,
            sort: [],
          });
        }}
      />

      <div className="hidden md:flex justify-between items-center mb-8">
        <h3 className="font-semibold text-blackGrey-100 text-h3">Fee Ledger</h3>
      </div>

      {user?.role == Role.ADMIN && (
        <CustomTable
          loading={isFeeLedgerListLoading}
          columns={feeLedger_table_columns}
          // Filters={Filters}
          createHandler={toggleCreateModal}
          rows={FeeLedgerList}
          csv={true}
          tableName="fee-ledger"
          initialPageSize={10}
          rowClickHandler={(row: any) =>
            hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read) &&
            router.push(
              `/merchants/details/${row?.transaction_request?.user?.id}`
            )
          }
          pagination
          columnClassName="max-w-[300px]"
          csvData={formatCsvData}
        />
      )}

      {user?.role == Role.USER && (
        <div>
          <AdvancedTable
            columns={columns}
            setColumns={setColumns}
            rows={FeeLedgerList?.result}
            listConfig={listConfig}
            setListConfig={setListConfig}
            selectable={false}
            onRowClick={(row) => {
              if (
                row?.transaction_request?.type == transactionTypes.Deposit &&
                hasMinAccess(ModulesEnum.payment, AccessLevelEnum.read)
              ) {
                router.push(`/deposits/details/${row?.transaction_request?.id}`);
              }
              if (
                row?.transaction_request?.type == transactionTypes.Withdraw &&
                hasMinAccess(ModulesEnum.withdrawal, AccessLevelEnum.read)
              ) {
                router.push(`/withdrawals/details/${row?.transaction_request?.id}`);
              }
            }}
            pagination
            loading={isFeeLedgerListLoading}
            totalItems={FeeLedgerList?.total}
            fetchData={getFeeLedger}
            tableName="fee-ledger"
            csvData={formatCsvData}
          />
        </div>
      )}
      <ErrorApiText error={isFeeLedgerListError} />
    </>
  );
};

export default PermissionAccess(
  FeeLedger,
  ModulesEnum.feeLedger,
  AccessLevelEnum.read
);
