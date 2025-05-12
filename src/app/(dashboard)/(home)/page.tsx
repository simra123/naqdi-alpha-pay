"use client";
// Libs
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

//  Components
import { BorderedIconButton } from "@/components/common/IconButton";
import { ReciveIcon, SendIcon, TransferIcon } from "@/assets/Svgs";

import PortfolioChart, { makeChartData } from "@/components/PortfolioChart";

import ErrorApiText from "@/components/common/ErrorApiText";
import CustomTable from "@/components/common/CustomTable";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import MerchantSummary from "@/components/common/MerchantSummary";

import DepositModal from "@/components/Modals/DepoistModal";
import CreateWithdrawalModal from "@/components/Modals/CreateWithdrawalModal";

import Wallets from "@/components/dashboard/Wallets";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

// Hooks
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";

// Services
import {
  getAllWalletBalancesApi,
  getPortfolioActivityChartApi,
  getTotalPortfolioValueApi,
} from "@/services/wallet";
import {
  getDashboardBalancesAdminApi,
  getDashboardMerchantsAdminApi,
} from "@/services/admin/dashboard";

// Utils
import PermissionAccess from "@/middleware/PermissionAccess";
import { callApiHook } from "@/utils/apifuncs";
import { hasMinAccess } from "@/utils/cookies";

// Constants
import { Role } from "@/constants/roles";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";

// Styles
import "./dashboard.scss";
import FeeSummaryGraph from "@/components/dashboard/FeeSummaryGraph";

const merchantsColumns: TableColumns = [
  { field: "username", headerName: "Username" },
  { field: "first_name", headerName: "First Name" },
  { field: "last_name", headerName: "Last Name" },
  { field: "email", headerName: "Email" },
  { field: "user_type", headerName: "User Type" },
];

interface DepositState {
  blockchain?: null | string;
  standard?: null | string;
}

interface WithdrawState {
  blockchain?: null | string;
}

enum ButtonNames {
  transfer,
  send,
  receive,
}

type HoverButtonType = ButtonNames;

const Home = () => {
  const user = useLocalStorage("user");
  const dispatch = useDispatch();
  const router = useRouter();

  const isWalletHasFullAccess = hasMinAccess(
    ModulesEnum.wallet,
    AccessLevelEnum.full
  );
  const isWalletHasMinimumAccess = hasMinAccess(
    ModulesEnum.wallet,
    AccessLevelEnum.read
  );
  const isTransactionHasMinumumAccess = hasMinAccess(
    ModulesEnum.transaction,
    AccessLevelEnum.read
  );
  const isMerchantHasMinimumAccess = hasMinAccess(
    ModulesEnum.merchant,
    AccessLevelEnum.read
  );

  const [adminBalances, setAdminBalances] = useState<any>({});
  const [adminMerchants, setAdminMerchants] = useState([]);
  const [balance, setBalance] = useState(0);
  const [portfolioData, setPortfolioData] = useState([]);

  const [chartUnit, setCharUnit] = useState("ALL");
  const [interval, setInterval] = useState("monthly");
  const [merchant, setMerchant] = useState("ALL");
  const [userChartData, setUserChartData] = useState({});

  const [depoistData, setDepositData] = useState<DepositState>({
    blockchain: null,
    standard: null,
  });

  const [withdrawData, setWithdrawData] = useState<WithdrawState>({
    blockchain: null,
  });

  const [hoveredButton, setHoveredButton] = useState<HoverButtonType>(
    ButtonNames.transfer
  ); // Default to "transfer"
  const [openDeposit, setOpenDeposit] = useState(null);
  const [openWithdraw, setOpenWithdrawal] = useState(null);

  const [isPortfolioLoading, isPorfolioError, callPortfolioApi] = useApi({
    initailLoading: false,
  });

  const [isAdminBalancesLoading, isAdminBalancesError, callAdminBalancesApi] =
    useApi({
      initailLoading: false,
    });

  const [_, isTotalPortfolioError, callTotalPortfolioApi] = useApi({
    initailLoading: true,
  });

  const [
    isUserPortfolioActivityLoading,
    isUserPortfolioActivityError,
    callUserPortfolioActivityApi,
  ] = useApi({
    initailLoading: true,
  });

  const [
    isAdminMerchantsLoading,
    isAdminMerchantsError,
    callAdminMerchantsApi,
  ] = useApi({
    initailLoading: true,
  });

  const handleMouseEnter = (buttonName: HoverButtonType) => {
    setHoveredButton(buttonName);
  };

  // Deposti Modal Handlers
  const openDepoistModal = () => {
    setOpenDeposit(true);
  };

  const closeDepoistModal = () => {
    setOpenDeposit(false);
    setDepositData({
      blockchain: null,
      standard: null,
    });
  };

  const openDepoistModalAndCreateAddress = (
    blockchain: string,
    standard: string
  ) => {
    setOpenDeposit(true);
    setDepositData({
      blockchain,
      standard,
    });
  };

  // Withdrawal Modal Handlers
  const toggleWithdrawalModal = () => {
    setOpenWithdrawal(!openWithdraw);
    setWithdrawData({ blockchain: null });
  };

  const openWithdrawalModalAndSetBlockchain = (blockchain: string) => {
    setOpenWithdrawal(true);
    setWithdrawData({
      blockchain,
    });
  };

  const handleAssetSelection = (blockchainUnit) => {
    setCharUnit(blockchainUnit);
  };

  const getTotalPortfolioValue = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callTotalPortfolioApi(getTotalPortfolioValueApi(), {
          enableCache: true,
          cacheKey: "user-total-balance",
        }),
        successCallBack: (response: any) => {
          setBalance(response?.totalUSDT);
        },
      });
    }
  };

  const getAdminMerchants = async () => {
    await callApiHook({
      apiCall: callAdminMerchantsApi(getDashboardMerchantsAdminApi()),
      successCallBack: (response: any) => {
        setAdminMerchants(response?.data);
      },
    });
  };

  const getUserWallets = async () => {
    if (user.role == Role.USER) {
      await callApiHook({
        apiCall: callPortfolioApi(getAllWalletBalancesApi(), {
          enableCache: true,
          cacheKey: "user-wallets",
        }),
        successCallBack: (response: any) => {
          setPortfolioData(response);
        },
      });
    }
  };

  const getUserChartData = useCallback(async () => {
    await callApiHook({
      apiCall: callUserPortfolioActivityApi(
        getPortfolioActivityChartApi({ duration: interval, unit: chartUnit })
      ),
      successCallBack: (response: any) => {
        setUserChartData(makeChartData(response));
      },
    });
  }, [chartUnit, interval, merchant]);

  const getAdminChartData = useCallback(async () => {
    await callApiHook({
      apiCall: callAdminBalancesApi(
        getDashboardBalancesAdminApi({
          duration: interval,
          unit: chartUnit,
          all: merchant == "ALL",
          userId: merchant != "ALL" ? merchant : undefined,
        })
      ),
      successCallBack: (response: any) => {
        setAdminBalances({
          ...response?.data,
          portfolio: makeChartData(response?.data?.portfolio),
        });
      },
    });
  }, [chartUnit, interval, merchant]);

  const AdminApiCalls = () => {
    if (hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read)) {
      getAdminMerchants();
    }
  };

  useEffect(() => {
    if (user?.role == Role.ADMIN) {
      AdminApiCalls();
    }
    getUserWallets();
    getTotalPortfolioValue();
  }, []);

  // Button configurations
  const actionButtons = [
    {
      name: ButtonNames.receive,
      icon: <ReciveIcon className="w-4 2.5xl:w-[23px]" />,
      label: "Receive",
      action: isWalletHasFullAccess ? openDepoistModal : undefined,
      disabled: !hasMinAccess(ModulesEnum.payment, AccessLevelEnum.full),
      tooltip: "You don't have sufficient permissions to initiate a Deposit.",
    },
    {
      name: ButtonNames.send,
      icon: <SendIcon className="w-4 2.5xl:w-[23px]" />,
      label: "Send",
      action: isWalletHasFullAccess ? toggleWithdrawalModal : undefined,
      disabled: !hasMinAccess(ModulesEnum.withdrawal, AccessLevelEnum.full),
      tooltip:
        "You don't have sufficient permissions to initiate a Withdrawal.",
    },
    {
      name: ButtonNames.transfer,
      icon: <TransferIcon className="w-4 2.5xl:w-[23px]" />,
      label: "Transfer",
      disabled: !isWalletHasFullAccess,
      tooltip: "You don't have sufficient permissions to initiate a Transfer.",
    },
  ];

  return (
    <>
      <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
        <DepositModal
          isOpen={openDeposit}
          setIsOpen={closeDepoistModal}
          blockchain={depoistData?.blockchain}
          standard={depoistData?.standard}
        />
        <CreateWithdrawalModal
          isOpen={openWithdraw}
          refreshHandler={() => {}}
          blockchain={withdrawData?.blockchain}
          toggleHandler={toggleWithdrawalModal}
        />
      </RenderRoleBased>

      <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
        <div className="admin-dashboard-layout">
          {isWalletHasMinimumAccess && (
            <>
              <div className="wallets">
                <div className="relative flex flex-col max-h-[400px] md:max-h-[100%] 2.5xl:max-h-[470px]">
                  <Wallets
                    walletsArray={adminBalances?.userBalances}
                    error={isAdminBalancesError}
                    heading="Crypto Wallets"
                    loading={isAdminBalancesLoading}
                    onHeadingClick={() => setCharUnit("ALL")}
                    onWalletClick={handleAssetSelection}
                  />
                </div>
              </div>
              <div className="history">
                <div className="hidden xs:block">
                  <PortfolioChart
                    isAdmin={user?.role == Role.ADMIN}
                    interval={interval}
                    setInterval={setInterval}
                    chartData={adminBalances?.portfolio}
                    unit={chartUnit}
                    loading={isAdminBalancesLoading}
                    error={isAdminBalancesError}
                    merchantsList={adminMerchants}
                    merchant={merchant}
                    setMerchant={setMerchant}
                    getChartData={getAdminChartData}
                  />
                </div>
              </div>
            </>
          )}

          {isMerchantHasMinimumAccess && (
            <div className="merchants">
              <CustomTable
                columns={merchantsColumns}
                rows={adminMerchants}
                expandRowIDKey="userId"
                ExpandComponent={({ row }) => (
                  <div className="justify-between items-center gap-6 grid grid-cols-5">
                    {row?.balances && row?.balances?.length > 0 ? (
                      row.balances.map((item) => (
                        <div className="flex flex-col gap-2">
                          <h3 className="font-semibold text-purple-500 text-base">
                            {item?.unit}{" "}
                            {item?.standard ? ` - ${item?.standard}` : ""}
                          </h3>
                          <span className="font-semibold text-base">
                            {item?.amount}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p>No Wallets Found.</p>
                    )}
                  </div>
                )}
                initialPageSize={5}
                rowClickHandler={(row: any) => {
                  router.push(`/merchants/details/${row?.userId}`);
                }}
                actions={
                  <div className="flex justify-between items-end mb-6">
                    <h3 className="font-nunito text-p120 2xl:text-h4">
                      Merchants Wallet Summary
                    </h3>
                    <Link
                      className="font-semibold text-caption text-purple-500 underline"
                      href={"/merchants"}
                    >
                      View All
                    </Link>
                  </div>
                }
                tableWrapperClassName="!min-h-[auto] border  bg-white shadow-md !px-5 py-[30px] !rounded-[28px]"
                pagination
                columnClassName="max-w-[250px] !py-[19.5px]"
                loading={isAdminMerchantsLoading}
              />
              <ErrorApiText error={isAdminMerchantsError} />
            </div>
          )}

          {isTransactionHasMinumumAccess && (
            <div className="transactions">
              <RecentTransactions />
            </div>
          )}

          {/* Graphs Row */}

          {isMerchantHasMinimumAccess && (
            <div className="financialSummary">
              <MerchantSummary merchantsList={adminMerchants} />
            </div>
          )}

          {/* <div className="feeSummary">
              <FeeSummaryGraph />
            </div> */}
        </div>
      </RenderRoleBased>

      <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
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
              </div>
              <div
                className="flex justify-center 2.5xl:justify-between gap-4 2.5xl:gap-0 xl:px-8"
                onClick={(e) => e.stopPropagation()}
              >
                {actionButtons.map((button) => (
                  <BorderedIconButton
                    key={button.name}
                    className={`transition-[width] overflow-hidden h-[57px] 2.5xl:h-[85px] bg-white !border-0 ${
                      hoveredButton !== button.name
                        ? "w-[57px] 2.5xl:w-[85px]"
                        : "!w-[50%] px-4 gap-4"
                    }`}
                    onMouseEnter={() => handleMouseEnter(button.name)}
                    tooltip={button.tooltip}
                    tooltipId={button.label}
                    onClick={button.action}
                    disabled={button.disabled}
                  >
                    {button.icon}
                    {hoveredButton === button.name && (
                      <span className="hidden sm:flex font-nunito text-button 2.5xl:text-h3.5">
                        {button.label}
                      </span>
                    )}
                  </BorderedIconButton>
                ))}
              </div>
            </div>
          </div>
          <div className="portfolio">
            <div className="relative flex flex-col max-h-[400px] 2.5xl:max-h-[470px] height-box">
              <Wallets
                walletsArray={portfolioData}
                error={isPorfolioError}
                heading="My Portfolio"
                loading={isPortfolioLoading}
                onReceive={openDepoistModalAndCreateAddress}
                onWalletClick={handleAssetSelection}
                onWithdraw={openWithdrawalModalAndSetBlockchain}
              />
            </div>
          </div>

          <div className="hidden xs:block history">
            <PortfolioChart
              interval={interval}
              chartData={userChartData}
              error={isUserPortfolioActivityError}
              loading={isUserPortfolioActivityLoading}
              getChartData={getUserChartData}
              setInterval={setInterval}
              unit={chartUnit}
            />
          </div>
          {isTransactionHasMinumumAccess && (
            <div className="transactions">
              <RecentTransactions />
            </div>
          )}
          <div className="financialSummary">
            <MerchantSummary />
          </div>
        </div>
      </RenderRoleBased>
    </>
  );
};

export default PermissionAccess(
  Home,
  ModulesEnum.wallet,
  AccessLevelEnum.read,
  { redirectOnNoAccess: true }
);
