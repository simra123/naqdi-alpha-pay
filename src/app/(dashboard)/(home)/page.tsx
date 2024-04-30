"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { DataGrid } from "@mui/x-data-grid";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { ConstantsUtil } from "@/constants/ConstantsUtil";
import { EthersConstants } from "@/constants/EthersConstants";
import { Button } from "@mui/material";
import { Add, Sync } from "@mui/icons-material";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import {
  createDepoistAddressApi,
  getAllWalletBalancesApi,
} from "@/services/wallet";
import LoadingApi from "@/components/common/LoadindApi";
import DepositModal from "@/components/common/DepoistModal";
import ErrorApiText from "@/components/common/ErrorApiText";

const columns = [
  { field: "currency", headerName: "Currency", flex: 1 },
  { field: "network", headerName: "Network", flex: 1 },
  { field: "totalAmount", headerName: "Available Balance", flex: 1 },
];

const fiatCols = [
  { field: "currency", headerName: "Currency", flex: 1 },
  { field: "pending_balance", headerName: "Pending Balance", flex: 1 },
  { field: "available_balance", headerName: "Available Balance", flex: 1 },
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
  const [isBalanceLoading, isBalanceError, callBalanceApi] = useApi(true);
  const [balance, setBalance] = useState([]);
  const [openDeposit, setOpenDeposit] = useState(null);

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

  const onSendTransaction = async () => {
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
  };

  const handleDepoist = () => {
    setOpenDeposit(true);
  };

  const getBalances = async () => {
    await callApiHook({
      apiCall: callBalanceApi(getAllWalletBalancesApi()),
      successCallBack: (response: any) => {
        const tableData = response?.result?.map((item: any) => ({
          id: item?.wallet_id,
          currency: capitalize(item?.wallet_blockchain),
          network: capitalize(item?.wallet_network),
          totalAmount: item?.totalAmount,
        }));
        setBalance(tableData);
      },
    });
  };

  const capitalize = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  useEffect(() => {
    getBalances();
  }, []);

  return (
    <DashboardPageWrapper>
      <DepositModal isOpen={openDeposit} setIsOpen={setOpenDeposit} />
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
          <div className="walletHeading flex justify-between items-center mb-[8px]">
            <h3 className="text-[18px]">Crypto Wallets</h3>
            <div className="flex gap-1">
              <Button className="transparent !w-auto" onClick={getBalances}>
                <Sync />
              </Button>
              <Button
                className="transparent !w-auto"
                endIcon={<Add />}
                onClick={handleDepoist}
              >
                Depoist Crypto
              </Button>
            </div>
          </div>
          <ErrorApiText error={isBalanceError} />
          <LoadingApi loading={isBalanceLoading}>
            <DataGrid
              rows={balance}
              columns={columns}
              hideFooter
              className="font-semibold primary-color"
              autoHeight
            />
          </LoadingApi>
        </div>
        <div className="walletsList">
          <div className="walletHeading flex justify-between items-center mb-[8px]">
            <h3 className="text-[18px]">Fiat Wallets</h3>
            <div className="flex gap-1">
            <Button className="transparent !w-auto">
                <Sync />
              </Button>
            <Button className="transparent !w-auto" endIcon={<Add />}>
              Depoist Fiat
            </Button>
            </div>
          </div>
          <DataGrid
            rows={fiat}
            columns={fiatCols}
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
