"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { userSettings_table_columns } from "./columns";
import LoaderButton from "@/components/common/LoaderButton";
import LoadingApi from "@/components/common/LoadindApi";
import CustomTable from "@/components/common/CustomTable";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { generateCSVApi } from "@/services/common";

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
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-h3 font-semibold text-blackGrey-100">Users</h3>

        <LoaderButton
          content={"New User"}
          className="px-16"
          variant="contained"
        />
      </div>

      <LoadingApi loading={false}>
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
      </LoadingApi>
    </>
  );
};

export default Users;
