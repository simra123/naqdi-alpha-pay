"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { getKYCUsersListApi } from "@/services/admin/users";
import moment from "moment";
import ErrorApiText from "@/components/common/ErrorApiText";

import { Role } from "@/constants/roles";
import { TableColumns } from "@/constants/types";
import Chip from "@/components/common/Chip";
import CustomTable from "@/components/common/CustomTable";
import { generateCSVApi } from "@/services/common";

const columns: TableColumns = [
  { field: "id", headerName: "ID" },
  { field: "createdAt", headerName: "Created At" },
  { field: "firstName", headerName: "First name" },
  { field: "lastName", headerName: "Last name" },
  { field: "email", headerName: "Email" },
  { field: "phone", headerName: "Phone" },
  { field: "country", headerName: "Country" },
  { field: "userType", headerName: "User Type" },
  { field: "fees", headerName: "Fee" },
  {
    field: "kycStatus",
    headerName: "Status",
    dataValidator(value) {
      const status = value ? "Approved" : "Unapproved";
      return <Chip status={status} />;
    },
  },
];

const KYCUsersPage = () => {
  const router = useRouter();
  const [usersList, setUsersList] = useState([]);
  const [isUsersListLoading, isUsersListError, callUsersListApi] = useApi({initailLoading:true});
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const getUsersList = async () => {
    await callApiHook({
      apiCall: callUsersListApi(getKYCUsersListApi({ status: "" })),
      successCallBack: (response) => {
        const filteredData = response?.map((data) => {
          return {
            id: data?.id,
            createdAt: moment(data?.user?.created_at).format(
              "DD-MM-YYYY : hh:mm a"
            ),
            userId: data?.user?.id,
            firstName: data?.user?.first_name,
            lastName: data?.user?.last_name,
            email: data?.user?.email,
            phone: data?.phone_number,
            country: data?.country,
            kycStatus: data?.kyc_approved,
            fees: data?.fees ? `${data?.fees} %` : "_",
            userType: data?.user?.user_type,
          };
        });
        setUsersList(filteredData);
      },
    });
  };

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(usersList)),
      successCallBack: (response: any) => {
        downloadCSV(response, "kyc-requests.csv");
      },
    });
  };

  useEffect(() => {
    getUsersList();
  }, []);

  return (
    <>
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8 md:block hidden">
        KYC Requests
      </h3>

      {/* Table Actions Below */}

      <div>
        <CustomTable
          columns={columns}
          rows={usersList}
          csv={{
            handler: ExportCSVHandler,
            loading: isCSVLoading,
            error: isCSVError,
          }}
          initialPageSize={10}
          rowClickHandler={(row: any) => router.push(`/kyc/${row?.userId}`)}
          pagination
          columnClassName="max-w-[250px]"
          loading={isUsersListLoading}
        />

        <ErrorApiText error={isUsersListError} />
      </div>
    </>
  );
};

export default KYCUsersPage;
