"use client";
import React, { useEffect, useState } from "react";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { ConstantsUtil } from "@/constants/ConstantsUtil";
import { EthersConstants } from "@/constants/EthersConstants";
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
import CustomTable from "@/components/common/CustomTable";

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
    <>
      <DepositModal isOpen={openDeposit} setIsOpen={setOpenDeposit} />

      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8 md:block hidden">
        Alphaspay Dashboard
      </h3>

      <div>
        {/* <LoadingApi loading={isBalanceLoading}> */}
        <CustomTable
          columns={columns}
          equalColumns
          rows={balance}
          loading={isBalanceLoading}
          initialPageSize={10}
          actions={
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base sm:text-p122 text-black-100 font-semibold">
                Crypto Wallets
              </h4>

              <div className="flex items-center gap-2">
                <LoaderButton
                  content={"Reload"}
                  className="px-4 hidden lg:flex"
                  loading={isBalanceLoading}
                  onClick={getBalances}
                  variant="outlined"
                />
                <LoaderButton
                  content={<Sync className="text-button" />}
                  className="px-4 flex lg:hidden"
                  loading={isBalanceLoading}
                  onClick={getBalances}
                  variant="text"
                />
                <LoaderButton
                  content={"Deposit Crypto"}
                  className="px-4"
                  variant="outlined"
                  onClick={handleDepoist}
                />
              </div>
            </div>
          }
        />
        {/* </LoadingApi> */}
        <ErrorApiText error={isBalanceError} />
      </div>

      {/* <div>
        
          <CustomTable
            columns={fiatCols}
            rows={fiat}
            actions={
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-p122 text-black-100 font-semibold">
                  Crypto Wallets
                </h4>

                <div className="flex items-center gap-2">
                  <LoaderButton
                    content={"Reload"}
                    className="px-4"
                    loading={isBalanceLoading}
                    onClick={getBalances}
                    variant="outlined"
                  />
                  <LoaderButton
                    content={"Deposit Crypto"}
                    className="px-4"
                    variant="outlined"
                  />
                </div>
              </div>
            }
          />
        
         <ErrorApiText error={isBalanceError} /> 
      </div> */}
    </>
  );
};

export default Home;
