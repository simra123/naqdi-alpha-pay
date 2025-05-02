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
import { getNewsSignedUpUsersByAdminApi } from "@/services/admin/news";
import moment from "moment";
import { formatDateToUserTimeZone } from "@/utils/dates";
import PermissionAccess from "@/middleware/PermissionAccess";
import { AccessLevelEnum, ModulesEnum } from "@/constants/types";

const newsletter_table_columns = [
  { field: "id", headerName: "ID", sortable: true },
  {
    field: "created_at",
    headerName: "Created At",
    sortable: true,
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
    field: "email",
    headerName: "Email",
    sortable: true,
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
    await callApiHook({
      apiCall: callNewsLetterUsersApi(
        user?.role == Role.ADMIN && getNewsSignedUpUsersByAdminApi()
      ),
      successCallBack: (response: any) => {
        setNewsLetterUsers(response);
      },
    });
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
      <div className="hidden md:flex justify-between items-center mb-8">
        <h3 className="font-semibold text-blackGrey-100 text-h3">
          NewsLetter Signups
        </h3>
      </div>

      <CustomTable
        loading={isNewsLetterUsersLoading}
        columns={newsletter_table_columns}
        rows={NewsLetterUsers}
        csv={true}
        tableName="news-signedup-users"
        initialPageSize={10}
        pagination
      />

      <ErrorApiText error={isNewsLetterUsersError} />
    </>
  );
};

export default PermissionAccess(
  NewsLetterSignups,
  ModulesEnum.newsletter,
  AccessLevelEnum.read
);
