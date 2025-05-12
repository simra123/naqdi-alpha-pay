"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { getAllPaymentsByAdminApi } from "@/services/admin/payments";
import { getClientPaymentsListApi } from "@/services/payments";
import useLocalStorage from "@/hooks/useLocalStorage";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import momentTZ from "moment-timezone";
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
import { formatDateToUserTimeZone } from "@/utils/dates";
import LoaderButton from "@/components/common/LoaderButton";
import DepositModal from "@/components/Modals/DepoistModal";
import { hasMinAccess } from "@/utils/cookies";

const unpaidStatuses = ["Pending", "Cancel", "New"];

interface PaymentAPi {
  pageValue?: number;
  limitValue?: number;
  sort?: any;
  filters?: any;
}

const paymentsList_table_columns: TableColumns = [
  {
    field: "payment_uuid",
    headerName: "ID",
  },
  {
    field: "created_at",
    headerName: "Created At",

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
    field: "updated_at",
    headerName: "Updated At",

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
    field: "client.id",
    headerName: "Merchant ID",
    target: "_self",
    link: (row: any) => {
      if (hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read)) {
        return `/merchants/details/${row?.client?.id}`;
      }
    },
  },
  {
    field: "client.first_name",
    headerName: "Merchant First Name",
  },
  {
    field: "client.last_name",
    headerName: "Merchant Last Name",
  },
  {
    field: "client.email",
    headerName: "Merchant Email",
  },
  {
    field: "client.username",
    headerName: "Merchant Username",
  },
  {
    field: "client.user_type",
    headerName: "Merchant Type",
  },

  {
    field: "wallet.blockchain",
    headerName: "Blockchain",
  },
  {
    field: "payment_currency",
    headerName: "Currency",
  },

  {
    field: "wallet.address",
    headerName: "Reciever Wallet Address",
    copyable: true,
    link: (row: any) => {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.wallet?.blockchain,
        type: "address",
        address: row?.wallet?.address,
      });
    },
  },
  {
    field: "requestedPaymentAmount",
    headerName: "Requested Payment Amount",
    dataValidator(value, row: any) {
      return `${row?.requested_amount} ${row?.requested_currency}`;
    },
  },
  {
    field: "amountToPay",
    headerName: "Amount to Pay",
    dataValidator(value, row: any) {
      return `${roundToPrecision(row?.payment_currency_amount, 6)} ${
        row?.payment_currency
      }`;
    },
  },
  {
    field: "amountPaid",
    headerName: "Amount Paid",
    dataValidator(value, row: any) {
      return (
        roundToPrecision(
          row?.paymentTransaction?.reduce((acc, transaction) => {
            return acc + parseFloat(transaction.transaction_amount);
          }, 0),
          6
        ) +
        " " +
        row?.payment_currency
      );
    },
  },
  {
    field: "paid",
    headerName: "Paid",
    dataValidator(value, row: any) {
      return unpaidStatuses.some((status) => status == row?.status)
        ? "No"
        : "Yes";
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

const Payments = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [paymentsList, setPaymentsList] = useState<ListApiResponse | any>(
    user?.role == Role.USER ? null : []
  );
  const [columns, setColumns] = useState([]);
  const [listConfig, setListConfig] = useState(null);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi({
    initailLoading: true,
  });

  const getPayments = async ({
    pageValue,
    limitValue,
    sort,
    filters,
  }: PaymentAPi) => {
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
                    const currentTimeZone = momentTZ.tz.guess();

                    let date: string | string[] = momentTZ(value)
                      .tz(currentTimeZone)
                      .format("DD-MM-YYYY.hh:mm A");

                    let [day, time] = date.split(".");
                    return (
                      <div className="flex flex-col gap-1">
                        <span className="text-caption">{day}</span>
                        <span className="text-custom-title-gray text-subtitle">
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

          setColumns(modifiedColumns);

          setListConfig(response.listConfig);

          setPaymentsList(response);
        }
        if (user?.role == Role.ADMIN) {
          setPaymentsList(response);
        }
      },
    });
  };

  const toggelPaymentModal = () => {
    setIsPaymentOpen(!isPaymentOpen);
  };

  const onPaymentCreation = () => {
    getPayments({ limitValue: 10, pageValue: 1, filters: [], sort: [] });
  };

  useEffect(() => {
    getPayments({ limitValue: 10, pageValue: 1, filters: [], sort: [] });
  }, []);

  const formatCsvData = useMemo(() => {
    const rows = user?.role == Role.ADMIN ? paymentsList : paymentsList?.result;
    const formattedData = rows?.map(
      ({ wallet, paymentTransaction, client, ...rest }) => ({
        ...rest,
        wallet: wallet?.address ?? "",
        alphaspay_fees: paymentTransaction.reduce((sum, transaction) => {
          return sum + (transaction.alphaspay_fees || 0);
        }, 0),
      })
    );

    return formattedData;
  }, [paymentsList]);

  return (
    <>
      <DepositModal
        isOpen={isPaymentOpen}
        setIsOpen={setIsPaymentOpen}
        onSuccessCallback={onPaymentCreation}
        type="payment"
      />
      <div className="flex justify-between items-center">
        <h3 className="hidden md:block mb-8 font-semibold text-blackGrey-100 text-h3">
          Payments
        </h3>
        <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
          {PermissionAccess(
            LoaderButton,
            ModulesEnum.payment,
            AccessLevelEnum.full
          )({
            content: "New Payment",
            className: "px-16",
            variant: "contained",
            onClick: toggelPaymentModal,
          })}
        </RenderRoleBased>
      </div>

      {/* Table Actions Below */}
      <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
        <div>
          <CustomTable
            columns={paymentsList_table_columns}
            rows={paymentsList}
            csv={true}
            tableName="Payments"
            initialPageSize={10}
            rowClickHandler={(row: any) =>
              router.push(`payments/details/${row?.id}`)
            }
            pagination
            columnClassName="max-w-[250px]"
            loading={isPaymentLoading}
            csvData={formatCsvData}
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
            onRowClick={(row) => {
              router.push(`payments/details/${row?.id}`);
            }}
            selectable={false}
            pagination
            csvData={formatCsvData}
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
