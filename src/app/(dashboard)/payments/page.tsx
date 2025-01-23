"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import {
  getAllPaymentsApi,
  getAllPaymentsByAdminApi,
} from "@/services/payments";
import useLocalStorage from "@/hooks/useLocalStorage";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { generateCSVApi } from "@/services/common";
import CustomTable from "@/components/common/CustomTable";
import { capitalize } from "@/utils/dataFormatters";
import { KeyboardArrowRight } from "@mui/icons-material";
import Chip from "@/components/common/Chip";
import DateField from "@/components/common/DateField";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { roundToPrecision } from "@/utils/math";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import PermissionAccess from "@/middleware/PermissionAccess";
import AdvancedTable from "@/components/common/AdvancedTable";

const unpaidStatuses = ["Pending", "Cancel", "New"];

const paymentsList_table_columns: TableColumns = [
  {
    field: "payment_uuid",
    headerName: "ID",
    sticky: true,
    id: 1,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    sticky: true,
    id: 2,
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    id: 3,
  },

  {
    field: "recieverAddress",
    headerName: "Reciever Wallet Address",
    copyable: true,
    link: (row: { blockchain: string; recieverAddress: string }) => {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "address",
        address: row?.recieverAddress,
      });
    },
    maxWidth: 250,
    id: 5,
  },
  {
    field: "blockchain",
    headerName: "Blockchain",
    id: 4,
    sticky: true,
  },
  {
    field: "requestedPaymentAmount",
    headerName: "Requested Payment Amount",
    id: 6,
    sticky: true,
  },
  {
    field: "amountToPay",
    headerName: "Amount to Pay",
    id: 7,
  },
  {
    field: "amountPaid",
    headerName: "Amount Paid",
    id: 8,
  },
  {
    field: "paid",
    headerName: "Paid",
    id: 9,
  },
  {
    field: "status",
    headerName: "Status",

    dataValidator: (value) => {
      return <Chip status={value} />;
    },
    id: 10,
  },
];

const Payments = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [paymentsList, setPaymentsList] = useState([]);

  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi({
    initailLoading: true,
  });
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const getPayments = async () => {
    // if (user?.role == Role.USER) {

    let paymentCall =
      user?.role == Role.USER ? getAllPaymentsApi : getAllPaymentsByAdminApi;

    await callApiHook({
      apiCall: callPaymentApi(paymentCall()),
      successCallBack: (response: any) => {
        const tableData = response.map((item) => {
          return {
            id: item?.id,
            payment_uuid: item?.payment_uuid,
            blockchain: item?.wallet?.blockchain,
            createdAt: moment(item?.created_at).format("DD-MM-YYYY : hh:mm A"),
            updatedAt: moment(item?.updated_at).format("DD-MM-YYYY : hh:mm A"),
            senderAddress: item?.paymentTransaction?.sender_address,
            recieverAddress: item?.wallet?.address,
            requestedPaymentAmount: `${item?.requested_amount} ${item?.requested_currency}`,
            amountToPay: `${roundToPrecision(
              item?.payment_currency_amount,
              6
            )} ${item?.payment_currency}`,
            amountPaid:
              roundToPrecision(
                item?.paymentTransaction?.reduce((acc, transaction) => {
                  return acc + parseFloat(transaction.transaction_amount);
                }, 0),
                6
              ) +
              " " +
              item?.payment_currency,
            paid: unpaidStatuses.some((status) => status == item?.status)
              ? "No"
              : "Yes",
            status: item?.status,
          };
        });
        setPaymentsList(tableData);
      },
    });
    // }
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
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8 md:block hidden">
        Payments
      </h3>

      {/* Table Actions Below */}

      <div>
        <AdvancedTable
          columns={paymentsList_table_columns}
          rows={paymentsList}
          onSearch={() => {}}
          onSort={() => {}}
          selectable={false}
          pagination
        />

        <ErrorApiText error={isPaymentError} />
      </div>
    </>
  );
};

export default PermissionAccess(
  Payments,
  ModulesEnum.payment,
  AccessLevelEnum.read
);
