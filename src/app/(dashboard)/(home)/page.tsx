"use client";
// Libs
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CountUp from "react-countup";
import { useSelector,useDispatch } from "react-redux";

//  Components
import { BorderedIconButton } from "@/components/common/IconButton";
import { ReciveIcon, SendIcon, TransferIcon } from "@/assets/Svgs";
import PortfolioCard from "@/components/common/PortfolioCard";
import TransactionCard from "@/components/common/TransactionCard";
import PortfolioChart from "@/components/PortfolioChart";
import ErrorApiText from "@/components/common/ErrorApiText";
import DepositModal from "@/components/Modals/DepoistModal";
import CustomTable from "@/components/common/CustomTable";
import CreateWithdrawalModal from "@/components/Modals/CreateWithdrawalModal";
import MerchantSummary from "@/components/common/MerchantSummary";
import LoadingApi from "@/components/common/LoadindApi";

// Hooks
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import useMountedQueue from "@/hooks/useMountedQueue";

// Services
import { getAllWalletAssetsByAdminApi } from "@/services/admin/wallet";
import { getRecentTransactionsApi } from "@/services/transaction";
import {
  getAllWalletBalancesApi,
  getTotalPortfolioValueApi,
} from "@/services/wallet";

// Utils
import PermissionAccess from "@/middleware/PermissionAccess";
import { callApiHook } from "@/utils/apifuncs";
import { getPermission } from "@/utils/cookies";

// Constants
import { Role } from "@/constants/roles";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { unitName } from "@/constants/blockchains";

// Store
import {
  setBalance,
  setPortfolioData,
  enqueueCall,
  setLastFetch,
  setMounted,
} from "@/store/slices/portfolio.slice";

// Styles
import "./dashboard.scss";


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

const merchantsColumns: TableColumns = [
  { field: "username", headerName: "Username" },
  { field: "first_name", headerName: "First Name" },
  { field: "last_name", headerName: "Last Name" },
  { field: "email", headerName: "Email" },
  { field: "user_type", headerName: "User Type" },
];
const merchantsRows = [
  {
    id: 1,
    username: "ahmed",
    first_name: "Muhammad",
    last_name: "Ahmed",
    email: "aw708596@gmail.com",
    user_type: "Individual",
  },
  {
    id: 2,
    username: "ahmed",
    first_name: "Muhammad",
    last_name: "Ahmed",
    email: "aw708596@gmail.com",
    user_type: "Individual",
  },
  {
    id: 3,
    username: "ahmed",
    first_name: "Muhammad",
    last_name: "Ahmed",
    email: "aw708596@gmail.com",
    user_type: "Individual",
  },
  {
    id: 4,
    username: "ahmed",
    first_name: "Muhammad",
    last_name: "Ahmed",
    email: "aw708596@gmail.com",
    user_type: "Individual",
  },
  {
    id: 5,
    username: "ahmed",
    first_name: "Muhammad",
    last_name: "Ahmed",
    email: "aw708596@gmail.com",
    user_type: "Individual",
  },
];

const Home = () => {
  const user = useLocalStorage("user");
  const dispatch = useDispatch();

  const { portfolioData, balance, queue } = useSelector(
    (state: any) => state?.portfolio
  );
  const isWalletHasFullAccess =
    getPermission(ModulesEnum.wallet)?.access_level == AccessLevelEnum.full;
  const isTransactionHasMinumumAccess =
    getPermission(ModulesEnum.transaction)?.access_level !=
    AccessLevelEnum.none;
  const [isPortfolioLoading, isPorfolioError, callPortfolioApi] = useApi({
    initailLoading: false,
  });
  
  const [
    isLastTransactionsLoading,
    isLastTransactionsError,
    callLastTransactionsApi,
  ] = useApi({
    initailLoading: user?.role == Role.ADMIN ? false : true,
  });
  const [
    isTotalPortfolioLoading,
    isTotalPortfolioError,
    callTotalPortfolioApi,
  ] = useApi({
    initailLoading: true,
  });

  const [hoveredButton, setHoveredButton] = useState("transfer"); // Default to "transfer"

  const handleMouseEnter = (buttonName) => {
    setHoveredButton(buttonName);
  };

  const handleMouseLeave = () => {
    setHoveredButton("transfer"); // Reset to "transfer" when not hovering
  };

  const [chartUnit, setCharUnit] = useState("ALL");
  const [interval, setInterval] = useState("monthly");

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

  const handleAssetSelection = (blockchainUnit) => {
    setCharUnit(blockchainUnit);
  };

  const getBalances = async () => {
    if (user.role == Role.USER) {
      _getUserBalance();
    } else if (user?.role == Role.ADMIN) {
      _getAdminBalance();
    }
  };

  const getTotalPortfolioValue = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callTotalPortfolioApi(getTotalPortfolioValueApi()),
        successCallBack: (response: any) => {
          dispatch(setBalance(response?.totalUSDT));
        },
      });
    }
  };

  const getLastTransactions = async () => {
    await callApiHook({
      apiCall: callLastTransactionsApi(getRecentTransactionsApi()),
      successCallBack: (response: any) => {
        setLastTransactions(response?.recentTransactions);
      },
    });
  };

  const _getUserBalance = async () => {
    await callApiHook({
      apiCall: callPortfolioApi(getAllWalletBalancesApi()),
      successCallBack: (response: any) => {
        dispatch(setPortfolioData(response));
      },
    });
  };

  const _getAdminBalance = async () => {
    await callApiHook({
      apiCall: callPortfolioApi(getAllWalletAssetsByAdminApi()),
      successCallBack: (response: any) => {
        dispatch(setPortfolioData(response));
      },
    });
  };

  const UserApiCalls = () => {
    // getPortfolioPLPercentage();
    if (isTransactionHasMinumumAccess) {
      getLastTransactions();
    }
  };

  const fetchPortfolio = useMountedQueue(
    [getBalances, getTotalPortfolioValue],
    queue,
    { enqueueCall, setLastFetch, setMounted }
  );

  useEffect(() => {
    user?.role == Role.USER && UserApiCalls();
    fetchPortfolio();
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
        <div className="flex flex-col gap-6">
          <LoadingApi loading={isPortfolioLoading}>
            <div className="flex gap-6">
              <div className="relative flex flex-col max-h-[400px] 2.5xl:max-h-[470px] height-box">
                {/* <header className="top-0 z-10 sticky"> */}
                <h3 className="mb-2 font-nunito text-p120 2xl:text-h4">
                  Crypto Wallets
                </h3>
                {/* </header> */}

                <div className="flex flex-col flex-1 gap-[14px] pr-4 overflow-y-auto portfolio-body">
                  {portfolioData?.length > 0 ? (
                    portfolioData?.map((asset) => {
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
                          isAdmin={user?.role == Role.ADMIN}
                          Balance={asset?.totalAmount}
                          IconSrc={`/currencies/${coinName?.toLowerCase()}.png`}
                          ChartLineData={currencyHistoryData}
                          CurrencyName={coinName}
                          isWalletHasFullAccess={isWalletHasFullAccess}
                          CurrencyTicker={currencyTicker}
                          onClick={() =>
                            handleAssetSelection(unit?.toUpperCase())
                          }
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
                    })
                  ) : !isPorfolioError ? (
                    "No Assets Found. Deposit Assets to see them here."
                  ) : (
                    <></>
                  )}
                  <ErrorApiText error={isPorfolioError} />
                </div>
              </div>

              <div className="hidden xs:block flex-1">
                <PortfolioChart
                  interval={interval}
                  setInterval={setInterval}
                  unit={chartUnit}
                />
              </div>
            </div>
          </LoadingApi>

          <div className="flex gap-6">
            <div className="w-[70%]">
              <CustomTable
                columns={merchantsColumns}
                rows={merchantsRows}
                ExpandComponent={({ row }) => <div>{row?.id}</div>}
                initialPageSize={10}
                rowClickHandler={(row: any) => {
                  console.log(row);
                }}
                actions={
                  <div className="flex justify-between items-end mb-6">
                    <h3 className="font-nunito text-p120 2xl:text-h4">
                      Merchants Wallet Summary
                    </h3>
                    <Link className="text-caption" href={"/merchants"}>
                      View All
                    </Link>
                  </div>
                }
                tableWrapperClassName="!min-h-[auto] border  bg-white shadow-md !px-5 py-[30px] !rounded-[28px]"
                pagination
                columnClassName="max-w-[250px]"
                // loading={isUsersListLoading}
              />
            </div>
            <div className="flex-1">
              <div className="xxs:px-5 xxs:py-[30px] xxs:border border-purple-10 rounded-[28px]">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="font-nunito text-p120 2xl:text-h4">
                    Last Transactions
                  </h3>
                  <Link className="text-caption" href={"/transactions"}>
                    View All
                  </Link>
                </div>
                <div className="flex flex-col gap-3 2xl:gap-4">
                  <LoadingApi loading={isLastTransactionsLoading}>
                    {lastTransactions?.length > 0 ? (
                      lastTransactions?.map((transaction) => (
                        <TransactionCard
                          currencyName={
                            unitName[transaction?.unit?.toLowerCase()]
                          }
                          date={transaction?.createdAt}
                          direction={
                            transaction?.withdrawal?.id
                              ? "outgoing"
                              : "incoming"
                          }
                          onClick={() => {}}
                          amount={transaction?.amount}
                        />
                      ))
                    ) : !isLastTransactionsError ? (
                      "No Transactions Found"
                    ) : (
                      <></>
                    )}
                  </LoadingApi>
                  <ErrorApiText error={isLastTransactionsError} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-[70%]">
              <MerchantSummary />
            </div>
          </div>
        </div>
      )}
      {user?.role == Role.USER && (
        <>
          <div
            className={
              isTransactionHasMinumumAccess
                ? "dashboard-layout"
                : "dashboard-layout-without-transactions"
            }
          >
            <div
              className="px-4 py-[35px] 2.5xl:py-[60px] min-h-[310px] 2.5xl:min-h-[470px] wallets 2.5xlpx-8"
              onClick={(e) => {
                handleAssetSelection("ALL");
              }}
            >
              <div className="flex flex-col justify-between gap-8 h-full">
                <div>
                  <h4 className="font-nunito font-bold text-h4 text-white text-center">
                    Crypto Wallets
                  </h4>
                  <h3 className="overflow-hidden font-nunito font-semibold text-[60px] text-white 2.5xl:text-[92px] text-center text-ellipsis leading-[110px]">
                    $
                    <CountUp
                      end={balance}
                      separator=","
                      decimal="."
                      decimals={2}
                    />
                  </h3>
                  <ErrorApiText error={isTotalPortfolioError} />
                  {/* <h6 className="overflow-hidden font-nunito font-semibold text-button text-purple-light-purple xs:text-p122 md:text-h4 text-center text-ellipsis">
                  {portfolioPercentage}% Last Week
                  </h6> */}
                </div>
                <div
                  className="flex justify-center 2.5xl:justify-between gap-4 2.5xl:gap-0 xl:px-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BorderedIconButton
                    className={`transition-[width] overflow-hidden h-[57px] 2.5xl:h-[85px] bg-white !border-0 ${
                      hoveredButton !== "receive"
                        ? "w-[57px] 2.5xl:w-[85px]"
                        : "!w-[50%] px-4 gap-4"
                    }`}
                    onMouseEnter={() => handleMouseEnter("receive")}
                    tooltip={
                      !isWalletHasFullAccess &&
                      "You don't have sufficient permissions to initate a Deposit."
                    }
                    tooltipId="r-b"
                    onClick={isWalletHasFullAccess && handleDepoist}
                    disabled={!isWalletHasFullAccess}
                  >
                    <ReciveIcon className="w-4 2.5xl:w-[23px]" />
                    {hoveredButton === "receive" && (
                      <span className="hidden sm:flex font-nunito text-button 2.5xl:text-h3.5">
                        Receive
                      </span>
                    )}
                  </BorderedIconButton>
                  <BorderedIconButton
                    tooltipId="s-b"
                    className={`transition-[width] overflow-hidden h-[57px] 2.5xl:h-[85px] bg-white !border-0 ${
                      hoveredButton !== "send"
                        ? "w-[57px] 2.5xl:w-[85px]"
                        : "!w-[50%] px-4 gap-4"
                    }`}
                    disabled={!isWalletHasFullAccess}
                    onMouseEnter={() => handleMouseEnter("send")}
                    tooltip={
                      !isWalletHasFullAccess &&
                      "You don't have sufficient permissions to initate a Withdrawal."
                    }
                    onClick={isWalletHasFullAccess && handleWithdrawalToggler}
                  >
                    <SendIcon className="w-4 2.5xl:w-[23px]" />
                    {hoveredButton === "send" && (
                      <span className="hidden sm:flex font-nunito text-button 2.5xl:text-h3.5">
                        Send
                      </span>
                    )}
                  </BorderedIconButton>
                  <BorderedIconButton
                    tooltipId="t-b"
                    className={`transition-[width] overflow-hidden h-[57px] 2.5xl:h-[85px] bg-white !border-0 ${
                      hoveredButton !== "transfer"
                        ? "w-[57px] 2.5xl:w-[85px]"
                        : "!w-[50%] px-4 gap-4"
                    }`}
                    onMouseEnter={() => handleMouseEnter("transfer")}
                    disabled={!isWalletHasFullAccess}
                    tooltip={
                      !isWalletHasFullAccess &&
                      "You don't have sufficient permissions to initate a Transfer."
                    }
                  >
                    <TransferIcon className="w-4 2.5xl:w-[23px]" />
                    {hoveredButton === "transfer" && (
                      <span className="hidden sm:inline font-nunito text-button 2.5xl:text-h3.5">
                        Transfer
                      </span>
                    )}
                  </BorderedIconButton>
                </div>
              </div>
            </div>
            <div className="portfolio">
              <div className="flex flex-col flex-auto">
                <div className="relative flex flex-col max-h-[400px] 2.5xl:max-h-[470px] height-box">
                  {/* <header className="top-0 z-10 sticky"> */}
                  <h3 className="mb-2 font-nunito text-p120 2xl:text-h4">
                    My Portfolio
                  </h3>
                  {/* </header> */}

                  <div className="flex flex-col flex-1 gap-[14px] pr-4 overflow-y-auto portfolio-body">
                    <LoadingApi loading={isPortfolioLoading}>
                      {portfolioData?.length > 0 ? (
                        portfolioData?.map((asset) => {
                          let unit = asset?.unit;
                          let tokenName = `${unit} (${asset?.standard})`;
                          let coinName =
                            unitName[unit?.toLowerCase()] || "Unknown";
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
                              Balance={asset?.totalAmount}
                              IconSrc={`/currencies/${coinName?.toLowerCase()}.png`}
                              ChartLineData={currencyHistoryData}
                              CurrencyName={coinName}
                              isWalletHasFullAccess={isWalletHasFullAccess}
                              CurrencyTicker={currencyTicker}
                              onClick={() =>
                                handleAssetSelection(unit?.toUpperCase())
                              }
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
                        })
                      ) : !isPorfolioError ? (
                        "No Assets Found. Deposit Assets to see them here."
                      ) : (
                        <></>
                      )}
                    </LoadingApi>
                    <ErrorApiText error={isPorfolioError} />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden xs:block history">
              <PortfolioChart
                interval={interval}
                setInterval={setInterval}
                unit={chartUnit}
              />
            </div>
            {isTransactionHasMinumumAccess && (
              <div className="transactions">
                <div className="xxs:px-5 xxs:py-[30px] xxs:border border-purple-10 rounded-[28px]">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="font-nunito text-p120 2xl:text-h4">
                      Last Transactions
                    </h3>
                    <Link className="text-caption" href={"/transactions"}>
                      View All
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3 2xl:gap-4">
                    <LoadingApi loading={isLastTransactionsLoading}>
                      {lastTransactions?.length > 0 ? (
                        lastTransactions?.map((transaction) => (
                          <TransactionCard
                            currencyName={
                              unitName[transaction?.unit?.toLowerCase()]
                            }
                            date={transaction?.createdAt}
                            direction={
                              transaction?.withdrawal?.id
                                ? "outgoing"
                                : "incoming"
                            }
                            onClick={() => {}}
                            amount={transaction?.amount}
                          />
                        ))
                      ) : !isLastTransactionsError ? (
                        "No Transactions Found"
                      ) : (
                        <></>
                      )}
                    </LoadingApi>
                    <ErrorApiText error={isLastTransactionsError} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
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
