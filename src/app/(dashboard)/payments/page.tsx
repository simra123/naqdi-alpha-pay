"use client";

import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Sync } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { paymentsList_table_columns } from "./columns";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { getAllPaymentsApi } from "@/services/payments";
import useLocalStorage from "@/hooks/useLocalStorage";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { generateCSVApi } from "@/services/common";
import LoaderButton from "@/components/common/LoaderButton";

const rows = [
  {
    id: 1,
    createdAt: "2024-04-18",
    updatedAt: "2024-04-18",
    requestedPaymentAmount: "200 USD",
    amountPaid: "150 USD",
    paid: "Yes",
    status: "Completed",
  },
  // Add more rows here if needed
];

const unpaidStatuses = ['Pending','Cancel','New']

const Payments = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [paymentsList, setPaymentsList] = useState([]);

  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi(true);
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const getPayments = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callPaymentApi(getAllPaymentsApi()),
        successCallBack: (response: any) => {
          const tableData = response.map((item) => {
            return {
              id: item?.id,
              createdAt: moment(item?.created_at).format('DD-MM-YYYY : hh:mm A'),
              updatedAt: moment(item?.updated_at).format('DD-MM-YYYY : hh:mm A'),
              requestedPaymentAmount: `${item?.requested_amount} ${item?.requested_currency}`,
              amountPaid: `${item?.payment_currency_amount} ${item?.payment_currency}`,
              paid: unpaidStatuses.some(status => status == item?.status) ? "No" : "Yes",
              status: item?.status,
            };
          });
          setPaymentsList(tableData);
        },
      });
    }
  };

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(paymentsList)),
      successCallBack: (response: any) => {
        downloadCSV(response, "payments.csv");
      },
    });
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <>
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payments</h2>
          <div className="actions flex gap-3">
            <LoaderButton
              onClick={getPayments}
              loading={isPaymentLoading}
              content={<Sync />}
            />

            <LoaderButton
              content={"Export CSV"}
              onClick={ExportCSVHandler}
              loading={isCSVLoading}
            />

            {/* <Button
              variant="text"
              color="primary"
              LinkComponent={Link}
              href="/payments/create"
            >
              New Payment
            </Button> */}
          </div>
        </div>

        <LoadingApi loading={isPaymentLoading}>
          <DataGrid
            rows={paymentsList}
            autoHeight
            columns={paymentsList_table_columns}
            className="border-t-0 primary-color"
            sx={{
              ".MuiDataGrid-overlayWrapper": {
                padding: "25px",
              },
              ".MuiDataGrid-overlayWrapperInner": {
                height: "10px !important",
              },
            }}
            onRowClick={(params) => {
              router.push(`/payments/details/${params?.row?.id}`);
            }}
            sortingOrder={["asc", "desc"]}
            pagination
          />
        </LoadingApi>
        <ErrorApiText error={isPaymentError} />
      </div>
    </>
  );
};

export default Payments;
