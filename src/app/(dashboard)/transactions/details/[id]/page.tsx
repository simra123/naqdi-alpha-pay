"use client";
import React, { useEffect, useState } from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import { getTransactionDetailsApi } from "@/services/transaction";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { capitalize } from "@/utils/dataFormatters";
import { roundToPrecision } from "@/utils/math";

const TransactionDetails = ({ params }) => {
  const tranascionId = params?.id;
  const [transactionDetails, setTransactionDetails]: any = useState({});
  const [
    isTransactionDetailsLoading,
    isTransactionDetailsError,
    callTransactionDetailsApi,
  ] = useApi(true);

  const getTransactionDetails = async () => {
    await callApiHook({
      apiCall: callTransactionDetailsApi(
        getTransactionDetailsApi({ id: tranascionId })
      ),
      successCallBack: (response: any) => {
        setTransactionDetails(response);
      },
    });
  };

  useEffect(() => {
    getTransactionDetails();
  }, []);

  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Transaction Details</h2>
        </div>
        <ErrorApiText error={isTransactionDetailsError} />
        <LoadingApi loading={isTransactionDetailsLoading}>
          <div className="detailspage mt-6">
            <div className="flex flex-col gap-4">
              <DetailsWrapper title={"Date Received"}>
                <TransparentInput
                  value={moment(transactionDetails?.createdAt).format(
                    "DD-MM-YYYY"
                  )}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"Related Payment"}>
                <TransparentInput
                  value={"Payments in progress....."}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"Transaction Hash"}>
                <TransparentInput
                  value={transactionDetails?.transaction_hash}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"Transaction Type"}>
                <TransparentInput
                  value={capitalize(transactionDetails?.transaction_type)}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"Amount"}>
                <TransparentInput value={`${roundToPrecision(+transactionDetails?.amount,10)} ${transactionDetails?.unit}`} />
              </DetailsWrapper>
              <DetailsWrapper title={"Source Wallet Address"}>
                <TransparentInput
                  value={transactionDetails?.wallet?.wallet_address}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"Payment Address"}>
                <TransparentInput
                  value={`In Progress...`}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"Network"}>
                <TransparentInput value={capitalize(transactionDetails?.wallet?.blockchain)} />
              </DetailsWrapper>
              <DetailsWrapper title={"Status"}>
                <TransparentInput value={capitalize(transactionDetails?.status)} />
              </DetailsWrapper>
            </div>
          </div>
        </LoadingApi>
      </div>
    </DashboardPageWrapper>
  );
};

export default TransactionDetails;
