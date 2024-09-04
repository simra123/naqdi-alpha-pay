"use client";

import React, { useEffect, useState } from "react";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook } from "@/utils/apifuncs";
import { getPaymentDetailsApi } from "@/services/payments";
import moment from "moment";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import Details from "@/components/common/Details";
import {
  CalendarMonth,
  Info,
  InfoOutlined,
  Mail,
  Payment,
  Person,
} from "@mui/icons-material";
import {
  CalenderIcon,
  FolderIcon,
  PaymentIcon,
  StatusIcon,
} from "@/assets/Svgs";
import CustomTable from "@/components/common/CustomTable";
import Chip from "@/components/common/Chip";
import { useRouter } from "next/navigation";
import { capitalize } from "@/utils/dataFormatters";
import { roundToPrecision } from "@/utils/math";

const unpaidStatuses = ["Pending", "Cancel", "New"];

const transactionsList_table_columns = [
  { field: "id", headerName: "ID", sortable: true },
  { field: "dateReceived", headerName: "Date Received", sortable: true },
  { field: "senderAddress", headerName: "Sender Address", sortable: true },
  { field: "receiveAddress", headerName: "Receive Address", sortable: true },
  { field: "transactionHash", headerName: "Transaction Hash", sortable: true },
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
  const [transaction, setTransacion] = useState([]);
  const [orderInfo, setOrderInfo]: any = useState(null);
  const [receivedAmount, setRecievedAmount] = useState("0");
  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi(true);

  const getPayment = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callPaymentApi(getPaymentDetailsApi(paymentId)),
        successCallBack: (response: any) => {
          const transactionsList = response?.paymentTransaction?.map(
            (item) => ({
              id: item?.id,
              dateReceived: moment(item?.created_at).format(
                "DD-MM-YYYY : hh:mm A"
              ),
              senderAddress: item?.sender_address,
              receiveAddress: response?.wallet?.address,
              recievedAmount: `${item?.total_amount_received} ${item?.unit}`,
              netAmount: `${item?.transaction_amount} ${item?.unit}`,
              transactionHash: item?.transaction_hash,
              blockchain: capitalize(response?.wallet?.blockchain),
              status: item?.status,
            })
          );
          setTransacion(transactionsList);

          const totalAmount = response?.paymentTransaction?.reduce(
            (acc, transaction) => {
              return acc + parseFloat(transaction.transaction_amount);
            },
            0
          );
          setRecievedAmount(
            roundToPrecision(totalAmount, 6) + " " + response?.payment_currency
          );

          console.log(response.passthrough);

          try {
            const parsedData = JSON.parse(response.passthrough);
            setOrderInfo(parsedData);
          } catch (error) {
            console.error("Failed to parse JSON:", error);
          }
          setPayment(response);
        },
      });
    }
  };

  useEffect(() => {
    getPayment();
  }, []);

  return (
    <>
      <LoadingApi loading={isPaymentLoading}>
        <div className="rounded-medium flex flex-col  bg-white p-10">
          <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
            Payment Details
          </h3>

          <ErrorApiText error={isPaymentError}>
            <div className="flex items-center gap-2 mt-8 border-b border-light-gray py-4">
              <FolderIcon />
              <h5 className="text-purple-100 text-h5 font-semibold">General</h5>
            </div>
            <div className="res-2-grid py-6">
              <Details
                Icon={Person}
                label="Blockchain"
                value={payment?.wallet?.blockchain}
              />
              <Details
                Icon={Mail}
                label="Requested Amount"
                value={`${payment?.requested_amount} ${payment?.requested_currency}`}
              />
              <Details Icon={Mail} label="ID" value={payment?.id} />
              <Details
                Icon={Mail}
                label="Wallet Address"
                value={payment?.wallet?.address}
              />
            </div>

            <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
              <CalenderIcon />
              <h5 className="text-purple-100 text-h5 font-semibold">Dates</h5>
            </div>

            <div className="res-2-grid py-6">
              <Details
                Icon={CalendarMonth}
                label="Created Date"
                value={moment(payment?.created_at).format("DD-MM-YYYY")}
              />
              <Details
                Icon={CalendarMonth}
                label="Updated Date"
                value={moment(payment?.updated_at).format("DD-MM-YYYY")}
              />
            </div>

            <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
              <PaymentIcon />
              <h5 className="text-purple-100 text-h5 font-semibold">
                Payments
              </h5>
            </div>

            <div className="res-2-grid py-6">
              <Details
                Icon={Payment}
                label="Payment Amount "
                value={`${payment?.requested_amount} ${payment?.requested_currency}`}
              />
              <Details
                Icon={Payment}
                label="Payment Currency Amount "
                value={`${payment?.payment_currency_amount} ${payment?.payment_currency}`}
              />
              <Details
                Icon={Payment}
                label="Payment Amount Recieved"
                value={receivedAmount}
              />
            </div>

            <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
              <StatusIcon />
              <h5 className="text-purple-100 text-h5 font-semibold">Status</h5>
            </div>

            <div className="res-2-grid py-6">
              <Details
                Icon={CalendarMonth}
                label="Paid Stauts"
                value={
                  unpaidStatuses.some((status) => status == payment?.status)
                    ? "Unpaid"
                    : "Paid"
                }
              />
              <Details
                Icon={CalendarMonth}
                label="Payment Status"
                value={payment?.status}
              />
            </div>

            {orderInfo && (
              <>
                <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
                  <InfoOutlined className="text-purple-100" />
                  <h5 className="text-purple-100 text-h5 font-semibold">
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

            <h4 className="text-button font-semibold mb-5">Notes</h4>

            <div className="border border-light-gray p-4 text-gray-400 font-medium w-full min-h-36 rounded-large">
              {payment?.notes}
            </div>
          </ErrorApiText>
        </div>

        <div className="mt-8">
          <CustomTable
            columns={transactionsList_table_columns}
            rows={transaction}
            actions={
              <h3 className="text-h3.5 font-semibold text-blackGrey-100 mb-8">
                Related Transactions
              </h3>
            }
            rowClickHandler={(row: any) =>
              router.push(`/transactions/details/${row?.id}?type=Payment`)
            }
            columnClassName="max-w-[200px]"
          />
        </div>
      </LoadingApi>
    </>
  );
};

export default PaymentDetails;

//     {payment?.paymentTransaction && (
//       <div className="data-grid-container">
//         <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
//           <h2 className="text-xl font-semibold">
//             Related Transactions
//           </h2>
//         </div>

//         <DataGrid
//           rows={transaction}
//           columns={relatedTransactions_table_columns}
//           className="font-semibold primary-color  border-t-0"
//           hideFooter
//           autoHeight
//         />
//       </div>
//     )}
