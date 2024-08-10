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
import { CalendarMonth, Mail, Person } from "@mui/icons-material";

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
          <div className="res-4-grid py-6 mt-4">
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

          <h4 className="text-button font-semibold mt-2">Dates</h4>

          <div className="res-4-grid py-6 border-b border-light-gray">
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

          <h4 className="text-button font-semibold mt-6">Payments</h4>

          <div className="res-4-grid py-6 border-b border-light-gray">
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
          <h4 className="text-button font-semibold mt-6">Status</h4>

          <div className="res-4-grid py-6">
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

          <h4 className="text-button font-semibold mb-5">Notes</h4>

          <div className="border-b border-gray p-4 text-gray-400 font-medium w-full min-h-36 rounded-small bg-light-gray">
            {payment?.notes}
          </div>
        </LoadingApi>
      </ErrorApiText>
    </div>
  );
};

export default PaymentDetails;

//     {/* <DetailsWrapper title={"Gross Requested Amount"}>
//   <TransparentInput value={`1 USD`} />
// </DetailsWrapper> */}
//     {/* <DetailsWrapper title={"Payment Fee Amount"}>
//   <TransparentInput value={`0.01 USD`} />
// </DetailsWrapper> */}
//     <DetailsWrapper title={"Payment"}>
//       <TransparentInput
//         value={`${payment?.requested_amount} ${payment?.requested_currency}`}
//         label={"Payment Amount"}
//       />
//       <TransparentInput
//         value={`${payment?.payment_currency_amount} ${payment?.payment_currency}`}
//         label={"Payment Amount Received"}
//       />
//     </DetailsWrapper>
//     {/* <DetailsWrapper title={"Requested Amount Remaining"}>
//   <TransparentInput value={`0.01 USD`} />
// </DetailsWrapper> */}
//     {/* <DetailsWrapper title={"Unprocessed Crypto Amount"}>
//   <TransparentInput value={`0.01 USD`} />
// </DetailsWrapper>
// <DetailsWrapper title={"Net Amount Credited"}>
//   <TransparentInput value={`0 USD`} />
// </DetailsWrapper> */}
//     <DetailsWrapper title={"Status"}>
//       <TransparentInput
//         value={
//           unpaidStatuses.some((status) => status == payment?.status)
//             ? "Unpaid"
//             : "Paid"
//         }
//         label={"Paid Status"}
//       />
//       <TransparentInput
//         value={payment?.status}
//         label={"Payment Status"}
//       />
//     </DetailsWrapper>
//     {/* <DetailsWrapper title={"Configuration"}>
//   <TransparentInput value={`Alphaspay`} label={"Profile"} />
//   <TransparentInput value={`service-alpha`} label={"User"} />
// </DetailsWrapper> */}

//     <DetailsWrapper title={"Notes"}>
//       <TransparentInput value={payment?.notes} textarea />
//     </DetailsWrapper>
//     {/* <DetailsWrapper title={"Pass Through"}>
//   <TransparentInput value={`_`} textarea />
// </DetailsWrapper> */}

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
