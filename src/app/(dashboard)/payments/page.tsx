"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import {
  getAllPaymentsByAdminApi,
  getClientPaymentsListApi,
} from "@/services/payments";
import useLocalStorage from "@/hooks/useLocalStorage";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { generateCSVApi } from "@/services/common";
import Chip from "@/components/common/Chip";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import PermissionAccess from "@/middleware/PermissionAccess";
import AdvancedTable from "@/components/common/AdvancedTable";
import { ListApiResponse } from "@/components/common/AdvancedTable/types";
import { roundToPrecision } from "@/utils/math";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import CustomTable from "@/components/common/CustomTable";

const unpaidStatuses = ["Pending", "Cancel", "New"];
const paymentsList_table_columns: TableColumns = [
  {
    field: "payment_uuid",
    headerName: "ID",
  },
  {
    field: "createdAt",
    headerName: "Created At",
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
  },
  {
    field: "blockchain",
    headerName: "Blockchain",
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
  },
  {
    field: "requestedPaymentAmount",
    headerName: "Requested Payment Amount",
  },
  {
    field: "amountToPay",
    headerName: "Amount to Pay",
  },
  {
    field: "amountPaid",
    headerName: "Amount Paid",
  },
  {
    field: "paid",
    headerName: "Paid",
  },
  {
    field: "status",
    headerName: "Status",

    dataValidator: (value) => {
      return <Chip status={value} />;
    },
  },
];

const Payments = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [paymentsList, setPaymentsList] = useState<ListApiResponse | any>(
    user?.role == Role.USER ? null : []
  );
  const [columns, setColumns] = useState([]);
  const [listConfig, setListConfig] = useState(null);

  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi({
    initailLoading: true,
  });

  const getPayments = async ({
    pageValue,
    limitValue,
    sort,
    filters,
  }: {
    pageValue?: number;
    limitValue?: number;
    sort?: any;
    filters?: any;
  }) => {
    // if (user?.role == Role.USER) {

    let paymentCall = () => {
      return user?.role == Role.USER
        ? getClientPaymentsListApi(
            { sort, filters },
            { limit: limitValue, page: pageValue }
          )
        : getAllPaymentsByAdminApi();
    };

    await callApiHook({
      apiCall: callPaymentApi(paymentCall()),
      successCallBack: (response: any) => {
        if (user?.role == Role.USER) {
          const modifiedColumns = response?.listConfig.views[0].columns.map(
            (column) => {
              if (column.listColumnsMeta.name === "wallet.address") {
                return {
                  ...column,
                  copyable: true,
                  link: (row: {
                    wallet: { blockchain: string; address: string };
                  }) => {
                    console.log({ row, message: "Inside mod cols loops" });
                    return showExplorerDetailsByChain({
                      env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
                      blockchain: row?.wallet?.blockchain,
                      type: "address",
                      address: row?.wallet.address,
                    });
                  },
                };
              }

              if (
                ["created_at", "updated_at"].includes(
                  column.listColumnsMeta.name
                )
              ) {
                return {
                  ...column,
                  dataValidator: (value: string) => {
                    let date: string | string[] =
                      moment(value).format("DD-MM-YYYY_HH:MM a");
                    let [day, time] = date.split("_");
                    return (
                      <div className="flex flex-col gap-1">
                        <span className="text-caption">{day}</span>
                        <span className="text-subtitle text-custom-title-gray">
                          {time}
                        </span>
                      </div>
                    );
                  },
                };
              }

              if (column.listColumnsMeta.name === "status") {
                return {
                  ...column,
                  dataValidator: (value: string) => <Chip status={value} />,
                };
              }

              return column;
            }
          );

          response.listConfig.views[0].columns = modifiedColumns;

          console.log({ modifiedColumns });

          setColumns(modifiedColumns);

          setListConfig(response.listConfig);

          setPaymentsList(response);
        }
        if (user?.role == Role.ADMIN) {
          const tableData = response.map((item) => {
            return {
              id: item?.id,
              payment_uuid: item?.payment_uuid,
              blockchain: item?.wallet?.blockchain,
              createdAt: moment(item?.created_at).format(
                "DD-MM-YYYY : hh:mm A"
              ),
              updatedAt: moment(item?.updated_at).format(
                "DD-MM-YYYY : hh:mm A"
              ),
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
        }
      },
    });
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
    getPayments({ limitValue: 10, pageValue: 1, filters: [], sort: [] });
  }, []);

  console.log({ colsState: columns });

  return (
    <>
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8 md:block hidden">
        Payments
      </h3>

      {/* Table Actions Below */}
      <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
        <div>
          <CustomTable
            columns={paymentsList_table_columns}
            rows={paymentsList}
            csv={{
              handler: ExportCSVHandler,
              loading: isCSVLoading,
              error: isCSVError,
            }}
            initialPageSize={10}
            rowClickHandler={(row: any) =>
              router.push(`payments/details/${row?.id}`)
            }
            pagination
            columnClassName="max-w-[250px]"
            loading={isPaymentLoading}
          />
        </div>
      </RenderRoleBased>

      <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
        <div>
          <AdvancedTable
            columns={columns}
            setColumns={setColumns}
            rows={paymentsList?.result}
            listConfig={listConfig}
            setListConfig={setListConfig}
            selectable={false}
            pagination
            loading={isPaymentLoading}
            totalItems={paymentsList?.total}
            fetchData={getPayments}
            tableName="payments"
          />
        </div>
      </RenderRoleBased>
      <ErrorApiText error={isPaymentError} />
    </>
  );
};

export default PermissionAccess(
  Payments,
  ModulesEnum.payment,
  AccessLevelEnum.read
);
