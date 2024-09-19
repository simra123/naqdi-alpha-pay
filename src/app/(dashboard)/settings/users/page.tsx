"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { userSettings_table_columns } from "./columns";
import LoaderButton from "@/components/common/LoaderButton";
import CustomTable from "@/components/common/CustomTable";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { generateCSVApi } from "@/services/common";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Add } from "@mui/icons-material";

const rows = [
  {
    id: 1,
    email: "user@gmail.com",
    firstName: "Profile A",
    lastName: "https://example.com/webhook",
    status: "USD",
  },
];

const Users = () => {
  const router = useRouter();
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();
  const user = useLocalStorage("user");

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(rows)),
      successCallBack: (response: any) => {
        downloadCSV(response, "users.csv");
      },
    });
  };
  return (
    <>
      <div className="items-center justify-between mb-8 hidden md:flex">
        <h3 className="text-h3 font-semibold text-blackGrey-100">Users</h3>

        <LoaderButton
          content={"New User"}
          className="px-16"
          variant="contained"
        />
      </div>

      <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
        <LoaderButton
          content={<Add className="!text-h2" />}
          className="!p-1 !rounded-full !w-fit absolute right-4 bottom-12 md:hidden"
          variant="contained"
          onClick={() => console.log("In Development")}
        />
      </RenderRoleBased>

      <CustomTable
        columns={userSettings_table_columns}
        // Filters={Filters}
        rows={rows}
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

      <ErrorApiText error={false} />
    </>
  );
};

export default Users;
