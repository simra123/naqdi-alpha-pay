"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getAllUsersByAdminApi } from "@/services/admin/users";

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

const usersList_table_columns: TableColumns = [
  { field: "user_uuid", headerName: "ID" },
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
  { field: "first_name", headerName: "First Name" },
  { field: "last_name", headerName: "Last Name" },
  { field: "username", headerName: "Username" },
  { field: "email", headerName: "Email" },
  { field: "user_type", headerName: "User Type" },
  {
    field: "verified",
    headerName: "Verified",
    dataValidator(value) {
      const status = value ? "Verified" : "Unverified";
      return <Chip status={status} />;
    },
  },
];

const Merchants = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isUsersLoading, isUsersError, callUsersApi] = useApi({
    initailLoading: true,
  });
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const getAllUsersAdmin = async () => {
    await callApiHook({
      apiCall: callUsersApi(getAllUsersByAdminApi()),
      successCallBack: (response) => {
        setUsers(formatUsers(response));
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

    return formatCSVDataByColumnOrder(users, columnOrder);
  }, [users]);

  useEffect(() => {
    getAllUsersAdmin();
  }, []);

  return (
    <>
      <h3 className="hidden md:block mb-8 font-semibold text-blackGrey-100 text-h3">
        Merchants
      </h3>

      {/* Table Actions Below */}

      <div>
        <CustomTable
          loading={isUsersLoading}
          columns={usersList_table_columns}
          rows={users}
          csv={true}
          tableName="Merchants"
          initialPageSize={10}
          rowClickHandler={(row: any) =>
            router.push(`/merchants/details/${row?.id}`)
          }
          pagination
          columnClassName="max-w-[250px]"
          csvData={formatCsvData}
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
