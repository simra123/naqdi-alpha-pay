"use client";

import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { Button } from "@mui/material";
import { Sync } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { paymentsList_table_columns } from "./columns";
import Link from "next/link";

const rows = [
  {
    id: 1,
    createdAt: "2024-04-18",
    updatedAt: "2024-04-18",
    requestedPaymentAmount: "200 USD",
    amountPaid: "150 USD",
    paid: "Yes",
    status: "Completed",
  },
  // Add more rows here if needed
];
const Payments = () => {
  const router = useRouter();

  return (
    <>
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payments</h2>
          <div className="actions flex gap-3">
            <Button variant="outlined" color="primary">
              <Sync />
            </Button>
            <Button variant="outlined" color="primary">
              Export CSV
            </Button>
            <Button
              variant="text"
              color="primary"
              LinkComponent={Link}
              href="/payments/create"
            >
              New Payment
            </Button>
          </div>
        </div>

        <DataGrid
          rows={rows}
          columns={paymentsList_table_columns}
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
            router.push(`/payments/details/${params?.row?.id}`);
          }}
          sortingOrder={["asc", "desc"]}
          pagination
        />
      </div>
    </>
  );
};

export default Payments;
