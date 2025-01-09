"use client";
import React, { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import {
  getAllWalletBalancesApi,
  getProfitPercentageApi,
  getTotalPortfolioValueApi,
} from "@/services/wallet";
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
import { getAllTransactionsApi } from "@/services/transaction";
import LoadingApi from "@/components/common/LoadindApi";
import CountUp from "react-countup";
import DepositModal from "@/components/Modals/DepoistModal";
import CustomTable from "@/components/common/CustomTable";
import { Sync } from "@mui/icons-material";
import CreateWithdrawalModal from "@/components/Modals/CreateWithdrawalModal";
import Link from "next/link";

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
  const [isPortfolioLoading, isPorfolioError, callPortfolioApi] = useApi({
    initailLoading: true,
  });
  const [
    isLastTransactionsLoading,
    isLastTransactionsError,
    callLastTransactionsApi,
  ] = useApi({
    initailLoading: true,
  });
  const [
    isTotalPortfolioLoading,
    isTotalPortfolioError,
    callTotalPortfolioApi,
  ] = useApi({
    initailLoading: true,
  });
  const [
    isPotfolioPercentageLoading,
    isPotfolioPercentageError,
    callPotfolioPercentageApi,
  ] = useApi({
    initailLoading: true,
  });
  const [portfolioPercentage, setPortfolioPercentage] = useState(0);
  const [totalPortfolio, setTotalPorfolio] = useState(0);
  const [portfolio, setPortfolio] = useState([]);
  const [depoistData, setDepositData] = useState<{
    blockchain?: null | string;
    standard?: null | string;
  }>({ blockchain: null, standard: null });
  const [withdrawData, setWithdrawData] = useState<{
    blockchain?: null | string;
  }>({ blockchain: null });
  const [lastTransactions, setLastTransactions] = useState([]);
  const [openDeposit, setOpenDeposit] = useState(null);
  const [openWithdraw, setOpenWithdrawal] = useState(null);

  const handleDepoist = () => {
    setOpenDeposit(true);
  };
  const closeDepoist = () => {
    setOpenDeposit(false);
    setDepositData({
      blockchain: null,
      standard: null,
    });
  };

  const handleDepoistAndCreateAddress = (
    blockchain: string,
    standard: string
  ) => {
    setOpenDeposit(true);
    setDepositData({
      blockchain,
      standard,
    });
  };
  const handleWithdrawAndSetBlockchain = (blockchain: string) => {
    setOpenWithdrawal(true);
    setWithdrawData({
      blockchain,
    });
  };

  const handleWithdrawalToggler = () => {
    setOpenWithdrawal(!openWithdraw);
    setWithdrawData({ blockchain: null });
  };

  const getBalances = async () => {
    if (user.role == Role.USER) {
      _getUserBalance();
    } else if (user?.role == Role.ADMIN) {
      _getAdminBalance();
    }
  };

  const getTotalPortfolioValue = async () => {
    await callApiHook({
      apiCall: callTotalPortfolioApi(getTotalPortfolioValueApi()),
      successCallBack: (response: any) => {
        setTotalPorfolio(response?.totalUSDT);
      },
    });
  };
  const getLastTransactions = async () => {
    await callApiHook({
      apiCall: callLastTransactionsApi(
        getAllTransactionsApi({ count: 1, limit: 5 })
      ),
      successCallBack: (response: any) => {
        setLastTransactions(response);
      },
    });
  };
  const getPortfolioPLPercentage = async () => {
    await callApiHook({
      apiCall: callPotfolioPercentageApi(getProfitPercentageApi()),
      successCallBack: (response: any) => {
        setPortfolioPercentage(response);
      },
    });
  };
  const _getUserBalance = async () => {
    await callApiHook({
      apiCall: callPortfolioApi(getAllWalletBalancesApi()),
      successCallBack: (response: any) => {
        setPortfolio(response);
      },
    });
  };

  const _getAdminBalance = async () => {
    await callApiHook({
      apiCall: callPortfolioApi(getAllWalletAssetsByAdminApi()),
      successCallBack: (response: any) => {
        setPortfolio(response);
      },
    });
  };

  const UserApiCalls = () => {
    getTotalPortfolioValue();
    getPortfolioPLPercentage();
    getLastTransactions();
  };

  useEffect(() => {
    getBalances();
    user?.role == Role.USER && UserApiCalls();
  }, []);

  return (
    <>
      <DepositModal
        isOpen={openDeposit}
        setIsOpen={closeDepoist}
        blockchain={depoistData?.blockchain}
        standard={depoistData?.standard}
      />
      <CreateWithdrawalModal
        isOpen={openWithdraw}
        refreshHandler={() => {}}
        blockchain={withdrawData?.blockchain}
        toggleHandler={handleWithdrawalToggler}
      />

      {user?.role == Role.ADMIN && (
        <>
          <CustomTable
            columns={adminColumns}
            rows={portfolio}
            loading={isPortfolioLoading}
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
                    loading={isPortfolioLoading}
                    onClick={getBalances}
                    variant="outlined"
                  />
                  <LoaderButton
                    content={<Sync className="text-button" />}
                    className="px-4 flex lg:hidden"
                    loading={isPortfolioLoading}
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
          <ErrorApiText error={isPorfolioError} />
        </>
      )}
      {user?.role == Role.USER && (
        <div className="dashboard-layout">
          <div className="wallets min-h-[470px] py-[60px] px-8">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h4 className="text-white font-bold text-h4 font-nunito text-center">
                  Crypto Wallets
                </h4>
                <h3 className="text-white font-nunito text-center text-[92px] font-semibold overflow-hidden text-ellipsis leading-[110px]">
                  $
                  <CountUp
                    end={totalPortfolio}
                    separator=","
                    decimal="."
                    decimals={2}
                  />
                </h3>
                <ErrorApiText error={isTotalPortfolioError} />
                <h6 className="text-purple-light-purple text-h4 font-nunito text-center font-semibold overflow-hidden text-ellipsis">
                  38.43% Last Week
                </h6>
              </div>
              <div className="flex justify-between px-8">
                <BorderedIconButton
                  className="w-[85px] h-[85px] bg-white !border-0"
                  onClick={handleDepoist}
                >
                  <ReciveIcon />
                </BorderedIconButton>
                <BorderedIconButton
                  className="w-[85px] h-[85px] bg-white !border-0"
                  onClick={handleWithdrawalToggler}
                >
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
                  <LoadingApi loading={isPortfolioLoading}>
                    {portfolio?.map((asset) => {
                      let unit = asset?.unit;
                      let tokenName = `${unit} (${asset?.standard})`;
                      let coinName = unitName[unit?.toLowerCase()] || "Unknown";
                      let currencyTicker =
                        asset?.type == "coin" ? unit : tokenName;
                      let currencyHistoryData = asset?.historyData?.map(
                        (item) => item?.rate_open
                      );
                      let depoistBlockchain = asset?.standard
                        ? unit
                        : coinName?.toLowerCase();
                      return (
                        <PortfolioCard
                          Balance={asset?.amount}
                          IconSrc={`/currencies/${coinName}.png`}
                          ChartLineData={currencyHistoryData}
                          CurrencyName={coinName}
                          CurrencyTicker={currencyTicker}
                          onClick={() => {}}
                          onRecieve={() =>
                            handleDepoistAndCreateAddress(
                              depoistBlockchain,
                              asset?.standard
                            )
                          }
                          onSend={() =>
                            handleWithdrawAndSetBlockchain(currencyTicker)
                          }
                          onTransfer={() => {}}
                        />
                      );
                    })}
                  </LoadingApi>
                  <ErrorApiText error={isPorfolioError} />
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
                <Link className="text-caption" href={"/transactions"}>
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <LoadingApi loading={isLastTransactionsLoading}>
                  {lastTransactions?.map((transaction) => (
                    <TransactionCard
                      currencyName={transaction?.wallet?.blockchain}
                      date={transaction?.createdAt}
                      direction={
                        transaction?.withdrawal?.id ? "outgoing" : "incoming"
                      }
                      onClick={() => {}}
                      amount={transaction?.amount}
                    />
                  ))}
                </LoadingApi>
                <ErrorApiText error={isLastTransactionsError} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PermissionAccess(
  Home,
  ModulesEnum.wallet,
  AccessLevelEnum.read,
  { redirectOnNoAccess: true }
);
