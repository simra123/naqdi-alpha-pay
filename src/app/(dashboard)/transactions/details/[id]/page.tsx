"use client";
import React, { useEffect, useState } from "react";

import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import {
  getPaymentTransactionDetailsByUserApi,
  getTransactionDetailsByUserApi,
  getWithdrawalTransactionDetailsByUserApi,
} from "@/services/transaction";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { capitalize } from "@/utils/dataFormatters";
import { roundToPrecision } from "@/utils/math";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";
import { getTransactionDetailsByAdminApi } from "@/services/admin/transaction";
import { Mail, Person } from "@mui/icons-material";
import Details from "@/components/common/Details";
import {
  CalenderIcon,
  FolderIcon,
  PaymentIcon,
  StatusIcon,
} from "@/assets/Svgs";
import { notFound, useSearchParams } from "next/navigation";

const TransactionDetails = ({ params }) => {
  const tranascionId = params?.id;
  const URLParams = useSearchParams();
  const transactionType = URLParams.get("type");

  if (!transactionType) {
    return notFound();
  }

  const user = useLocalStorage("user");
  const [transactionDetails, setTransactionDetails] = useState<any>({});
  const [
    isTransactionDetailsLoading,
    isTransactionDetailsError,
    callTransactionDetailsApi,
  ] = useApi(true);

  const _getTransactionByType = () => {
    if (transactionType == "Self Deposit") {
      return getTransactionDetailsByUserApi({ id: tranascionId });
    }
    if (transactionType == "Payment") {
      return getPaymentTransactionDetailsByUserApi({ id: tranascionId });
    }
    if (transactionType == "Withdrawal") {
      return getWithdrawalTransactionDetailsByUserApi({
        transaction_id: +tranascionId,
      });
    }
  };

  const getTransactionDetails = async () => {
    if (user.role == Role.USER) {
      await callApiHook({
        apiCall: callTransactionDetailsApi(_getTransactionByType()),
        successCallBack: (response: any) => {
          setTransactionDetails(response);
        },
      });
    }

    if (user.role == Role.ADMIN) {
      await callApiHook({
        apiCall: callTransactionDetailsApi(
          getTransactionDetailsByAdminApi({ id: tranascionId })
        ),
        successCallBack: (response: any) => {
          setTransactionDetails(response);
        },
      });
    }
  };

  useEffect(() => {
    getTransactionDetails();
  }, []);

  return (
    <div className="rounded-medium flex flex-col  bg-white p-6">
      <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
        Transaction Details
      </h3>

      <ErrorApiText error={isTransactionDetailsError} />
      <LoadingApi loading={isTransactionDetailsLoading}>
        <div className="flex items-center gap-2 mt-8 border-b border-light-gray py-4">
          <FolderIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">General</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="ID" value={transactionDetails?.id} />
          <Details
            label="Blockchain"
            value={transactionDetails?.wallet?.blockchain}
          />
          <Details
            label="Transaction Type"
            value={transactionDetails?.transaction_type}
          />
          <Details
            label="Transaction Hash"
            value={transactionDetails?.transaction_hash}
            copyable
          />
          <Details
            label="Amount"
            value={`${roundToPrecision(
              +transactionDetails?.transaction_amount ||
                +transactionDetails?.amount,
              10
            )} ${transactionDetails?.unit}`}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <PaymentIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">Wallets</h5>
        </div>
        <div className="res-2-grid !grid-cols-1 lg:!grid-cols-2 py-6">
          <Details
            label="Reciever Wallet Address"
            copyable
            value={
              transactionType == "Withdrawal"
                ? transactionDetails?.withdrawal?.recipient_address
                : transactionDetails?.wallet?.wallet_address ||
                  transactionDetails?.wallet?.address
            }
          />
          <Details
            label="Sender Wallet Address"
            copyable
            value={transactionDetails?.sender_address}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <CalenderIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">Dates</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details
            label="Created Date"
            value={moment(transactionDetails?.createdAt).format("DD-MM-YYYY")}
          />
          <Details
            label="Updated Date"
            value={moment(transactionDetails?.updatedAt).format("DD-MM-YYYY")}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <StatusIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">Status</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details label="Status" value={transactionDetails?.status} />
        </div>
      </LoadingApi>
    </div>
  );
};

export default TransactionDetails;
