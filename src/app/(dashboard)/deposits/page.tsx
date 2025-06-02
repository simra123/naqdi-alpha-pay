"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { getAllPaymentsByAdminApi } from "@/services/admin/payments";
import { getClientPaymentsListApi } from "@/services/payments";
import { getLocalStorageValue } from "@/utils/cookies";
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
import { ColumnConfig, formatCSVDataByColumnOrder } from "@/utils/csv";
import CustomTableV2 from "@/components/common/CustomTableV2";

const unpaidStatuses = ["Pending", "Cancel", "New"];

interface PaymentAPi {
  pageValue?: number;
  limitValue?: number;
  sort?: any;
  filters?: any;
}

const paymentsList_table_columns: TableColumns = [
  {
    field: "id",
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
    field: "user.id",
    headerName: "Merchant ID",
    target: "_self",
    link: (row: any) => {
      if (hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read)) {
        return `/merchants/details/${row?.user?.id}`;
      }
    },
  },
  {
    field: "user.first_name",
    headerName: "Merchant First Name",
  },
  {
    field: "user.last_name",
    headerName: "Merchant Last Name",
  },
  {
    field: "user.email",
    headerName: "Merchant Email",
  },
  {
    field: "user.username",
    headerName: "Merchant Username",
  },
  {
    field: "user.user_type",
    headerName: "Merchant Type",
  },

  {
    field: "wallet.blockchain",
    headerName: "Blockchain",
  },
  {
    field: "unit",
    headerName: "Unit",
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
    field: "fiat_initial_amount",
    headerName: "Requested Payment Amount",
    dataValidator(value, row: any) {
      return `${value} ${row?.fiat_currency}`;
    },
  },
  {
    field: "initial_fee",
    headerName: "Alphaspay Fee",
    dataValidator(value: any, row: any) {
      return `${roundToPrecision(value, 6)} ${row?.unit}`;
    },
  },
  {
    field: "initial_amount",
    headerName: "Amount to Pay",
    dataValidator(value: any, row: any) {
      return `${roundToPrecision(value, 6)} ${row?.unit}`;
    },
  },
  {
    field: "paid_amount",
    headerName: "Amount Paid",
    dataValidator(value: any, row: any) {
      return roundToPrecision(value, 10) + row?.payment_currency;
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

const Deposits = () => {
  const router = useRouter();
  const user = getLocalStorageValue("user");
  const [paymentsList, setPaymentsList] = useState<ListApiResponse | any>({
    result: [],
  });
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
        : getAllPaymentsByAdminApi({
            limit: limitValue,
            page: pageValue,
            all: true,
          });
    };

    await callApiHook({
      apiCall: callPaymentApi(paymentCall()),
      successCallBack: (response: any) => {
        console.log({ response });
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
    const columnOrder: ColumnConfig<any>[] = [
      { key: "id" },
      { key: "type" },
      { key: "status" },
      { key: "notes" },
      { key: "rejection_reason" },
      { key: "initial_amount" },
      { key: "paid_amount" },
      { key: "net_amount" },
      { key: "net_client_amount" },
      { key: "initial_fee" },
      { key: "paid_fee" },
      { key: "initial_client_fee" },
      { key: "paid_client_fee" },
      { key: "initial_exchange_rate" },
      { key: "paid_exchange_rate" },
      { key: "client_fee_value" },
      { key: "fee_value" },
      { key: "unit" },
      { key: "standard" },
      { key: "fee_type" },
      { key: "client_fee_type" },
      { key: "fiat_initial_amount" },
      { key: "fiat_paid_amount" },
      { key: "fiat_net_amount" },
      { key: "fiat_net_client_amount" },
      { key: "fiat_initial_client_fee" },
      { key: "fiat_paid_client_fee" },
      { key: "fiat_initial_fee" },
      { key: "fiat_paid_fee" },
      { key: "customer_ref" },
      { key: "recipient_address" },
      { key: "customer_id" },
      { key: "customer_name" },
      { key: "customer_email" },
      { key: "customer_phone_number" },
      { key: "fiat_currency" },
      { key: "created_at" },
      { key: "updated_at" },
      { key: "transactions" },
      { key: "wallet" },
      { key: "contract_address" },
    ];
    if (user?.role == Role.ADMIN) {
      columnOrder.push({ key: "company" },{ key: "user" });
    }

    return formatCSVDataByColumnOrder(paymentsList?.result, columnOrder);
  }, [paymentsList]);

  console.log({ paymentsList });

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
          Deposits
        </h3>
        <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
          {PermissionAccess(
            LoaderButton,
            ModulesEnum.payment,
            AccessLevelEnum.full
          )({
            content: "New Deposit",
            className: "px-16",
            variant: "contained",
            onClick: toggelPaymentModal,
          })}
        </RenderRoleBased>
      </div>

      {/* Table Actions Below */}
      <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
        <div>
          <CustomTableV2
            columns={paymentsList_table_columns}
            rows={paymentsList?.result}
            csv={true}
            tableName="deposits"
            initialPageSize={10}
            rowClickHandler={(row: any) =>
              router.push(`/deposits/details/${row?.id}`)
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
              router.push(`/deposits/details/${row?.id}`);
            }}
            selectable={false}
            pagination
            csvData={formatCsvData}
            loading={isPaymentLoading}
            totalItems={paymentsList?.total}
            fetchData={getPayments}
            tableName="deposits"
          />
        </div>
      </RenderRoleBased>
      <ErrorApiText error={isPaymentError} />
    </>
  );
};

export default PermissionAccess(
  Deposits,
  ModulesEnum.payment,
  AccessLevelEnum.read
);
