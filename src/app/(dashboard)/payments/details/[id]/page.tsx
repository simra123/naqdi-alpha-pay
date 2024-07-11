"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";

import {
  converstion_table_columns,
  relatedPayments_table_columns,
  relatedTransactions_table_columns,
  webhooks_table_columns,
} from "../../columns";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook } from "@/utils/apifuncs";
import { getPaymentDetailsApi } from "@/services/payments";
import moment from "moment";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";

const unpaidStatuses = ['Pending','Cancel']

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
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payment Details</h2>
          <div className="actions flex gap-5">
            <Button variant="text" color="primary" disabled>
              Cancel
            </Button>
            <Button variant="text" color="primary" disabled>
              Convert
            </Button>
            <Button variant="text" color="primary" disabled>
              Re-Evaluate
            </Button>
            <Button variant="text" color="primary" disabled>
              Return Unprocessed Crypto
            </Button>
          </div>
        </div>
        <ErrorApiText error={isPaymentError}>
          <LoadingApi loading={isPaymentLoading}>
            <div className="detailspage mt-6">
              <div className="flex flex-col gap-4">
                <DetailsWrapper title={"Date"} align>
                  <TransparentInput
                    label={`Created At`}
                    value={moment(payment?.created_at).format("DD-MM-YYYY")}
                  />

                  <TransparentInput
                    label={`Updated At`}
                    value={moment(payment?.updated_at).format("DD-MM-YYYY")}
                  />
                </DetailsWrapper>
                <DetailsWrapper title={"ID"} align>
                  <TransparentInput label={`ID`} value={payment?.id} />
                </DetailsWrapper>
                <DetailsWrapper title={"Wallet Address"}>
                  <TransparentInput value={payment?.wallet?.address} />
                </DetailsWrapper>
                <DetailsWrapper title={"Blockchain"}>
                  <TransparentInput value={payment?.wallet?.blockchain} />
                </DetailsWrapper>

                <DetailsWrapper title={"Requested"}>
                  <TransparentInput
                    value={`${payment?.requested_amount} ${payment?.requested_currency}`}
                    label={"Requested Amount"}
                  />
                  {/* <TransparentInput value={`_`} label={"Markup Amount"} /> */}
                </DetailsWrapper>
                {/* <DetailsWrapper title={"Gross Requested Amount"}>
              <TransparentInput value={`1 USD`} />
            </DetailsWrapper> */}
                {/* <DetailsWrapper title={"Payment Fee Amount"}>
              <TransparentInput value={`0.01 USD`} />
            </DetailsWrapper> */}
                <DetailsWrapper title={"Payment"}>
                  <TransparentInput
                    value={`${payment?.requested_amount} ${payment?.requested_currency}`}
                    label={"Payment Amount"}
                  />
                  <TransparentInput
                    value={`${payment?.payment_currency_amount} ${payment?.payment_currency}`}
                    label={"Payment Amount Received"}
                  />
                </DetailsWrapper>
                {/* <DetailsWrapper title={"Requested Amount Remaining"}>
              <TransparentInput value={`0.01 USD`} />
            </DetailsWrapper> */}
                {/* <DetailsWrapper title={"Unprocessed Crypto Amount"}>
              <TransparentInput value={`0.01 USD`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Net Amount Credited"}>
              <TransparentInput value={`0 USD`} />
            </DetailsWrapper> */}
                <DetailsWrapper title={"Status"}>
                  <TransparentInput
                    value={unpaidStatuses.some(status => status == payment?.status) ? "Unpaid" : "Paid"}
                    label={"Paid Status"}
                  />
                  <TransparentInput
                    value={payment?.status}
                    label={"Payment Status"}
                  />
                </DetailsWrapper>
                {/* <DetailsWrapper title={"Configuration"}>
              <TransparentInput value={`Alphaspay`} label={"Profile"} />
              <TransparentInput value={`service-alpha`} label={"User"} />
            </DetailsWrapper> */}

                <DetailsWrapper title={"Notes"}>
                  <TransparentInput value={payment?.notes} textarea />
                </DetailsWrapper>
                {/* <DetailsWrapper title={"Pass Through"}>
              <TransparentInput value={`_`} textarea />
            </DetailsWrapper> */}

                {/* TABLES BELOW */}

                {/* <div className="data-grid-container">
              <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Conversions</h2>
              </div>

              <DataGrid
                rows={[]}
                columns={converstion_table_columns}
                className="font-semibold primary-color border-t-0"
                hideFooter
                autoHeight
              />
            </div> */}
                {payment?.paymentTransaction && (
                  <div className="data-grid-container">
                    <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        Related Transactions
                      </h2>
                    </div>

                    <DataGrid
                      rows={transaction}
                      columns={relatedTransactions_table_columns}
                      className="font-semibold primary-color  border-t-0"
                      hideFooter
                      autoHeight
                    />
                  </div>
                )}

                {/* <div className="data-grid-container">
              <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Related Payments</h2>
              </div>

              <DataGrid
                rows={[]}
                columns={relatedPayments_table_columns}
                className="font-semibold primary-color  border-t-0"
                hideFooter
                autoHeight
              />
            </div> */}

                {/* <div className="data-grid-container">
              <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Webhooks</h2>
              </div>

              <DataGrid
                rows={[]}
                columns={webhooks_table_columns}
                className="font-semibold primary-color  border-t-0"
                hideFooter
                autoHeight
              />
            </div> */}
              </div>
            </div>
          </LoadingApi>
        </ErrorApiText>
      </div>
    </DashboardPageWrapper>
  );
};

export default PaymentDetails;
