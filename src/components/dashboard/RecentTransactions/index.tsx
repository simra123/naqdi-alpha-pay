"use client";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import TransactionCard from "@/components/common/TransactionCard";
import { unitName } from "@/constants/blockchains";
import { Role } from "@/constants/roles";
import { transactionTypes } from "@/constants/types";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getLatestTransactionsByAdminApi } from "@/services/admin/transaction";
import { getRecentTransactionsApi } from "@/services/transaction";
import { callApiHook } from "@/utils/apifuncs";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const RecentTransactions = () => {
  const user = useLocalStorage("user");
  const [recentTransactions, setRecentTransactions] = useState<[]>([]);
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
            ? response
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
            recentTransactions?.map((transaction: any) => (
              <TransactionCard
                currencyName={
                  user?.role == Role.ADMIN ? (
                    <div className="2xl:max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap max-w=[180px] [direction:rtl] [text-align:left]">
                      <span className="text-button 2xl:text-p120">
                        {transaction?.client?.first_name ||
                          transaction?.user?.first_name}{" "}
                        {transaction?.client?.last_name ||
                          transaction?.user?.last_name}
                      </span>{" "}
                      <span className="font-medium text-caption text-custom-title-gray">
                        ({unitName[transaction?.transaction_request?.unit?.toLowerCase()]})
                      </span>
                    </div>
                  ) : (
                    unitName[transaction?.transaction_request?.unit?.toLowerCase()]
                  )
                }
                date={transaction?.created_at}
                direction={transaction?.transaction_request?.type == transactionTypes.Deposit ? "incoming" : "outgoing"}
                onClick={() => { }}
                amount={parseFloat(user?.role == Role.ADMIN ? transaction?.paid_amount : transaction?.net_amount).toFixed(3)?.toString()}
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
