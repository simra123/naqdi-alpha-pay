"use client";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { withdrawalsList_table_columns } from "./columns";
import { Button } from "@mui/material";
import { Sync } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const rows = [
  {
    id: 1,
    createdAt: "2024-04-18",
    sourceAmount: "500 USD",
    netAmount: "450 USD",
    status: "Pending",
    walletAddress: "0x1234567890abcdef",
    profile: "Customer",
  },
  // Add more rows here if needed
];

const Withdrawals = () => {
  const router = useRouter();
  return (
    <>
      {" "}
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Withdrawals</h2>
          <div className="actions flex gap-3">
            <Button variant="outlined" color="primary">
              <Sync />
            </Button>
            <Button variant="outlined" color="primary">
              Export CSV
            </Button>
            <Button variant="text" color="primary" disabled>
              New Withdrawal
            </Button>
          </div>
        </div>

        <DataGrid
          rows={rows}
          columns={withdrawalsList_table_columns}
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
            router.push(`/withdrawals/${params?.row?.id}`);
          }}
          sortingOrder={["asc", "desc"]}
          pagination
        />
      </div>
    </>
  );
};

export default Withdrawals;
