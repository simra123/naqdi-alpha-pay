"use client";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import TransactionCard from "@/components/common/TransactionCard";
import { unitName } from "@/constants/blockchains";
import { Role } from "@/constants/roles";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getLatestTransactionsByAdminApi } from "@/services/admin/transaction";
import { getRecentTransactionsApi } from "@/services/transaction";
import { callApiHook } from "@/utils/apifuncs";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const RecentTransactions = () => {
  const user = useLocalStorage("user");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [
    isRecentTransactionsLoading,
    isRecentTransactionsError,
    callRecentTransactionsApi,
  ] = useApi({
    initailLoading: true,
  });

  const getRecentTransactions = async () => {
    await callApiHook({
      apiCall: callRecentTransactionsApi(
        user?.role == Role.USER
          ? getRecentTransactionsApi()
          : getLatestTransactionsByAdminApi({ page: 1, limit: 5 })
      ),
      successCallBack: (response: any) => {
        setRecentTransactions(
          user?.role == Role.USER
            ? response?.recentTransactions
            : response?.data?.recentTransactions
        );
      },
    });
  };

  useEffect(() => {
    getRecentTransactions();
  }, []);

  return (
    <div className="xxs:px-5 xxs:py-[30px] xxs:border border-purple-10 rounded-[28px]">
      <div className="flex justify-between items-end mb-2">
        <h3 className="font-nunito text-p120 2xl:text-h4">Last Transactions</h3>
        <Link
          className="font-semibold text-caption text-purple-500 underline"
          href={"/transactions"}
        >
          View All
        </Link>
      </div>
      <div className="flex flex-col gap-3 2xl:gap-4">
        <LoadingApi loading={isRecentTransactionsLoading}>
          {recentTransactions?.length > 0 ? (
            recentTransactions?.map((transaction) => (
              <TransactionCard
                currencyName={
                  user?.role == Role.ADMIN ? (
                    <div className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap [direction:rtl] [text-align:left]">
                      <span className="text-p120">
                        {transaction?.client?.first_name}{" "}
                        {transaction?.client?.last_name}
                      </span>
                      {" "}
                      <span className="font-medium text-caption text-custom-title-gray">
                        ({unitName[transaction?.unit?.toLowerCase()]})
                      </span>
                    </div>
                  ) : (
                    unitName[transaction?.unit?.toLowerCase()]
                  )
                }
                date={transaction?.createdAt}
                direction={
                  transaction?.withdrawal?.id ? "outgoing" : "incoming"
                }
                onClick={() => {}}
                amount={transaction?.amount}
              />
            ))
          ) : !isRecentTransactionsError ? (
            "No Transactions Found"
          ) : (
            <></>
          )}
        </LoadingApi>
        <ErrorApiText error={isRecentTransactionsError} />
      </div>
    </div>
  );
};

export default RecentTransactions;
