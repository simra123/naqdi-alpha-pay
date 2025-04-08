"use client";

import React, { useEffect, useState } from "react";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook } from "@/utils/apifuncs";
import {
  getPaymentDetailsApi,
  getPaymentDetailsByAdminApi,
} from "@/services/payments";
import moment from "moment";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import Details from "@/components/common/Details";
import { InfoOutlined, Mail } from "@mui/icons-material";
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
import { nileExplorerBaseURL } from "@/constants/block-explorers";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import { TableColumns } from "@/constants/types";
import WebhookResponseTabs from "@/components/ui/WebhookResponseTabs";
import RenderRoleBased from "@/components/common/RenderRoleBased";

const unpaidStatuses = ["Pending", "Cancel", "New"];

const transactionsList_table_columns: TableColumns = [
  { field: "payment_transaction_uuid", headerName: "ID", sortable: true },
  { field: "dateReceived", headerName: "Date Received", sortable: true },
  {
    field: "senderAddress",
    headerName: "Sender Address",
    sortable: true,
    copyable: true,
    link(row: { blockchain: string; senderAddress: string }) {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "address",
        address: row?.senderAddress,
      });
    },
  },
  {
    field: "receiveAddress",
    headerName: "Receive Address",
    sortable: true,
    copyable: true,
    link(row: { blockchain: string; receiveAddress: string }) {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "address",
        address: row?.receiveAddress,
      });
    },
  },
  {
    field: "transactionHash",
    headerName: "Transaction Hash",
    sortable: true,
    copyable: true,
    link(row: { blockchain: string; transactionHash: string }) {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "hash",
        hash: row?.transactionHash,
      });
    },
  },
  { field: "recievedAmount", headerName: "Recieved Amount", sortable: true },
  { field: "netAmount", headerName: "Net Amount", sortable: true },

  { field: "blockchain", headerName: "Blockchain", sortable: true },
  {
    field: "status",
    headerName: "Status",
    sortable: true,
    dataValidator: (value) => {
      return <Chip status={value} />;
    },
  },
];

const PaymentDetails = ({ params }) => {
  const paymentId = params?.id;
  const user = useLocalStorage("user");
  const router = useRouter();

  const [payment, setPayment] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [transaction, setTransacion] = useState([]);
  const [orderInfo, setOrderInfo] = useState<{}>(null);
  const [receivedAmount, setRecievedAmount] = useState({
    totalAmount: "0",
    netAmount: "0",
    fees: "0",
  });
  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi({
    initailLoading: true,
  });

  const getPayment = async () => {
    // if (user?.role == Role.USER) {

    let paymentDetailCall =
      user?.role == Role.USER
        ? getPaymentDetailsApi
        : getPaymentDetailsByAdminApi;

    await callApiHook({
      apiCall: callPaymentApi(paymentDetailCall(paymentId)),
      successCallBack: (response: any) => {
        const transactionsList = response?.paymentTransaction?.map((item) => ({
          id: item?.id,
          payment_transaction_uuid: item?.payment_transaction_uuid,
          dateReceived: moment(item?.created_at).format("DD-MM-YYYY : hh:mm A"),
          senderAddress: item?.sender_address,
          receiveAddress: response?.wallet?.address,
          recievedAmount: `${item?.total_amount_received} ${item?.unit}`,
          netAmount: `${item?.transaction_amount} ${item?.unit}`,
          transactionHash: item?.transaction_hash,
          blockchain: capitalize(response?.wallet?.blockchain),
          status: item?.status,
        }));

        setTransacion(transactionsList);

        const netAmountReceived = response?.paymentTransaction?.reduce(
          (acc, transaction) => {
            return acc + parseFloat(transaction.transaction_amount);
          },
          0
        );
        const totalAmountReceived = response?.paymentTransaction?.reduce(
          (acc, transaction) => {
            return acc + parseFloat(transaction.total_amount_received);
          },
          0
        );
        const totalFees = response?.paymentTransaction?.reduce(
          (acc, transaction) => {
            return acc + parseFloat(transaction.alphaspay_fees);
          },
          0
        );

        setRecievedAmount({
          totalAmount:
            roundToPrecision(totalAmountReceived, 6) +
            " " +
            response?.payment_currency,
          netAmount:
            roundToPrecision(netAmountReceived, 6) +
            " " +
            response?.payment_currency,
          fees:
            roundToPrecision(totalFees, 6) + " " + response?.payment_currency,
        });

        try {
          const parsedData = JSON.parse(response.passthrough);
          setOrderInfo(parsedData);
        } catch (error) {
          console.error("Failed to parse JSON:", error);
        }
        setPayment(response);

        // Handling Webhooks Below

        const webhooks = mergeWebhookResponses(response?.paymentTransaction);
        setWebhooks(webhooks);
      },
    });
    // }
  };

  useEffect(() => {
    getPayment();
  }, []);

  return (
    <>
      <LoadingApi loading={isPaymentLoading}>
        <div className="flex flex-col bg-white rounded-medium">
          <h3 className="font-semibold text-blackGrey-100 text-h3.5">
            Payment Details
          </h3>

          <ErrorApiText error={isPaymentError}>
            <div className="flex items-center gap-2 mt-8 py-4 border-b border-light-gray">
              <FolderIcon />
              <h5 className="font-semibold text-h5 text-purple-500">General</h5>
            </div>
            <div className="res-2-grid py-6">
              <Details label="Blockchain" value={payment?.wallet?.blockchain} />
              <Details
                label="Requested Amount"
                value={`${payment?.requested_amount} ${payment?.requested_currency}`}
              />
              <Details label="ID" value={payment?.payment_uuid} />
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
                  value={payment?.client?.id}
                  link={`/merchants/details/${payment?.client?.id}`}
                  target="_self"
                />
                <Details
                  label="First Name"
                  value={payment?.client?.first_name}
                />
                <Details label="Last Name" value={payment?.client?.last_name} />
                <Details label="Username" value={payment?.client?.username} />
                <Details label="Email" value={payment?.client?.email} />
                <Details label="Role" value={payment?.client?.role} />
                <Details label="User Type" value={payment?.client?.user_type} />
                <Details
                  label="Created Date"
                  value={moment(payment?.client?.created_at).format(
                    "DD-MM-YYYY"
                  )}
                />
                <Details
                  label="Updated Date"
                  value={moment(payment?.client?.updated_at).format(
                    "DD-MM-YYYY"
                  )}
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
              <h5 className="font-semibold text-h5 text-purple-500">
                Payments
              </h5>
            </div>

            <div className="res-2-grid py-6">
              <Details
                label="Payment Amount"
                value={`${payment?.requested_amount} ${payment?.requested_currency}`}
              />
              <Details
                label="Payment Currency Amount "
                value={`${payment?.payment_currency_amount} ${payment?.payment_currency}`}
              />
              <Details
                label="Total Payment Amount Recieved"
                value={receivedAmount?.totalAmount}
              />
              <Details
                label="Net Payment Amount Recieved"
                value={receivedAmount?.netAmount}
              />
              <Details label="Alphaspay Fee" value={receivedAmount?.fees} />
            </div>

            <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
              <StatusIcon />
              <h5 className="font-semibold text-h5 text-purple-500">Status</h5>
            </div>

            <div className="res-2-grid py-6">
              <Details
                label="Paid Stauts"
                value={
                  unpaidStatuses.some((status) => status == payment?.status)
                    ? "Unpaid"
                    : "Paid"
                }
              />
              <Details label="Payment Status" value={payment?.status} />
            </div>

            {orderInfo && (
              <>
                <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
                  <InfoOutlined className="text-purple-500" />
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
            rows={transaction}
            actions={
              <h3 className="mb-8 font-semibold text-blackGrey-100 text-h3.5">
                Related Transactions
              </h3>
            }
            rowClickHandler={(row: any) =>
              router.push(`/transactions/details/${row?.id}?type=Payment`)
            }
            columnClassName="max-w-[200px]"
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

export default PaymentDetails;
