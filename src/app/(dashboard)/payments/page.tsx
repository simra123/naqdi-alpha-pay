"use client";

import React, { useEffect, useState } from "react";
import { Chip } from "@mui/material";

import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { getAllPaymentsApi } from "@/services/payments";
import useLocalStorage from "@/hooks/useLocalStorage";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { generateCSVApi } from "@/services/common";
import CustomTable from "@/components/common/CustomTable";

const unpaidStatuses = ["Pending", "Cancel", "New"];

export const paymentsList_table_columns = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    sortable: true,
    type: "number",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,

    sortable: true,
    type: "date",
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    flex: 1,
    filterable: false,
    sortable: true,
    type: "date",
  },
  {
    field: "requestedPaymentAmount",
    headerName: "Requested Payment Amount",
    flex: 1,

    sortable: true,
    type: "string",
  },
  {
    field: "amountPaid",
    headerName: "Amount Paid",
    flex: 1,
    filterable: false,
    sortable: true,
    type: "string",
  },
  {
    field: "paid",
    headerName: "Paid",
    flex: 1,

    sortable: true,
    type: "string",
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,

    sortable: true,
    type: "list",
    dataValidator: (column) => {
      return <Chip label={column} />;
    },
  },
];

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
              createdAt: moment(item?.created_at).format(
                "DD-MM-YYYY : hh:mm A"
              ),
              updatedAt: moment(item?.updated_at).format(
                "DD-MM-YYYY : hh:mm A"
              ),
              requestedPaymentAmount: `${item?.requested_amount} ${item?.requested_currency}`,
              amountPaid: `${item?.payment_currency_amount} ${item?.payment_currency}`,
              paid: unpaidStatuses.some((status) => status == item?.status)
                ? "No"
                : "Yes",
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
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8">
        Payments
      </h3>

      {/* Table Actions Below */}

      <div>
        <LoadingApi loading={isPaymentLoading}>
          <CustomTable
            columns={paymentsList_table_columns}
            rows={paymentsList}
            csv={{
              handler: ExportCSVHandler,
              loading: isCSVLoading,
              error: isCSVError,
            }}
            initialPageSize={10}
            rowClickHandler={(row:any) => router.push(`payments/details/${row?.id}`)}
          />
        </LoadingApi>
        <ErrorApiText error={isPaymentError} />
      </div>
    </>
  );
};

export default Payments;
