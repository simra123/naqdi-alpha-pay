"use client";

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getUsersListApi } from "@/services/admin/users";
import LoadingApi from "@/components/common/LoadindApi";
import moment from "moment";
import ErrorApiText from "@/components/common/ErrorApiText";
import SelectBox from "@/components/common/SelectBox";
import { withAuth } from "../../../middleware/RoleBaseAuth";
import { Role } from "@/constants/roles";
import { Button } from "@mui/material";
import { Sync } from "@mui/icons-material";

const columns = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "firstName", headerName: "First name", flex: 1 },
  { field: "lastName", headerName: "Last name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone", headerName: "Phone", flex: 1 },
  { field: "country", headerName: "Country", flex: 1 },
  { field: "userType", headerName: "User Type", flex: 1 },
  { field: "kycStatus", headerName: "KYC Status", flex: 1 },
  { field: "createdAt", headerName: "Created At", flex: 1 },
];

const statusList = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Pending", value: "pending" },
];

const UsersPage = () => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [usersList, setUsersList] = useState(null);
  const [isUsersListLoading, isUsersListError, callUsersListApi] = useApi(true);

  const getUsersList = async () => {
    setUsersList(null);
    await callApiHook({
      apiCall: callUsersListApi(
        getUsersListApi(selectedStatus == "all" ? "" : selectedStatus)
      ),
      successCallBack: (response) => {
        const filteredData = response?.map((data) => {
          return {
            id: data?.id,
            userId: data?.user?.id,
            firstName: data?.user?.first_name,
            lastName: data?.user?.last_name,
            email: data?.user?.email,
            phone: data?.phone_number,
            country: data?.country,
            kycStatus: data?.kyc_status,
            userType: data?.user?.user_type,
            createdAt: moment(data?.user?.created_at).format("DD-MM-YYYY"),
          };
        });
        setUsersList(filteredData);
      },
    });
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  useEffect(() => {
    getUsersList();
  }, [selectedStatus]);

  return (
    <div className="data-grid-container">
      <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">KYC Users</h2>
        <div className="actions grid grid-flow-col gap-3">
          <Button variant="outlined" color="primary" onClick={getUsersList}>
            <Sync />
          </Button>
          <Button variant="outlined" color="primary">
            Export CSV
          </Button>
          <SelectBox
            className="transparent !border-0 min-w-32 !p-0"
            options={statusList}
            value={selectedStatus}
            placeholder="Status"
            onChange={handleStatusChange}
            sx={{
              ".MuiSelect-outlined": {
                padding: "8px 12px !important",
              },

              borderRadius: "0 !important",
            }}
          />
        </div>
      </div>

      <LoadingApi loading={isUsersListLoading}>
        <DataGrid
          rows={usersList || []}
          columns={columns}
          className="border-t-0 primary-color font-semibold"
          sx={{
            ".MuiDataGrid-overlayWrapper": {
              padding: "25px",
            },
            ".MuiDataGrid-overlayWrapperInner": {
              height: "10px !important",
            },
          }}
          onRowClick={(params) => {
            router.push(`/kyc/${params?.row?.userId}`);
          }}
          sortingOrder={["asc", "desc"]}
          pagination
          autoHeight
        />
      </LoadingApi>
      <ErrorApiText error={isUsersListError} />
    </div>
  );
};

export default withAuth(UsersPage, [Role.ADMIN]);
