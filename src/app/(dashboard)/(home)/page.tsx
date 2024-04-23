"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { DataGrid } from "@mui/x-data-grid";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
const columns = [
  { field: "currency", headerName: "Currency", flex: 1 },
  { field: "available_balance", headerName: "Available Balance", flex: 1 },
  { field: "pending_balance", headerName: "Pending Balance", flex: 1 },
];

const cryptos = [
  {
    id: 1,
    currency: "Bitcoin",
    available_balance: "0.00003 BTC",
    pending_balance: "3 BTC",
  },
  {
    id: 2,
    currency: "Ethereum",
    available_balance: "0.00003 BTC",
    pending_balance: "3 ETH",
  },
  {
    id: 3,
    currency: "Solana",
    available_balance: "0.00003 BTC",
    pending_balance: "3 ETC",
  },
];
const fiat = [
  {
    id: 1,
    currency: "USD",
    available_balance: "0.00003 BTC",
    pending_balance: "3 BTC",
  },
  {
    id: 1,
    currency: "EUR",
    available_balance: "0.00003 BTC",
    pending_balance: "3 BTC",
  },
];

const Home = () => {
  const router = useRouter();

  return (
    <DashboardPageWrapper>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="actions flex gap-3">
          <w3m-button />
          <w3m-network-button />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="walletsList">
          <div className="walletHeading">
            <h3 className="text-[18px] mb-4">Crypto Wallets</h3>
          </div>
          <DataGrid
            rows={cryptos}
            columns={columns}
            hideFooter
            className="font-semibold primary-color"
            autoHeight
          />
        </div>
        <div className="walletsList">
          <div className="walletHeading">
            <h3 className="text-[18px] mb-4">Fiat Wallets</h3>
          </div>
          <DataGrid
            rows={fiat}
            columns={columns}
            className="font-semibold primary-color"
            hideFooter
            autoHeight
          />
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default Home;
