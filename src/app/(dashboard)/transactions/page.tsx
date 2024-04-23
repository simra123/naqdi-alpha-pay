"use client";

import { Sync } from "@mui/icons-material";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { transactionsList_table_columns } from "./columns";
import { useRouter } from "next/navigation";

const rows = [
  {
    id: 1,
    dateReceived: "2024-04-18",
    transactionHash: "0x1234567890abcdef",
    amount: "0.5 ETH",
    sourceWalletAddress: "0xABCDEF1234567890",
    paymentAddress: "0x0987654321ABCDEF",
    network: "Ethereum",
    confirmed: "Yes",
  },
];

const Transactions = () => {
  const router = useRouter();

  return (
    <>
      {" "}
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Transactions</h2>
          <div className="actions flex gap-3">
            <Button variant="outlined" color="primary">
              <Sync />
            </Button>
            <Button variant="outlined" color="primary">
              Export CSV
            </Button>
          </div>
        </div>

        <DataGrid
          rows={rows}
          columns={transactionsList_table_columns}
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
            router.push(`/transactions/${params?.row?.id}`);
          }}
          // checkboxSelection
          disableSelectionOnClick
          sortingOrder={["asc", "desc"]}
          pagination
        />
      </div>
    </>
  );
};

export default Transactions;
