"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getAllMerchantsByAdminApi } from "@/services/admin/users";

import ErrorApiText from "@/components/common/ErrorApiText";

import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import PermissionAccess from "@/middleware/PermissionAccess";
import { formatDateToUserTimeZone } from "@/utils/dates";
import { ColumnConfig, formatCSVDataByColumnOrder } from "@/utils/csv";
import CustomTableV2 from "@/components/common/CustomTableV2";
import AmountFormat from "@/components/common/AmountFormat";
import { formatAmount } from "@/components/common/AmountFormat/utils";

const usersList_table_columns: TableColumns = [
  { field: "id", headerName: "ID" },
  {
    field: "created_at",
    headerName: "Created",
    dataValidator: (value) => {
      const [day, time] = formatDateToUserTimeZone(value);
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
    headerName: "Updated",
    dataValidator: (value) => {
      const [day, time] = formatDateToUserTimeZone(value);
      return (
        <div className="flex flex-col gap-1">
          <span className="text-caption">{day}</span>
          <span className="text-custom-title-gray text-subtitle">{time}</span>
        </div>
      );
    },
  },
  {
    field: "first_name",
    headerName: "First Name",
  },
  {
    field: "last_name",
    headerName: "Last Name",
  },
  {
    field: "email",
    headerName: "Email",
  },
  {
    field: "company.wallet_info.total_amount",
    headerName: "Current Balance",
    dataValidator: (value) => <AmountFormat amount={value} type="fiat" />,
  },
  {
    field: "company.wallet_info.total_deposit",
    headerName: "Deposit",
    dataValidator: (value) => <AmountFormat amount={value} type="fiat" />,
  },
  {
    field: "company.wallet_info.total_withdraw",
    headerName: "Withdrawal",
    dataValidator: (value) => <AmountFormat amount={value} type="fiat" />,
  },
  {
    field: "user_type",
    headerName: "User Type",
  },
  {
    field: "company_id",
    headerName: "Company Id",
  },
  {
    field: "company.ownername",
    headerName: "Owner Name",
  },
  {
    field: "company.type",
    headerName: "Type",
  },
  {
    field: "company.client_fee",
    headerName: "Client Fee",
    dataValidator: (value) => {
      return value ? `${value} %` : "_";
    },
  },
  {
    field: "company.fee",
    headerName: "Alphaspay Fee",
    dataValidator: (value) => {
      return value ? `${value} %` : "_";
    },
  },
];

const Merchants = () => {
  const router = useRouter();
  const [users, setUsers] = useState<{ result: []; total: number }>({
    result: [],
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isUsersLoading, isUsersError, callUsersApi] = useApi({
    initailLoading: true,
  });

  const getAllUsersAdmin = async ({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }) => {
    await callApiHook({
      apiCall: callUsersApi(
        getAllMerchantsByAdminApi({
          limit,
          page,
        })
      ),
      successCallBack: (response) => {
        setUsers(response);
      },
    });
  };

  const formatCsvData = useMemo(() => {
    const columnOrder: ColumnConfig<any>[] = [
      { key: "id" },
      { key: "user_uuid" },
      { key: "first_name" },
      { key: "middle_name" },
      { key: "last_name" },
      { key: "legal_name" },
      { key: "legal_type" },
      { key: "email" },
      { key: "username" },
      { key: "user_type" },
      { key: "verified" },
      { key: "company_id" },

      // Company fields
      { key: "company.ownername", label: "company_ownername" },
      { key: "company.type", label: "company_type" },
      { key: "company.client_fee", label: "company_client_fee" },
      { key: "company.fee", label: "company_fee" },

      // Wallet info fields
      { key: "company.wallet_info.currency", label: "wallet_currency" },

      {
        key: "company.wallet_info.total_amount",
        label: "current_balance",
        format(value, row) {
          return value
            ? formatAmount({ amount: value, type: "fiat" })?.fixedRaw
            : "-";
        },
      },
      {
        key: "company.wallet_info.total_deposit",
        label: "deposit",
        format(value, row) {
          return value
            ? formatAmount({ amount: value, type: "fiat" })?.fixedRaw
            : "-";
        },
      },
      {
        key: "company.wallet_info.total_withdraw",
        label: "withdrawal",
        format(value, row) {
          return value
            ? formatAmount({ amount: value, type: "fiat" })?.fixedRaw
            : "-";
        },
      },

      // User timestamps
      { key: "created_at" },
      { key: "updated_at" },
    ];

    return formatCSVDataByColumnOrder(users?.result, columnOrder);
  }, [users]);

  useEffect(() => {
    getAllUsersAdmin({ limit, page });
  }, []);

  return (
    <>
      <h3 className="hidden md:block mb-8 font-semibold text-blackGrey-100 text-h3">
        Merchants
      </h3>

      {/* Table Actions Below */}

      <div>
        <CustomTableV2
          loading={isUsersLoading}
          columns={usersList_table_columns}
          rows={users?.result}
          totalItems={users?.total}
          csv={true}
          tableName="Merchants"
          initialPageSize={limit}
          rowClickHandler={(row: any) =>
            router.push(`/merchants/details/${row?.id}`)
          }
          columnClassName="max-w-[250px]"
          csvData={formatCsvData}
          pagination
          serverSidePagination
          onPageChange={(page) => {
            setPage(page);
            getAllUsersAdmin({ limit, page });
          }}
          onPageSizeChange={(pageSize) => {
            setLimit(pageSize);
            setPage(1);
            getAllUsersAdmin({ limit: pageSize, page: 1 });
          }}
        />

        <ErrorApiText error={isUsersError} />
      </div>
    </>
  );
};

export default PermissionAccess(
  Merchants,
  ModulesEnum.merchant,
  AccessLevelEnum.read
);
