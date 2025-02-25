"use client";
import React, { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { Role } from "@/constants/roles";
import { listAdminPayoutsApi, listUserPayoutsApi } from "@/services/payout";
import { generateCSVApi } from "@/services/common";
import ErrorApiText from "@/components/common/ErrorApiText";
import { formatPayouts } from "@/utils/dataFormatters";
import Chip from "@/components/common/Chip";
import CustomTable from "@/components/common/CustomTable";

const newsletter_table_columns = [
  { field: "uuid", headerName: "ID", sortable: true },
  { field: "created_at", headerName: "Date", sortable: true },
  { field: "email", headerName: "Email", sortable: true },
  {
    field: "status",
    headerName: "Status",
    sortable: true,
    dataValidator: (value) => {
      return <Chip status={value} />;
    },
  },
];

const NewsLetterSignups = () => {
  const user = useLocalStorage("user");

  const [NewsLetterUsers, setNewsLetterUsers] = useState([]);
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();
  const [
    isNewsLetterUsersLoading,
    isNewsLetterUsersError,
    callNewsLetterUsersApi,
  ] = useApi({ initailLoading: false });

  const getAllNewsLetterSignedUsers = async () => {
    // await callApiHook({
    //   apiCall: callNewsLetterUsersApi(
    //     user?.role == Role.ADMIN ? listUserPayoutsApi() : listAdminPayoutsApi()
    //   ),
    //   successCallBack: (response: any) => {
    //     const tableData = formatPayouts(response);
    //     setNewsLetterUsers(tableData);
    //   },
    // });
  };

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(NewsLetterUsers)),
      successCallBack: (response: any) => {
        downloadCSV(response, "newsletter-signups.csv");
      },
    });
  };

  useEffect(() => {
    getAllNewsLetterSignedUsers();
  }, []);

  return (
    <>
      <div className="items-center justify-between mb-8  hidden md:flex">
        <h3 className="text-h3 font-semibold text-blackGrey-100">
          NewsLetter Signups
        </h3>
      </div>

      <CustomTable
        loading={isNewsLetterUsersLoading}
        columns={newsletter_table_columns}
        rows={NewsLetterUsers}
        csv={{
          handler: ExportCSVHandler,
          loading: isCSVLoading,
          error: isCSVError,
        }}
        initialPageSize={10}
        pagination
      />

      <ErrorApiText error={isNewsLetterUsersError} />
    </>
  );
};

export default NewsLetterSignups;
