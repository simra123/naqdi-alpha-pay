"use client";
import React, { useEffect, useState } from "react";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { ConstantsUtil } from "@/constants/ConstantsUtil";
import { EthersConstants } from "@/constants/EthersConstants";
import { Sync } from "@mui/icons-material";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getAllWalletBalancesApi } from "@/services/wallet";
import DepositModal from "@/components/Modals/DepoistModal";
import ErrorApiText from "@/components/common/ErrorApiText";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";

import { getAllWalletAssetsByAdminApi } from "@/services/admin/wallets";

import LoaderButton from "@/components/common/LoaderButton";
import CustomTable from "@/components/common/CustomTable";
import { TableColumns } from "@/constants/types";

const columns: TableColumns = [
  { field: "id", headerName: "ID" },
  {
    field: "unit",
    headerName: "Currency",
    dataValidator(value, row: { standard: string | null }) {
      return row?.standard ? `${value} (${row?.standard})` : `${value}`;
    },
  },
  { field: "amount", headerName: "Balance" },
];

const Home = () => {
  const user = useLocalStorage("user");
  const [isBalanceLoading, isBalanceError, callBalanceApi] = useApi(true);
  const [balance, setBalance] = useState([]);
  const [openDeposit, setOpenDeposit] = useState(null);

  // const modal = createWeb3Modal({
  //   themeMode: "light",

  //   ethersConfig: defaultConfig({
  //     metadata: ConstantsUtil.Metadata,
  //     defaultChainId: 1,
  //     rpcUrl: "https://cloudflare-eth.com",
  //   }),
  //   chains: EthersConstants.chains,
  //   projectId: ConstantsUtil.ProjectId,
  //   enableAnalytics: true,
  //   metadata: ConstantsUtil.Metadata,
  //   termsConditionsUrl: "https://walletconnect.com/terms",
  //   privacyPolicyUrl: "https://walletconnect.com/privacy",
  // });

  // const onSendTransaction = async () => {
  //   const walletProvider = modal?.getWalletProvider();
  //   const walletConnected = modal?.getIsConnected();
  //   const walletChain = modal?.getChainId();

  //   try {
  //     if (!walletProvider || !walletConnected) {
  //       throw Error("user is disconnected");
  //     }
  //     const provider = new BrowserProvider(walletProvider, walletChain);
  //     const signer = new JsonRpcSigner(provider, modal?.getAddress());
  //     const tx = await signer.sendTransaction({
  //       to: modal?.getAddress(),
  //       value: ethers.parseUnits("8000", "gwei"),
  //       // maxFeePerGas: ethers.parseUnits("200", "gwei"),
  //       // maxPriorityFeePerGas: ethers.parseUnits("200", "gwei"),
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

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
        setBalance(response);
      },
    });
  };

  const _getAdminBalance = async () => {
    await callApiHook({
      apiCall: callBalanceApi(getAllWalletAssetsByAdminApi()),
      successCallBack: (response: any) => {
        setBalance(response?.result);
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
