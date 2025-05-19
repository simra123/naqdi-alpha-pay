"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import LoaderButton from "@/components/common/LoaderButton";
import CustomTable from "@/components/common/CustomTable";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { generateCSVApi } from "@/services/common";

import useLocalStorage from "@/hooks/useLocalStorage";
import CreateUserModal from "@/components/Modals/CreateUserModal";
import { getSubusersApi } from "@/services/auth";
import { getSubAdminsApi } from "@/services/admin/auth";
import {
  AccessLevelEnum,
  ModalType,
  ModulesEnum,
  TableColumns,
} from "@/constants/types";
import Chip from "@/components/common/Chip";
import PermissionAccess from "@/middleware/PermissionAccess";
import { Role } from "@/constants/roles";
import { Tooltip } from "react-tooltip";
import { ColumnConfig, formatCSVDataByColumnOrder } from "@/utils/csv";

const userSettings_table_columns: TableColumns = [
  { field: "user_uuid", headerName: "ID" },
  { field: "email", headerName: "Email" },
  { field: "first_name", headerName: "First Name" },
  { field: "last_name", headerName: "Last Name" },
  {
    field: "verified",
    headerName: "Status",
    dataValidator(value, row) {
      return <Chip status={value ? "accepted" : "pending"} />;
    },
  },
];

const Users = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [isCreateOpen, setCreateOpen] = useState(false);

  const [subUsersList, setSubUsersList] = useState({ limit: 0, users: [] });
  const [isSubUsersListLoading, isSubUsersListError, callSubUsersListApi] =
    useApi();

  const fetchSubUsersList = async () => {
    await callApiHook({
      apiCall: callSubUsersListApi(
        user?.role == Role.USER ? getSubusersApi() : getSubAdminsApi()
      ),
      successCallBack: (response: any) => {
        setSubUsersList({
          limit: response?.limit,
          users: response?.subUsers || response?.subAdmins,
        });
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
      { key: "username" },
      { key: "email" },
      { key: "role" },
      { key: "user_type" },
      { key: "verified" },
      { key: "created_at" },
      { key: "updated_at" },
    ];

    return formatCSVDataByColumnOrder(subUsersList?.users, columnOrder);
  }, [subUsersList]);

  useEffect(() => {
    fetchSubUsersList();
  }, []);

  const createToggleHandler = () => {
    setCreateOpen(!isCreateOpen);
  };

  return (
    <>
      <CreateUserModal
        isOpen={isCreateOpen}
        type={ModalType.CREATE}
        refreshList={fetchSubUsersList}
        toggleHandler={createToggleHandler}
      />

      <div className="hidden md:flex justify-between items-center mb-8">
        <h3 className="font-semibold text-blackGrey-100 text-h3">Users</h3>
        <div className="flex items-center gap-3">
          <span className="bg-purple-400 px-3 py-1 rounded-full font-semibold text-white">
            {subUsersList.users.length} of {subUsersList.limit} users created
          </span>
          {PermissionAccess(
            LoaderButton,
            ModulesEnum.user,
            AccessLevelEnum.full
          )({
            content: "New User",
            className: "px-16",
            variant: "contained",
            onClick: createToggleHandler,
            disabled: subUsersList?.users?.length >= subUsersList.limit,
            tooltip: "Maximum number of users created. ",
            tooltipId: "sub-user-limit",
          })}
        </div>
      </div>
      <ErrorApiText error={isSubUsersListError} />

      <CustomTable
        columns={userSettings_table_columns}
        // Filters={Filters}
        loading={isSubUsersListLoading}
        rows={subUsersList?.users}
        csvData={formatCsvData}
        csv={true}
        tableName="sub-users"
        initialPageSize={10}
        rowClickHandler={(row: any) =>
          router.push(`/settings/users/details/${row?.id}`)
        }
        pagination
      />
      {/*  */}
    </>
  );
};

export default PermissionAccess(Users, ModulesEnum.user, AccessLevelEnum.read);
