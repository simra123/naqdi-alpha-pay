"use client";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { payoutsList_table_columns } from "./columns";
import { Button } from "@mui/material";
import { Sync } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

const rows = [
  {
    id: 1,
    payoutId: "Payout123",
    createdAt: "2024-04-18",
    grossAmount: "1000 USD",
    toBankAccount: "Bank of America",
    status: "Completed",
  },
  // Add more rows here if needed
];
const Payouts = () => {
  const router = useRouter();
  return (
    <>
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payouts</h2>
          <div className="actions flex gap-3">
            <Button variant="outlined" color="primary">
              <Sync />
            </Button>
            <Button variant="outlined" color="primary">
              Export CSV
            </Button>
            <Button variant="text" color="primary" LinkComponent={Link} href="/payouts/create">
              New Payout
            </Button>
          </div>
        </div>

        <DataGrid
          rows={rows}
          columns={payoutsList_table_columns}
          className="border-t-0 primary-color"
          sx={{
            ".MuiDataGrid-overlayWrapper": {
              padding: "25px",
            },
            ".MuiDataGrid-overlayWrapperInner": {
              height: "10px !important",
            },
          }}
          onRowClick={(params) => {
            
            router.push(`/payouts/details/${params?.row?.id}`);
          }}
          sortingOrder={["asc", "desc"]}
          pagination
        />
      </div>
    </>
  );
};

export default Payouts;
