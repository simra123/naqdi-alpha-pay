"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { profilesList_table_columns } from "./columns";
import LoadingApi from "@/components/common/LoadindApi";
import CustomTable from "@/components/common/CustomTable";
import ErrorApiText from "@/components/common/ErrorApiText";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { generateCSVApi } from "@/services/common";
import { useApi } from "@/hooks/useApi";

const rows = [
  {
    id: 1,
    createdAt: "2024-04-18",
    profileName: "Profile A",
    webhookUrl: "https://example.com/webhook",
    currencyConfiguration: "USD",
  },
  {
    id: 2,
    createdAt: "2024-04-18",
    profileName: "Profile A",
    webhookUrl: "https://example.com/webhook",
    currencyConfiguration: "USD",
  },
];

const Profiles = () => {
  const router = useRouter();

  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(rows)),
      successCallBack: (response: any) => {
        downloadCSV(response, "profiles.csv");
      },
    });
  };

  return (
    <>
      <h3 className="mb-8 font-semibold text-blackGrey-100 text-h3">
        Profiles
      </h3>

      <LoadingApi loading={false}>
        <CustomTable
          columns={profilesList_table_columns}
          // Filters={Filters}
          rows={rows}
          csv={true}
          tableName="profiles"
          initialPageSize={10}
          rowClickHandler={(row: any) =>
            router.push(`/profiles/details/${row?.id}`)
          }
          pagination
        />

        <ErrorApiText error={false} />
      </LoadingApi>
    </>
  );
};

export default Profiles;
