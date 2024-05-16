"use client";

import { Sync } from "@mui/icons-material";
import { Button, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import SelectBox from "@/components/common/SelectBox";
import { withAuth } from "@/middleware/RoleBaseAuth";
import { Role } from "@/constants/roles";
import { getAllUsersByAdminApi } from "@/services/admin/users";
import { formatUsers } from "@/utils/dataFormatters";

const statusList = [
  { label: "All", value: "all" },
  { label: "Verified", value: "verified" },
  { label: "Unverified", value: "unverified" },
];

const ChipMaker = (verified: boolean) => {
  return (
    <Chip
      label={verified ? "Verified" : "UnVerified"}
      variant="filled"
      color={verified ? "success" : "warning"}
    />
  );
};

const usersList_table_columns: any = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "first_name", headerName: "First Name", flex: 1 },
  { field: "last_name", headerName: "Last Name", flex: 1 },
  { field: "username", headerName: "Username", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "user_type", headerName: "User Type", flex: 1 },
  {
    field: "verified",
    headerName: "Verified",
    flex: 1,
    renderCell: (params) => {
      const { value } = params;
      return ChipMaker(value);
    },
  },
  { field: "created_at", headerName: "Created", flex: 1 },
  { field: "updated_at", headerName: "Updated", flex: 1 },
];

const Users = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isUsersLoading, isUsersError, callUsersApi] = useApi(true);

  const getAllUsersAdmin = async () => {
    await callApiHook({
      apiCall: callUsersApi(getAllUsersByAdminApi()),
      successCallBack: (response) => {
        setUsers(formatUsers(response));
      },
    });
  };

  const handleChange = (event) => {
    setSelectedStatus(event?.target?.value);
  };

  useEffect(() => {
    getAllUsersAdmin();
  }, []);

  return (
    <>
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Users</h2>
          <div className="actions grid grid-flow-col gap-3">
            <Button
              variant="outlined"
              color="primary"
              onClick={getAllUsersAdmin}
            >
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
              onChange={handleChange}
              sx={{
                ".MuiSelect-outlined": {
                  padding: "8px 12px !important",
                },

                borderRadius: "0 !important",
              }}
            />
          </div>
        </div>
        <ErrorApiText error={isUsersError} />
        <LoadingApi loading={isUsersLoading}>
          <DataGrid
            autoHeight
            rows={users}
            columns={usersList_table_columns}
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
              router.push(`/users/details/${params?.row?.id}`);
            }}
            sortingOrder={["asc", "desc"]}
            pageSizeOptions={[10, 25, 50, 100]}
            pagination
          />
        </LoadingApi>
      </div>
    </>
  );
};

export default withAuth(Users, [Role.ADMIN]);
