"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { getKYCUsersListApi } from "@/services/admin/users";
import moment from "moment";
import ErrorApiText from "@/components/common/ErrorApiText";

import { Role } from "@/constants/roles";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import Chip from "@/components/common/Chip";
import CustomTable from "@/components/common/CustomTable";
import { generateCSVApi } from "@/services/common";
import PermissionAccess from "@/middleware/PermissionAccess";
import { getLocalStorageValue } from "@/utils/cookies";
import { getPermission } from "@/utils/cookies";
import { formatDateToUserTimeZone } from "@/utils/dates";
import { ColumnConfig, formatCSVDataByColumnOrder } from "@/utils/csv";

const columns: TableColumns = [
  {
    field: "user_details_uuid",
    headerName: "ID",
  },
  {
    field: "user.created_at",
    headerName: "Created At",
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
  { field: "user.first_name", headerName: "First name" },
  { field: "user.last_name", headerName: "Last name" },
  { field: "user.email", headerName: "Email" },
  { field: "phone_number", headerName: "Phone" },
  { field: "country", headerName: "Country" },
  { field: "user.user_type", headerName: "User Type" },
  {
    field: "user.company.fee",
    headerName: "Fee",
    dataValidator(value, row) {
      return value ? `${value} %` : "_";
    },
  },
  {
    field: "kyc_status",
    headerName: "Status",
    dataValidator(value) {
      return <Chip status={value} />;
    },
  },
];

const KYCUsersPage = () => {
  const router = useRouter();
  const currentUser = getLocalStorageValue("user");
  const [usersList, setUsersList] = useState([]);
  const [isUsersListLoading, isUsersListError, callUsersListApi] = useApi({
    initailLoading: true,
  });
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const getUsersList = async () => {
    await callApiHook({
      apiCall: callUsersListApi(getKYCUsersListApi({ status: "" })),
      successCallBack: (response) => {
        setUsersList(response);
      },
    });
  };

  const formatCsvData = useMemo(() => {
    const columnOrder: ColumnConfig<any>[] = [
      { key: "id" },
      { key: "user_details_uuid" },
      { key: "country" },
      { key: "state" },
      { key: "city" },
      { key: "postal_code" },
      { key: "phone_number" },
      { key: "mfa" },
      { key: "address_line_1" },
      { key: "address_line_2" },
      { key: "file_type" },
      { key: "front_image" },
      { key: "back_image" },
      { key: "kyc_status" },
      { key: "kyc_approved" },
      { key: "reason" },
      { key: "fees" },
      { key: "merchant_fees" },
      { key: "client_fees" },
      { key: "user" },
    ];

    return formatCSVDataByColumnOrder(usersList, columnOrder);
  }, [usersList]);

  useEffect(() => {
    getUsersList();
  }, []);

  return (
    <>
      <h3 className="hidden md:block mb-8 font-semibold text-blackGrey-100 text-h3">
        KYC Requests
      </h3>

      {/* Table Actions Below */}

      <div>
        <CustomTable
          columns={columns}
          rows={usersList}
          csv={true}
          tableName="kyc-requests"
          initialPageSize={10}
          rowClickHandler={(row: any) => {
            if (
              getPermission(ModulesEnum.kyc)?.access_level ==
              AccessLevelEnum?.full
            ) {
              router.push(`/kyc/${row?.user?.id}`);
            }
          }}
          pagination
          columnClassName="max-w-[250px]"
          loading={isUsersListLoading}
          csvData={formatCsvData}
        />

        <ErrorApiText error={isUsersListError} />
      </div>
    </>
  );
};

export default PermissionAccess(
  KYCUsersPage,
  ModulesEnum.kyc,
  AccessLevelEnum.read
);
