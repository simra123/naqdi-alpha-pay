"use client";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import TransactionCard from "@/components/common/TransactionCard";
import { unitName } from "@/constants/blockchains";
import { Role } from "@/constants/roles";
import { transactionTypes } from "@/constants/types";
import { useApi } from "@/hooks/useApi";
import { getLocalStorageValue } from "@/utils/cookies";
import { getLatestTransactionsByAdminApi } from "@/services/admin/transaction";
import { getRecentTransactionsApi } from "@/services/transaction";
import { callApiHook } from "@/utils/apifuncs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AmountFormat from "@/components/common/AmountFormat";

const RecentTransactions = () => {
  const user = getLocalStorageValue("user");
  const router = useRouter();
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
        const transactions =
          user?.role == Role.USER ? response : response?.data;
        setRecentTransactions(transactions ? transactions.slice(0, 5) : []);
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
                        {transaction?.transaction_request?.user?.first_name}{" "}
                        {transaction?.transaction_request?.user?.last_name}
                      </span>{" "}
                      <span className="font-medium text-caption text-custom-title-gray">
                        (
                        {
                          unitName[
                          transaction?.transaction_request?.unit?.toLowerCase()
                          ]
                        }
                        )
                      </span>
                    </div>
                  ) : (
                    unitName[
                    transaction?.transaction_request?.unit?.toLowerCase()
                    ]
                  )
                }
                date={transaction?.created_at}
                direction={
                  transaction?.transaction_request?.type ==
                    transactionTypes.Deposit
                    ? "incoming"
                    : "outgoing"
                }
                onClick={() => {
                  router.push(`/transactions/details/${transaction?.id}`);
                }}
                amount={<AmountFormat amount={user?.role == Role.ADMIN
                  ? transaction?.paid_amount
                  : transaction?.net_amount} type="crypto" className="max-w-24 overflow-hidden font-semibold md:text-button 2xl:text-p120 3.75xl:text-h4 3xl:text-p122 text-base text-end text-ellipsisF" />}
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
