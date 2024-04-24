"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { DataGrid } from "@mui/x-data-grid";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  useWalletInfo,
} from "@web3modal/ethers/react";
import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { ConstantsUtil } from "@/constants/ConstantsUtil";
import { EthersConstants } from "@/constants/EthersConstants";
import { proxy } from "valtio/vanilla";
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
    id: 2,
    currency: "EUR",
    available_balance: "0.00003 BTC",
    pending_balance: "3 BTC",
  },
];

const Home = () => {
  const modal = createWeb3Modal({
    themeMode: "light",

    ethersConfig: defaultConfig({
      metadata: ConstantsUtil.Metadata,
      defaultChainId: 1,
      rpcUrl: "https://cloudflare-eth.com",
    }),
    chains: EthersConstants.chains,
    projectId: ConstantsUtil.ProjectId,
    enableAnalytics: true,
    metadata: ConstantsUtil.Metadata,
    termsConditionsUrl: "https://walletconnect.com/terms",
    privacyPolicyUrl: "https://walletconnect.com/privacy",
  });

  async function onSendTransaction() {
    const walletProvider = modal?.getWalletProvider();
    const walletConnected = modal?.getIsConnected();
    const walletChain = modal?.getChainId();

    try {
      if (!walletProvider || !walletConnected) {
        throw Error("user is disconnected");
      }
      const provider = new BrowserProvider(walletProvider, walletChain);
      const signer = new JsonRpcSigner(provider, modal?.getAddress());
      const tx = await signer.sendTransaction({
        to: modal?.getAddress(),
        value: ethers.parseUnits("8000", "gwei"),
        // maxFeePerGas: ethers.parseUnits("200", "gwei"),
        // maxPriorityFeePerGas: ethers.parseUnits("200", "gwei"),
      });
      console.log(tx);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <DashboardPageWrapper>
      <div className="flex items-center justify-between mb-5 dark">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="actions flex gap-3">
          <button className="send" onClick={onSendTransaction}>
            Send
          </button>
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
