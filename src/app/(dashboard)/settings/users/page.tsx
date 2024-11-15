"use client";
import React, { useEffect, useState } from "react";
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
import { AccessLevelEnum, ModalType, ModulesEnum, TableColumns } from "@/constants/types";
import Chip from "@/components/common/Chip";
import PermissionAccess from "@/middleware/PermissionAccess";

export const userSettings_table_columns: TableColumns = [
  { field: "user_uuid", headerName: "ID" },
  { field: "email", headerName: "Email" },
  { field: "first_name", headerName: "First Name" },
  { field: "last_name", headerName: "Last Name" },
  {
    field: "verified",
    headerName: "Status",
    dataValidator(value) {
      return <Chip status={value ? "accepted" : "pending"} />;
    },
  },
];



const Users = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();
  const [subUsersList, setSubUsersList] = useState([]);
  const [isSubUsersListLoading, isSubUsersListError, callSubUsersListApi] =
    useApi();

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(subUsersList)),
      successCallBack: (response: any) => {
        downloadCSV(response, "sub-users.csv");
      },
    });
  };

  const fetchSubUsersList = async () => {
    await callApiHook({
      apiCall: callSubUsersListApi(getSubusersApi()),
      successCallBack: (response: any) => {
        setSubUsersList(response);
      },
    });
  };

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

      <div className="items-center justify-between mb-8 hidden md:flex">
        <h3 className="text-h3 font-semibold text-blackGrey-100">Users</h3>
        <>
          {PermissionAccess(
            LoaderButton,
            ModulesEnum.user,
            AccessLevelEnum.full
          )({
            content: "New User",
            className: "px-16",
            variant: "contained",
            onClick: createToggleHandler,
          })}
        </>
      </div>
      <ErrorApiText error={isSubUsersListError} />

      <CustomTable
        columns={userSettings_table_columns}
        // Filters={Filters}
        loading={isSubUsersListLoading}
        rows={subUsersList}
        csv={{
          handler: ExportCSVHandler,
          loading: isCSVLoading,
          error: isCSVError,
        }}
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
