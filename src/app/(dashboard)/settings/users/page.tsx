"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { Sync } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { userSettings_table_columns } from "./columns";

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
  return (
    <>
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Users</h2>
          <div className="actions flex gap-3">
            <Button variant="outlined" color="primary">
              <Sync />
            </Button>

            <Button variant="text" color="primary" disabled>
              New User
            </Button>
          </div>
        </div>

        <DataGrid
          rows={rows}
          columns={userSettings_table_columns}
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
            console.log(params);
            router.push(`/settings/users/details/${params?.row?.id}`);
          }}
          sortingOrder={["asc", "desc"]}
          pagination
        />
      </div>
    </>
  );
};

export default Users;
