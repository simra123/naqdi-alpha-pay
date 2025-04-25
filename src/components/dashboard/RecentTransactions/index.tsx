"use client";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import TransactionCard from "@/components/common/TransactionCard";
import { unitName } from "@/constants/blockchains";
import { Role } from "@/constants/roles";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
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
    initailLoading: user?.role == Role.ADMIN ? false : true,
  });

  const getRecentTransactions = async () => {
    await callApiHook({
      apiCall: callRecentTransactionsApi(getRecentTransactionsApi()),
      successCallBack: (response: any) => {
        setRecentTransactions(response?.recentTransactions);
      },
    });
  };

  useEffect(() => {
    user?.role == Role.USER && getRecentTransactions();
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
                currencyName={unitName[transaction?.unit?.toLowerCase()]}
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
