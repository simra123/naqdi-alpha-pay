"use client";

import React, { useEffect, useState } from "react";

import { relatedTransactions_table_columns } from "../../columns";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook } from "@/utils/apifuncs";
import { getPaymentDetailsApi } from "@/services/payments";
import moment from "moment";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import Details from "@/components/common/Details";
import { CalendarMonth, Mail, Payment, Person } from "@mui/icons-material";
import {
  CalenderIcon,
  FolderIcon,
  PaymentIcon,
  StatusIcon,
} from "@/assets/Svgs";

const unpaidStatuses = ["Pending", "Cancel", "New"];

const PaymentDetails = ({ params }) => {
  const paymentId = params?.id;

  const user = useLocalStorage("user");
  const [payment, setPayment] = useState(null);
  const [transaction, setTransacion] = useState([]);
  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi(true);

  const getPayment = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callPaymentApi(getPaymentDetailsApi(paymentId)),
        successCallBack: (response: any) => {
          setTransacion([
            {
              id: 1,
              date: moment(response?.paymentTransaction?.created_at).format(
                "DD-MM-YYYY"
              ),
              received: moment(response?.paymentTransaction?.updated_at).format(
                "DD-MM-YYYY"
              ),
              blockchain_transaction_hash:
                response?.paymentTransaction?.transaction_hash,
              amount: `${response?.paymentTransaction?.amount} ${response?.paymentTransaction?.unit}`,
              network: response?.wallet?.blockchain,
              status: response?.paymentTransaction?.status,
            },
          ]);
          setPayment(response);
        },
      });
    }
  };

  useEffect(() => {
    getPayment();
  }, []);

  return (
    <div className="rounded-medium flex flex-col  bg-white p-6">
      <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
        Payment Details
      </h3>

      <ErrorApiText error={isPaymentError}>
        <LoadingApi loading={isPaymentLoading}>
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
            <Details
              Icon={Mail}
              label="Sender Wallet Address"
              value={payment?.paymentTransaction?.sender_address || "_"}
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
            <h5 className="text-purple-100 text-h5 font-semibold">Payments</h5>
          </div>

          <div className="res-2-grid py-6">
            <Details
              Icon={Payment}
              label="Payment Amount"
              value={`${payment?.requested_amount} ${payment?.requested_currency}`}
            />
            <Details
              Icon={Payment}
              label="Payment Amount Recieved"
              value={`${payment?.payment_currency_amount} ${payment?.payment_currency}`}
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

          <h4 className="text-button font-semibold mb-5">Notes</h4>

          <div className="border border-light-gray p-4 text-gray-400 font-medium w-full min-h-36 rounded-large">
            {payment?.notes}
          </div>
        </LoadingApi>
      </ErrorApiText>
    </div>
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
