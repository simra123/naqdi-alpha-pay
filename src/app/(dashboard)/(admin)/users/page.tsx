"use client";

import React, { useEffect, useState } from "react";
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
          <span className="text-subtitle text-custom-title-gray">{time}</span>
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
          <span className="text-subtitle text-custom-title-gray">{time}</span>
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

const Users = () => {
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

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(users)),
      successCallBack: (response: any) => {
        downloadCSV(response, "users.csv");
      },
    });
  };

  useEffect(() => {
    getAllUsersAdmin();
  }, []);

  return (
    <>
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8 md:block hidden">
        Users
      </h3>

      {/* Table Actions Below */}

      <div>
        <CustomTable
          loading={isUsersLoading}
          columns={usersList_table_columns}
          rows={users}
          csv={{
            handler: ExportCSVHandler,
            loading: isCSVLoading,
            error: isCSVError,
          }}
          initialPageSize={10}
          rowClickHandler={(row: any) =>
            router.push(`/users/details/${row?.id}`)
          }
          pagination
          columnClassName="max-w-[250px]"
        />

        <ErrorApiText error={isUsersError} />
      </div>
    </>
  );
};

export default PermissionAccess(
  Users,
  ModulesEnum.merchant,
  AccessLevelEnum.read
);
