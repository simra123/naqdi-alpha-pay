"use client";
import React, { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getAllWalletBalancesApi } from "@/services/wallet";
// import DepositModal from "@/components/Modals/DepoistModal";
import ErrorApiText from "@/components/common/ErrorApiText";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";

import { getAllWalletAssetsByAdminApi } from "@/services/admin/wallets";

import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { unitName } from "@/constants/blockchains";
import PermissionAccess from "@/middleware/PermissionAccess";
import "./dashboard.scss";
import { BorderedIconButton } from "@/components/common/IconButton";
import { ReciveIcon, SendIcon, TransferIcon } from "@/assets/Svgs";
import LoaderButton from "@/components/common/LoaderButton";
import PortfolioCard from "@/components/common/PortfolioCard";
import TransactionCard from "@/components/common/TransactionCard";
import PortfolioChart from "@/components/PortfolioChart";

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
      <div>
        {/* <DepositModal isOpen={openDeposit} setIsOpen={setOpenDeposit} /> */}

        {/* <div>
 <LoadingApi loading={isBalanceLoading}> 
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
        </LoadingApi>
        <ErrorApiText error={isBalanceError} />
      </div> */}
      </div>

      <div className="dashboard-layout">
        <div className="wallets min-h-[470px] py-[60px] px-8">
          <div className="flex flex-col justify-between h-full">
            <div>
              <h4 className="text-white font-bold text-h4 font-nunito text-center">
                Crypto Wallets
              </h4>
              <h3 className="text-white font-nunito text-center text-[92px] font-semibold overflow-hidden text-ellipsis leading-[110px]">
                $19,280.01
              </h3>
              <h6 className="text-purple-light-purple text-h4 font-nunito text-center font-semibold overflow-hidden text-ellipsis">
                38.43% Last Week
              </h6>
            </div>
            <div className="flex justify-between px-8">
              <BorderedIconButton className="w-[85px] h-[85px] bg-white !border-0">
                <ReciveIcon />
              </BorderedIconButton>
              <BorderedIconButton className="w-[85px] h-[85px] bg-white !border-0">
                <SendIcon />
              </BorderedIconButton>
              <BorderedIconButton className="px-7 h-[85px] bg-white !border-0 w-auto gap-4">
                <TransferIcon />
                <span className="font-nunito text-h3.5">Transfer</span>
              </BorderedIconButton>
            </div>
          </div>
        </div>
        <div className="portfolio">
          <div className="flex flex-col flex-auto">
            <div className="relative flex flex-col max-h-[470px]">
              {/* <header className="sticky top-0 z-10"> */}
                <h3 className="text-h4 font-nunito mb-2">My Portfolio</h3>
              {/* </header> */}

              <div className="flex-1 overflow-y-auto pr-4 flex flex-col gap-[14px]">
                <PortfolioCard
                  Balance={1000}
                  IconSrc="/currencies/bitcoin.png"
                  ChartLineData={"data"}
                  CurrencyName="Bitcoin"
                  CurrencyTicker="BTC"
                  onClick={() => {}}
                  onRecieve={() => {}}
                  onSend={() => {}}
                  onTransfer={() => {}}
                />
                <PortfolioCard
                  Balance={1000}
                  IconSrc="/currencies/bitcoin.png"
                  ChartLineData={"data"}
                  CurrencyName="Bitcoin"
                  CurrencyTicker="BTC"
                  onClick={() => {}}
                  onRecieve={() => {}}
                  onSend={() => {}}
                  onTransfer={() => {}}
                />
                <PortfolioCard
                  Balance={1000}
                  IconSrc="/currencies/bitcoin.png"
                  ChartLineData={"data"}
                  CurrencyName="Bitcoin"
                  CurrencyTicker="BTC"
                  onClick={() => {}}
                  onRecieve={() => {}}
                  onSend={() => {}}
                  onTransfer={() => {}}
                />
                <PortfolioCard
                  Balance={1000}
                  IconSrc="/currencies/bitcoin.png"
                  ChartLineData={"data"}
                  CurrencyName="Bitcoin"
                  CurrencyTicker="BTC"
                  onClick={() => {}}
                  onRecieve={() => {}}
                  onSend={() => {}}
                  onTransfer={() => {}}
                />
                <PortfolioCard
                  Balance={1000}
                  IconSrc="/currencies/bitcoin.png"
                  ChartLineData={"data"}
                  CurrencyName="Bitcoin"
                  CurrencyTicker="BTC"
                  onClick={() => {}}
                  onRecieve={() => {}}
                  onSend={() => {}}
                  onTransfer={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="history">
          <PortfolioChart />
        </div>
        <div className="transactions">
          <div className="border border-purple-10 py-[30px] px-5 rounded-[28px]">
            <div className="flex items-end justify-between mb-2">
              <h3 className="text-h4 font-nunito">Last Transactions</h3>
              <span className="text-caption">View All</span>
            </div>
            <div className="flex flex-col gap-4">
              <TransactionCard
                currencyName="Bitcoin"
                date="07:27 am Today"
                direction="incoming"
                onClick={() => {}}
                amount="$46000"
              />
              <TransactionCard
                currencyName="Bitcoin"
                date="07:27 am Today"
                direction="outgoing"
                onClick={() => {}}
                amount="$46000"
              />
              <TransactionCard
                currencyName="Bitcoin"
                date="07:27 am Today"
                direction="incoming"
                onClick={() => {}}
                amount="$46000"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionAccess(
  Home,
  ModulesEnum.wallet,
  AccessLevelEnum.read,
  { redirectOnNoAccess: true }
);
