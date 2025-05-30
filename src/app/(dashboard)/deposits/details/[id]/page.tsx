"use client";

import React, { useEffect, useState } from "react";

import { getLocalStorageValue } from "@/utils/cookies";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook } from "@/utils/apifuncs";
import moment from "moment";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import Details from "@/components/common/Details";
import {
  CalenderIcon,
  FolderIcon,
  MerchantDetailIcon,
  PaymentIcon,
  StatusIcon,
} from "@/assets/Svgs";
import CustomTable from "@/components/common/CustomTable";
import Chip from "@/components/common/Chip";
import { useRouter } from "next/navigation";
import { capitalize, mergeWebhookResponses } from "@/utils/dataFormatters";
import { roundToPrecision } from "@/utils/math";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import WebhookResponseTabs from "@/components/ui/WebhookResponseTabs";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import { MdOutlineInfo } from "react-icons/md";
import { getPermission, hasMinAccess } from "@/utils/cookies";
import { getTransactionRequestDetailsByUserApi } from "@/services/transaction";
import { getTransactionRequestDetailsByAdminApi } from "@/services/admin/transaction";
import { formatDateToUserTimeZone } from "@/utils/dates";

const unpaidStatuses = ["Pending", "Cancel", "New"];

const DepositDetails = ({ params }) => {
  const paymentId = params?.id;
  const user = getLocalStorageValue("user");
  const router = useRouter();

  const [payment, setPayment] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [orderInfo, setOrderInfo] = useState<{}>(null);

  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi({
    initailLoading: true,
  });
  const isMerchantHasReadAccess = hasMinAccess(
    ModulesEnum.merchant,
    AccessLevelEnum.read
  );

  const getPayment = async () => {
    let paymentDetailCall =
      user?.role == Role.USER
        ? getTransactionRequestDetailsByUserApi
        : getTransactionRequestDetailsByAdminApi;

    await callApiHook({
      apiCall: callPaymentApi(paymentDetailCall({ id: paymentId })),
      successCallBack: (response: any) => {
        try {
          const parsedData = JSON.parse(response.passthrough);
          setOrderInfo(parsedData);
        } catch (error) {}
        setPayment(response);

        // Handling Webhooks Below

        const webhooks = mergeWebhookResponses(response?.webhook_request);
        setWebhooks(webhooks);
      },
    });
  };

  const transactionsList_table_columns: TableColumns = [
    { field: "id", headerName: "ID" },
    {
      field: "created_at",
      headerName: "Date Received",
      dataValidator: (value) => {
        let [day, time] = formatDateToUserTimeZone(value);
        return (
          <div className="flex flex-col gap-1">
            <span className="text-caption">{day}</span>
            <span className="text-custom-title-gray text-subtitle">{time}</span>
          </div>
        );
      },
    },
    {
      field: "sender_address",
      headerName: "Sender Address",
      copyable: true,
      link(row: any) {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: payment?.wallet?.blockchain,
          type: "address",
          address: row?.sender_address,
        });
      },
    },
    {
      field: "receiver_address",
      headerName: "Receive Address",
      copyable: true,
      link(row: any) {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: payment?.wallet?.blockchain,
          type: "address",
          address: row?.receiver_address,
        });
      },
    },
    {
      field: "hash",
      headerName: "Transaction Hash",
      copyable: true,
      link(row: any) {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: payment?.wallet?.blockchain,
          type: "hash",
          hash: row?.hash,
        });
      },
    },
    {
      field: "paid_amount",
      headerName: "Received Amount",
      dataValidator(value) {
        return value ? `${value} ${payment?.unit}` : "_";
      },
    },
    {
      field: "net_amount",
      headerName: "Net Amount",
      dataValidator(value) {
        return value ? `${value} ${payment?.unit}` : "_";
      },
    },

    {
      field: "fee",
      headerName: "Alphaspay Fee",
      dataValidator(value) {
        return value ? `${value} ${payment?.unit}` : "_";
      },
    },
    {
      field: "fiat_paid_amount",
      headerName: "Fiat Paid",
      dataValidator(value) {
        return value ? `${value} ${payment?.fiat_currency}` : "_";
      },
    },
    {
      field: "fiat_net_amount",
      headerName: "Fiat Net Amount",
      dataValidator(value) {
        return value ? `${value} ${payment?.fiat_currency} ` : "_";
      },
    },

    {
      field: "fiat_fee",
      headerName: "Fiat Fee",
      dataValidator(value) {
        return value ? `${value} ${payment?.fiat_currency}` : "_";
      },
    },

    {
      field: "status",
      headerName: "Status",
      dataValidator: (value) => {
        return <Chip status={value} />;
      },
    },
  ];

  useEffect(() => {
    getPayment();
  }, []);

  return (
    <>
      <LoadingApi loading={isPaymentLoading}>
        <div className="flex flex-col bg-white rounded-medium">
          <h3 className="font-semibold text-blackGrey-100 text-h3.5">
            Deposit Details
          </h3>

          <ErrorApiText error={isPaymentError}>
            <div className="flex items-center gap-2 mt-8 py-4 border-b border-light-gray">
              <FolderIcon />
              <h5 className="font-semibold text-h5 text-purple-500">General</h5>
            </div>
            <div className="res-2-grid py-6">
              <Details label="ID" value={payment?.id} />
              <Details label="Blockchain" value={payment?.wallet?.blockchain} />
              <Details
                label="Wallet Address"
                value={payment?.wallet?.address}
                link={showExplorerDetailsByChain({
                  env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
                  blockchain: payment?.wallet?.blockchain,
                  type: "address",
                  address: payment?.wallet?.address,
                })}
                copyable
              />
            </div>

            <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
              <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
                <MerchantDetailIcon />
                <h5 className="font-semibold text-h5 text-purple-500">
                  Merchant
                </h5>
              </div>
              <div className="res-2-grid !grid-cols-1 lg:!grid-cols-2 py-6">
                <Details
                  label="ID"
                  value={payment?.user?.id}
                  link={
                    isMerchantHasReadAccess &&
                    `/merchants/details/${payment?.user?.id}`
                  }
                  target="_self"
                />
                <Details label="First Name" value={payment?.user?.first_name} />
                <Details label="Last Name" value={payment?.user?.last_name} />
                <Details label="Username" value={payment?.user?.username} />
                <Details label="Email" value={payment?.user?.email} />
                <Details label="Role" value={payment?.user?.role} />
                <Details label="User Type" value={payment?.user?.user_type} />
                <Details
                  label="Created Date"
                  value={moment(payment?.created_at).format("DD-MM-YYYY")}
                />
                <Details
                  label="Updated Date"
                  value={moment(payment?.updated_at).format("DD-MM-YYYY")}
                />
              </div>
            </RenderRoleBased>

            <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
              <CalenderIcon />
              <h5 className="font-semibold text-h5 text-purple-500">Dates</h5>
            </div>

            <div className="res-2-grid py-6">
              <Details
                label="Created Date"
                value={moment(payment?.created_at).format("DD-MM-YYYY")}
              />
              <Details
                label="Updated Date"
                value={moment(payment?.updated_at).format("DD-MM-YYYY")}
              />
            </div>

            <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
              <PaymentIcon active={false} />
              <h5 className="font-semibold text-h5 text-purple-500">Amount</h5>
            </div>

            <div className="res-2-grid py-6">
              <Details
                label="Fiat Deposit Amount"
                value={`${payment?.fiat_initial_amount} ${payment?.fiat_currency}`}
              />
              <Details
                label="Crypto Deposit Amount "
                value={`${payment?.initial_amount} ${payment?.unit}`}
              />
              <Details
                label="Fiat Amount Recieved"
                value={`${payment?.fiat_paid_amount || 0} ${
                  payment?.fiat_currency
                }`}
              />
              <Details
                label="Fiat Alphaspay Fee"
                value={`${payment?.fiat_initial_fee} ${payment?.fiat_currency}`}
              />
              <Details
                label="Fiat Net Amount Recieved"
                value={`${payment?.fiat_net_amount || 0} ${
                  payment?.fiat_currency
                }`}
              />
              <Details
                label="Crypto Amount Recieved"
                value={`${payment?.paid_amount || 0} ${payment?.unit}`}
              />
              <Details
                label="Crypto Alphaspay Fee"
                value={`${payment?.initial_fee} ${payment?.unit}`}
              />
              <Details
                label="Crypto Net Amount Recieved"
                value={`${payment?.net_amount || 0} ${payment?.unit}`}
              />
            </div>

            <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
              <StatusIcon />
              <h5 className="font-semibold text-h5 text-purple-500">Status</h5>
            </div>

            <div className="res-2-grid py-6">
              <Details
                label="Paid Status"
                value={
                  unpaidStatuses.some((status) => status == payment?.status)
                    ? "Unpaid"
                    : "Paid"
                }
              />
              <Details label="Deposit Status" value={payment?.status} />
            </div>

            {orderInfo && (
              <>
                <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
                  <MdOutlineInfo className="text-purple-500" />
                  <h5 className="font-semibold text-h5 text-purple-500">
                    Order Information
                  </h5>
                </div>

                <div className="res-2-grid py-6">
                  {orderInfo &&
                    Object.entries(orderInfo).map(([key, value]: any) => (
                      <Details label={key} value={value} />
                    ))}
                </div>
              </>
            )}

            <h4 className="mb-5 font-semibold text-button">Notes</h4>

            <div className="p-4 border border-light-gray rounded-large w-full min-h-36 font-medium text-custom-caption-gray">
              {payment?.notes}
            </div>
          </ErrorApiText>
        </div>

        <div className="mt-8">
          <CustomTable
            columns={transactionsList_table_columns}
            rows={payment?.transactions}
            actions={
              <h3 className="mb-8 font-semibold text-blackGrey-100 text-h3.5">
                Related Transactions
              </h3>
            }
            rowClickHandler={(row: any) =>
              hasMinAccess(ModulesEnum.transaction, AccessLevelEnum.read) &&
              router.push(`/transactions/details/${row?.id}`)
            }
            columnClassName="max-w-[250px]"
          />
        </div>

        <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
          <div className="mt-8">
            <WebhookResponseTabs data={webhooks} />
          </div>
        </RenderRoleBased>
      </LoadingApi>
    </>
  );
};

export default DepositDetails;
