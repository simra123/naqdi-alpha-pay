"use client";
import React, { useEffect, useState } from "react";

import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import {
  getPaymentTransactionDetailsByAdminApi,
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
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import LoaderButton from "@/components/common/LoaderButton";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import { resendWebhookAPI } from "@/services/Integration";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";

enum TransactionType {
  Deposit = "Self Deposit",
  Withdrawal = "Withdrawal",
  Payment = "Payment",
}

const TransactionDetails = ({ params }) => {
  const tranascionId = params?.id;
  const dispatch = useDispatch();
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
  ] = useApi({ initailLoading: true });
  const [isWebhookLoading, isWebhookError, callWebhookApi] = useApi();

  const _getTransactionByType = () => {
    if (user?.role == Role.USER) {
      if (transactionType == TransactionType.Deposit) {
        return getTransactionDetailsByUserApi({ id: tranascionId });
      }
      if (transactionType == TransactionType.Payment) {
        return getPaymentTransactionDetailsByUserApi({ id: tranascionId });
      }
      if (transactionType == TransactionType.Withdrawal) {
        return getWithdrawalTransactionDetailsByUserApi({
          transaction_id: +tranascionId,
        });
      }
    }
    if (user?.role == Role.ADMIN) {
      if (transactionType == TransactionType.Deposit) {
        return getTransactionDetailsByAdminApi({ id: tranascionId });
      }
      if (transactionType == TransactionType.Payment) {
        return getPaymentTransactionDetailsByAdminApi({ id: tranascionId });
      }

      // TODO: Need Admin api for now commenting this

      if (transactionType == TransactionType.Withdrawal) {
        return getWithdrawalTransactionDetailsByUserApi({
          transaction_id: +tranascionId,
        });
      }
    }
  };

  const getTransactionDetails = async () => {
    await callApiHook({
      apiCall: callTransactionDetailsApi(_getTransactionByType()),
      successCallBack: (response: any) => {
        setTransactionDetails(response);
      },
    });
  };
  const resendWebhook = async () => {
    await callApiHook({
      apiCall: callWebhookApi(
        resendWebhookAPI({ payment_id: transactionDetails?.payment?.id ,transaction_id : +tranascionId})
      ),
      successCallBack: (response: any) => {
        dispatch(
          setNotification({
            message: "Webhook has been sent again.",
            status: "success",
          })
        );
      },
    });
  };

  useEffect(() => {
    getTransactionDetails();
  }, []);

  return (
    <div className="flex flex-col bg-white rounded-medium">
      <h3 className="font-semibold text-blackGrey-100 text-h3.5">
        Transaction Details
      </h3>

      <ErrorApiText error={isTransactionDetailsError} />
      <LoadingApi loading={isTransactionDetailsLoading}>
        <div className="flex items-center gap-2 mt-8 py-4 border-b border-light-gray">
          <FolderIcon />
          <h5 className="font-semibold text-h5 text-purple-500">General</h5>
        </div>
        <div className="!items-start res-2-grid py-6">
          <Details
            label="ID"
            value={
              transactionDetails?.payment_transaction_uuid ||
              transactionDetails?.withdraw_transaction_uuid ||
              transactionDetails?.transaction_uuid
            }
          />
          <Details
            label="Blockchain"
            value={
              transactionDetails?.wallet?.blockchain ||
              transactionDetails?.clientWallet?.blockchain
            }
          />
          <Details
            label="Transaction Type"
            value={transactionDetails?.transaction_type}
          />
          <Details
            label="Transaction Hash"
            value={transactionDetails?.transaction_hash}
            link={showExplorerDetailsByChain({
              env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
              blockchain:
                transactionDetails?.wallet?.blockchain ||
                transactionDetails?.clientWallet?.blockchain,
              type: "hash",
              hash: transactionDetails?.transaction_hash,
            })}
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
          <Details
            label="Alphaspay Fees"
            value={`${roundToPrecision(
              +transactionDetails?.withdrawal?.alphaspay_fee ||
                +transactionDetails?.alphaspay_fees,
              10
            )} ${transactionDetails?.unit}`}
          />

          <Details
            label="Client Fees"
            value={
              transactionDetails?.client_fee
                ? `${transactionDetails?.client_fee} ${transactionDetails?.unit}`
                : "0"
            }
          />

          {transactionType == TransactionType.Payment && (
            <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
              <div className="max-w-[240px]">
                <LoaderButton
                  content={"Send Webhook Request"}
                  loading={isWebhookLoading}
                  onClick={resendWebhook}
                />
              </div>
            </RenderRoleBased>
          )}
        </div>

        <ErrorApiText error={isWebhookError} />

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <PaymentIcon active={false} />
          <h5 className="font-semibold text-h5 text-purple-500">Wallets</h5>
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
            link={showExplorerDetailsByChain({
              env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
              blockchain:
                transactionDetails?.wallet?.blockchain ||
                transactionDetails?.clientWallet?.blockchain,
              type: "address",
              address:
                transactionType == "Withdrawal"
                  ? transactionDetails?.withdrawal?.recipient_address
                  : transactionDetails?.wallet?.wallet_address ||
                    transactionDetails?.wallet?.address,
            })}
          />
          <Details
            label="Sender Wallet Address"
            copyable
            value={transactionDetails?.sender_address}
            link={showExplorerDetailsByChain({
              env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
              blockchain:
                transactionDetails?.wallet?.blockchain ||
                transactionDetails?.clientWallet?.blockchain,
              type: "address",
              address: transactionDetails?.sender_address,
            })}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <CalenderIcon />
          <h5 className="font-semibold text-h5 text-purple-500">Dates</h5>
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

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <StatusIcon />
          <h5 className="font-semibold text-h5 text-purple-500">Status</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details label="Status" value={transactionDetails?.status} />
        </div>
      </LoadingApi>
    </div>
  );
};

export default TransactionDetails;
