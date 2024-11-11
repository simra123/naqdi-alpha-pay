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
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { unitName } from "@/constants/blockchains";
import PermissionAccess from "@/middleware/PermissionAccess";

const adminColumns: TableColumns = [
  {
    field: "unit",
    headerName: "Currency",
    dataValidator(value, row: { standard: string | null }) {
      return row?.standard
        ? `${value} (${row?.standard})`
        : `${unitName[value.toLocaleLowerCase()]}`;
    },
  },
  { field: "amount", headerName: "Balance" },
];

const columns: TableColumns = [
  { field: "user_balance_uuid", headerName: "ID" },
  ...adminColumns,
];

const Home = () => {
  const user = useLocalStorage("user");
  const [isBalanceLoading, isBalanceError, callBalanceApi] = useApi({
    initailLoading: true,
  });
  const [balance, setBalance] = useState([]);
  const [openDeposit, setOpenDeposit] = useState(null);

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
        setBalance(response);
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
          columns={user?.role == Role.USER ? columns : adminColumns}
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
                {user?.role == Role.USER && (
                  <>
                    {PermissionAccess(
                      LoaderButton,
                      ModulesEnum.wallet,
                      AccessLevelEnum.full
                    )({
                      content: "Deposit Crypto",
                      className: "px-4",
                      variant: "outlined",
                      onClick: handleDepoist,
                    })}
                    ,
                  </>
                )}
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

export default PermissionAccess(Home, ModulesEnum.wallet, AccessLevelEnum.read);
