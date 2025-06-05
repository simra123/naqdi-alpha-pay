"use client";
import React, { useEffect, useState } from "react";

import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import { getTransactionDetailsByAdminApi } from "@/services/admin/transaction";
import { getTransactionDetailsByUserApi } from "@/services/transaction";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";

import { roundToPrecision } from "@/utils/math";
import { getLocalStorageValue } from "@/utils/cookies";
import { Role } from "@/constants/roles";

import Details from "@/components/common/Details";
import {
  CalenderIcon,
  FolderIcon,
  MerchantDetailIcon,
  PaymentIcon,
  StatusIcon,
} from "@/assets/Svgs";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import LoaderButton from "@/components/common/LoaderButton";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import { resendWebhookAPI } from "@/services/admin/Integration";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";
import { hasMinAccess } from "@/utils/cookies";
import { AccessLevelEnum, ModulesEnum } from "@/constants/types";

enum TransactionType {
  Deposit = "Deposit",
  Withdrawal = "Withdraw",
  Payment = "Payment",
}

const TransactionDetails = ({ params }) => {
  const tranascionId = params?.id;
  const dispatch = useDispatch();

  const user = getLocalStorageValue("user");
  const [transactionDetails, setTransactionDetails] = useState<any>({});
  const [
    isTransactionDetailsLoading,
    isTransactionDetailsError,
    callTransactionDetailsApi,
  ] = useApi({ initailLoading: true });
  const [isWebhookLoading, isWebhookError, callWebhookApi] = useApi();

  const _getTransactionByType = () => {
    if (user?.role == Role.USER) {
      return getTransactionDetailsByUserApi({ id: tranascionId });
    }
    if (user?.role == Role.ADMIN) {
      return getTransactionDetailsByAdminApi({ id: tranascionId });
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
        resendWebhookAPI({
          id: tranascionId,
        })
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
          <Details label="ID" value={transactionDetails?.id} />
          <Details
            label="Blockchain"
            value={
              transactionDetails?.transaction_request?.contract_address
                ?.blockchain_name
            }
          />
          <Details
            label="Transaction Type"
            value={transactionDetails?.transaction_request?.type}
          />
          <Details
            label="Transaction Hash"
            value={transactionDetails?.hash}
            link={showExplorerDetailsByChain({
              env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
              blockchain:
                transactionDetails?.transaction_request?.contract_address
                  ?.blockchain_name,
              type: "hash",
              hash: transactionDetails?.hash,
            })}
            copyable
          />
          <div></div>

          {transactionDetails?.transaction_request?.request_via == "API" && (
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
        <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
          <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
            <MerchantDetailIcon />
            <h5 className="font-semibold text-h5 text-purple-500">Merchant</h5>
          </div>
          <div className="res-2-grid !grid-cols-1 lg:!grid-cols-2 py-6">
            <Details
              label="ID"
              value={transactionDetails?.transaction_request?.user?.id}
              link={
                hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read) &&
                `/merchants/details/${transactionDetails?.transaction_request?.user?.id}`
              }
              target="_self"
            />
            <Details
              label="First Name"
              value={transactionDetails?.transaction_request?.user?.first_name}
            />
            <Details
              label="Last Name"
              value={transactionDetails?.transaction_request?.user?.last_name}
            />
            <Details
              label="Username"
              value={transactionDetails?.transaction_request?.user?.username}
            />
            <Details
              label="Email"
              value={transactionDetails?.transaction_request?.user?.email}
            />
            <Details
              label="Role"
              value={transactionDetails?.transaction_request?.user?.role}
            />
            <Details
              label="User Type"
              value={transactionDetails?.transaction_request?.user?.user_type}
            />
            <Details
              label="Created Date"
              value={moment(
                transactionDetails?.transaction_request?.user?.created_at
              ).format("DD-MM-YYYY")}
            />
            <Details
              label="Updated Date"
              value={moment(
                transactionDetails?.transaction_request?.user?.updated_at
              ).format("DD-MM-YYYY")}
            />
          </div>
        </RenderRoleBased>

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <PaymentIcon active={false} />
          <h5 className="font-semibold text-h5 text-purple-500">Wallets</h5>
        </div>
        <div className="res-2-grid !grid-cols-1 lg:!grid-cols-2 py-6">
          <Details
            label="Reciever Wallet Address"
            copyable
            value={transactionDetails?.receiver_address}
            link={showExplorerDetailsByChain({
              env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
              blockchain:
                transactionDetails?.transaction_request?.contract_address
                  ?.blockchain_name,
              type: "address",
              address: transactionDetails?.receiver_address,
            })}
          />
          <Details
            label="Sender Wallet Address"
            copyable
            value={transactionDetails?.sender_address}
            link={showExplorerDetailsByChain({
              env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
              blockchain:
                transactionDetails?.transaction_request?.contract_address
                  ?.blockchain_name,
              type: "address",
              address: transactionDetails?.sender_address,
            })}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <PaymentIcon active={false} />
          <h5 className="font-semibold text-h5 text-purple-500">
            Transaction Amount
          </h5>
        </div>

        <div className="res-2-grid py-6">
          <Details
            label="Total Fiat Amount Received"
            value={` ${roundToPrecision(
              transactionDetails?.fiat_paid_amount,
              10
            )} ${transactionDetails?.transaction_request?.fiat_currency}`}
          />
          <Details
            label="Total Crypto Amount Received"
            value={` ${roundToPrecision(transactionDetails?.paid_amount, 10)} ${
              transactionDetails?.transaction_request?.unit
            }`}
          />

          <Details
            label="Fiat Alphaspay Fee"
            value={` ${roundToPrecision(transactionDetails?.fiat_fee, 10)} ${
              transactionDetails?.transaction_request?.fiat_currency
            }`}
          />

          <Details
            label="Crypto Alphaspay Fee"
            value={` ${roundToPrecision(transactionDetails?.fee, 10)} ${
              transactionDetails?.transaction_request?.unit
            }`}
          />

          {transactionDetails?.transaction_request?.type !=
            TransactionType.Withdrawal && (
            <>
              <Details
                label="Fiat Client Fee"
                value={` ${roundToPrecision(
                  transactionDetails?.fiat_client_fee,
                  10
                )} ${transactionDetails?.transaction_request?.fiat_currency}`}
              />

              <Details
                label="Crypto Client Fee"
                value={` ${roundToPrecision(
                  transactionDetails?.client_fee,
                  10
                )} ${transactionDetails?.transaction_request?.unit}`}
              />
            </>
          )}

          <Details
            label="Fiat Net Amount"
            value={`${roundToPrecision(
              +transactionDetails?.fiat_net_amount,
              10
            )} ${transactionDetails?.transaction_request?.fiat_currency}`}
          />
          <Details
            label="Crypto Net Amount"
            value={`${roundToPrecision(+transactionDetails?.net_amount, 10)} ${
              transactionDetails?.transaction_request?.unit
            }`}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <CalenderIcon />
          <h5 className="font-semibold text-h5 text-purple-500">Dates</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details
            label="Created Date"
            value={moment(transactionDetails?.created_at).format("DD-MM-YYYY")}
          />
          <Details
            label="Updated Date"
            value={moment(transactionDetails?.updated_at).format("DD-MM-YYYY")}
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
