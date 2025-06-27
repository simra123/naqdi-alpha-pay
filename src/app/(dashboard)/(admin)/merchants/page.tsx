"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getAllMerchantsByAdminApi, getAllUsersByAdminApi } from "@/services/admin/users";

import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";

import { formatUsers } from "@/utils/dataFormatters";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { Role } from "@/constants/roles";
import Chip from "@/components/common/Chip";
import CustomTable from "@/components/common/CustomTable";
import { generateCSVApi } from "@/services/common";
import PermissionAccess from "@/middleware/PermissionAccess";
import { formatDateToUserTimeZone } from "@/utils/dates";
import { ColumnConfig, formatCSVDataByColumnOrder } from "@/utils/csv";
import CustomTableV2 from "@/components/common/CustomTableV2";
import AmountFormat from "@/components/common/AmountFormat";

const usersList_table_columns: TableColumns = [
  { field: "id", headerName: "ID" },
  {
    field: "created_at",
    headerName: "Created",
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
    headerName: "Updated",
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
  { field: "ownername", headerName: "Owner Name" },
  { field: "type", headerName: "type" },
  {
    field: "client_fee",
    headerName: "Client Fee",
    dataValidator(value, row) {
      return value ? `${value} %` : "_";
    },
  },
  {
    field: "fee",
    headerName: "Alphaspay Fee",
    dataValidator(value, row) {
      return value ? `${value} %` : "_";
    },
  },
  {
    field: "wallet_info.total_amount",
    headerName: "Current Balance",
    dataValidator(value, row) {
      return <AmountFormat amount={value} type="fiat" />;
    },
  },
  {
    field: "wallet_info.total_deposit",
    headerName: "Deposit",
    dataValidator(value, row) {
      return <AmountFormat amount={value} type="fiat" />;
    },
  },
  {
    field: "wallet_info.total_withdraw",
    headerName: "Withdrawal",
    dataValidator(value, row) {
      return <AmountFormat amount={value} type="fiat" />;
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
