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
import { getLocalStorageValue } from "@/utils/cookies";

// Services
import {
  getAllWalletBalancesApi,
  getPortfolioActivityChartApi,
  getTotalPortfolioValueApi,
} from "@/services/wallet";
import {
  getDashboardBalancesAdminApi,
  getDashboardFeeSummaryAdminApi,
  getDashboardMerchantsWalletSummaryAdminApi,
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
import { getAllUsersByAdminApi } from "@/services/admin/users";
import CustomTableV2 from "@/components/common/CustomTableV2";
import AmountFormat from "@/components/common/AmountFormat";
import Balances from "@/components/common/Balance";
import AdminWallet from "@/components/dashboard/AdminWallet";
import MerchantWallet from "@/components/dashboard/MerchantWallet";

const merchantsColumns: TableColumns = [
  { field: "wallet.company.owner.first_name", headerName: "First Name" },
  { field: "wallet.company.owner.last_name", headerName: "Last Name" },
  { field: "wallet.company.owner.user_type", headerName: "User Type" },
  {
    field: "total_amount",
    headerName: "Current Balance",
    dataValidator(value, row) {
      return <AmountFormat amount={value} type="fiat" />;
    },
  },
  {
    field: "total_deposit",
    headerName: "Deposit",
    dataValidator(value, row) {
      return <AmountFormat amount={value} type="fiat" />;
    },
  },
  {
    field: "total_withdraw",
    headerName: "Withdrawal",
    dataValidator(value, row) {
      return <AmountFormat amount={value} type="fiat" />;
    },
  },
];

interface DepositState {
  blockchain?: null | string;
  standard?: null | string;
}

interface WithdrawState {
  blockchain?: null | string;
  standard?: null | string;
}

enum ButtonNames {
  transfer,
  send,
  receive,
}

type HoverButtonType = ButtonNames;

const Home = () => {
  const user = getLocalStorageValue("user");
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
  const [adminMerchantsWalletSummary, setAdminMerchantsWalletSummary] =
    useState({ result: [], total: 0 });
  const [balance, setBalance] = useState<{
    totalUSD: number;
    totalWithdrawal: number;
    totalDeposit: number;
  }>({ totalDeposit: 0, totalUSD: 0, totalWithdrawal: 0 });
  const [portfolioData, setPortfolioData] = useState([]);

  const [interval, setInterval] = useState("monthly");
  const [merchantsList, setMerchantList] = useState<[]>([]);
  const [merchant, setMerchant] = useState("ALL");
  const [userChartData, setUserChartData] = useState({});

  const [merchantPage, setMerchantPage] = useState(1);
  const [merchantPageSize, setMerchantPageSize] = useState(5);

  const [depoistData, setDepositData] = useState<DepositState>({
    blockchain: null,
    standard: null,
  });

  const [withdrawData, setWithdrawData] = useState<WithdrawState>({
    blockchain: null,
  });

  const [hoveredButton, setHoveredButton] = useState<HoverButtonType>(
    ButtonNames.send
  ); // Default to "transfer"
  const [openDeposit, setOpenDeposit] = useState(null);
  const [openWithdraw, setOpenWithdrawal] = useState(null);

  const [isPortfolioLoading, isPorfolioError, callPortfolioApi] = useApi({
    initailLoading: false,
  });

  const [isMerchantsListLoading, isMerchantsListError, callMerchantsListApi] =
    useApi({
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
    isAdminMerchantsWalletSummaryLoading,
    isAdminMerchantsWalletSummaryError,
    callAdminMerchantsWalletSummaryApi,
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

  const openWithdrawalModalAndSetBlockchain = (
    blockchain: string,
    standard?: string
  ) => {
    setOpenWithdrawal(true);
    setWithdrawData({
      blockchain,
      standard,
    });
  };

  const getTotalPortfolioValue = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callTotalPortfolioApi(getTotalPortfolioValueApi(), {
          enableCache: true,
          cacheKey: "user-total-balance",
        }),
        successCallBack: (response: any) => {
          setBalance(response);
        },
      });
    }
  };

  const getAdminMerchantsWalletSummry = async (limit: number, page: number) => {
    setAdminMerchantsWalletSummary((pre) => ({ ...pre, result: [] }));
    await callApiHook({
      apiCall: callAdminMerchantsWalletSummaryApi(
        getDashboardMerchantsWalletSummaryAdminApi({
          limit,
          page,
        })
      ),
      successCallBack: (response: any) => {
        setAdminMerchantsWalletSummary(response?.data);
      },
    });
  };

  const getAllMerchants = async () => {
    await callApiHook({
      apiCall: callMerchantsListApi(getAllUsersByAdminApi()),
      successCallBack: (response) => {
        setMerchantList(
          response?.map((item) => ({ label: item?.username, value: item?.id }))
        );
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
        getPortfolioActivityChartApi({ duration: interval })
      ),
      successCallBack: (response: any) => {
        setUserChartData(makeChartData(response) || []);
      },
    });
  }, [interval, merchant]);

  const getAdminChartData = useCallback(async () => {
    await callApiHook({
      apiCall: callAdminBalancesApi(
        getDashboardBalancesAdminApi({
          duration: interval,
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
  }, [interval, merchant]);

  const AdminApiCalls = () => {
    if (hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read)) {
      getAdminMerchantsWalletSummry(merchantPageSize, merchantPage);
      getAllMerchants();
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
    // {
    //   name: ButtonNames.transfer,
    //   icon: <TransferIcon className="w-4 2.5xl:w-[23px]" />,
    //   label: "Transfer",
    //   disabled: !isWalletHasFullAccess,
    //   tooltip: "You don't have sufficient permissions to initiate a Transfer.",
    // },
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
          standard={withdrawData?.standard}
          toggleHandler={toggleWithdrawalModal}
        />
      </RenderRoleBased>

      <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
        <div className="flex flex-col gap-6 admin-dashboard-layout">
          {isWalletHasMinimumAccess && (
            <div className="hidden 2.5xl:flex gap-6">
              <div className="w-[504px] wallets">
                <div className="relative flex flex-col max-h-[400px] md:max-h-[100%] 2.5xl:max-h-[470px]">
                  <AdminWallet
                    adminBalances={adminBalances}
                    error={isAdminBalancesError}
                  />

                  {/* <Wallets
                    walletsArray={adminBalances?.userBalances}
                    error={isAdminBalancesError}
                    heading="Crypto Wallets"
                    loading={isAdminBalancesLoading}
                  /> */}
                  <Balances
                    balances={adminBalances?.userBalances}
                    error={isAdminBalancesError}
                    loading={isAdminBalancesLoading}
                  />
                </div>
              </div>
              <div className="flex-1 history">
                <div className="hidden xs:block">
                  <PortfolioChart
                    isAdmin={user?.role == Role.ADMIN}
                    interval={interval}
                    setInterval={setInterval}
                    chartData={adminBalances?.portfolio}
                    loading={isAdminBalancesLoading}
                    error={isAdminBalancesError}
                    merchantsList={merchantsList}
                    merchant={merchant}
                    setMerchant={setMerchant}
                    getChartData={getAdminChartData}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="2.5xl:hidden flex flex-wrap gap-6">
            <div className="flex-1 wallets">
              <div className="relative flex flex-col max-h-[400px] md:max-h-[100%] 2.5xl:max-h-[470px]">
                <AdminWallet
                  adminBalances={adminBalances}
                  error={isAdminBalancesError}
                />

                <Wallets
                  walletsArray={adminBalances?.userBalances}
                  error={isAdminBalancesError}
                  heading="Crypto Wallets"
                  loading={isAdminBalancesLoading}
                />
              </div>
            </div>
            <div className="2.5xl:hidden flex-1 transactions">
              <RecentTransactions />
            </div>
          </div>
          <div className="2.5xl:hidden">
            <PortfolioChart
              isAdmin={user?.role == Role.ADMIN}
              interval={interval}
              setInterval={setInterval}
              chartData={adminBalances?.portfolio}
              loading={isAdminBalancesLoading}
              error={isAdminBalancesError}
              merchantsList={merchantsList}
              merchant={merchant}
              setMerchant={setMerchant}
              getChartData={getAdminChartData}
            />
          </div>

          {/* Graphs Row */}

          <div className="flex xl:flex-row flex-col gap-6">
            {isMerchantHasMinimumAccess && (
              <div className="xl:w-1/2 financialSummary">
                <MerchantSummary merchantsList={merchantsList} />
              </div>
            )}

            <div className="xl:w-1/2 feeSummary">
              <FeeSummaryGraph />
            </div>
          </div>

          <div className="2.5xl:flex items-stretch gap-6">
            {isMerchantHasMinimumAccess && (
              <div className="2.5xl:w-[68%] merchants">
                <CustomTableV2
                  columns={merchantsColumns}
                  rows={adminMerchantsWalletSummary?.result}
                  rowClickHandler={(row: any) => {
                    router.push(
                      `/merchants/details/${row?.wallet?.company?.owner?.id}`
                    );
                  }}
                  actions={
                    <div className="flex justify-between items-end mb-12">
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
                  tableWrapperClassName="!min-h-[auto] border h-full  !px-5 py-[30px] !rounded-[28px]"
                  pagination
                  initialPageSize={merchantPageSize}
                  serverSidePagination
                  totalItems={adminMerchantsWalletSummary?.total}
                  onPageChange={(page) => {
                    setMerchantPage(page);
                    getAdminMerchantsWalletSummry(merchantPageSize, page);
                  }}
                  onPageSizeChange={(pageSize) => {
                    setMerchantPageSize(pageSize);
                    getAdminMerchantsWalletSummry(pageSize, merchantPage);
                  }}
                  columnClassName="max-w-[250px] !py-[19.5px]"
                  loading={isAdminMerchantsWalletSummaryLoading}
                />
                <ErrorApiText error={isAdminMerchantsWalletSummaryError} />
              </div>
            )}

            {isTransactionHasMinumumAccess && (
              <div className="hidden 2.5xl:block w-[30%] transactions">
                <RecentTransactions />
              </div>
            )}
          </div>
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
          <div className="px-4 2.5xl:px-8 py-[35px] 2.5xl:py-[40px] min-h-[310px] 2.5xl:min-h-[470px] wallets">
            <div className="flex flex-col justify-between gap-8 h-full">
              <MerchantWallet balance={balance} error={isTotalPortfolioError} />

              <div
                className="flex justify-center gap-4 xl:px-8"
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
