"use client";

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

const columns = [
  { field: "id", headerName: "ID", flex: 1 },
  {
    field: "firstName",
    headerName: "First name",
    flex: 1,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    flex: 1,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    flex: 1,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    flex: 1,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const statusList = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Pending", value: "pending" },
];

const Home = () => {
  const router = useRouter();

  return (
    <div className="data-grid-container">
      <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users</h2>
      </div>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
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
          // router.push(`/kyc/${params?.row?.userId}`);
        }}
        // checkboxSelection
        disableSelectionOnClick
        sortingOrder={["asc", "desc"]}
        pagination
      />
    </div>
  );
};

export default Home;
