"use client";
import React, { useEffect, useState } from "react";
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
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import { roundToPrecision } from "@/utils/math";
import { getAllWalletAssetsByAdminApi } from "@/services/admin/wallets";
import {
  formatBalanceForAdmin,
  formatBalanceForUser,
} from "@/utils/dataFormatters";
import LoaderButton from "@/components/common/LoaderButton";

const columns = [
  { field: "currency", headerName: "Currency", flex: 1 },
  { field: "transactionTotal", headerName: "Deposits", flex: 1 },
  { field: "paymentTransactionTotal", headerName: "Payments", flex: 1 },
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
  const user = useLocalStorage("user");
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
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDepoist = () => {
    setOpenDeposit(true);
  };

  const getBalances = async () => {
    if (user.role == Role.USER) {
      _getUserBalance();
    } else if (user?.role == Role.ADMIN) {
      _getAdminBalance();
    }
  };

  const _getUserBalance = async () => {
    await callApiHook({
      apiCall: callBalanceApi(getAllWalletBalancesApi()),
      successCallBack: (response: any) => {
        const tableData = formatBalanceForUser(response?.result);

        setBalance(tableData);
      },
    });
  };

  const _getAdminBalance = async () => {
    await callApiHook({
      apiCall: callBalanceApi(getAllWalletAssetsByAdminApi()),
      successCallBack: (response: any) => {
      
        const tableData = formatBalanceForUser(response?.result);
       
        setBalance(tableData);
      },
    });
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
              <LoaderButton
                content={<Sync />}
                loading={isBalanceLoading}
                onClick={getBalances}
              />
              <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
                <Button
                  className="transparent !w-auto"
                  endIcon={<Add />}
                  onClick={handleDepoist}
                >
                  Depoist Crypto
                </Button>
              </RenderRoleBased>
            </div>
          </div>
          <ErrorApiText error={isBalanceError} />

          <LoadingApi loading={isBalanceLoading}>
            <DataGrid
              rows={balance}
              columns={columns}
              hideFooter
              className="primary-color"
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
              <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
                <Button className="transparent !w-auto" endIcon={<Add />}>
                  Depoist Fiat
                </Button>
              </RenderRoleBased>
            </div>
          </div>
          <DataGrid
            rows={fiat}
            columns={fiatCols}
            className="primary-color"
            hideFooter
            autoHeight
          />
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default Home;
