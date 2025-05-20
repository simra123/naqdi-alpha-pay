"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { Role } from "@/constants/roles";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getUserWithdrawalsListApi } from "@/services/withdrawal";
import { getAdminWithdrawalsListApi } from "@/services/admin/withdrawal";
import { ColumnConfig, formatCSVDataByColumnOrder } from "@/utils/csv";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoaderButton from "@/components/common/LoaderButton";
import CustomTable from "@/components/common/CustomTable";
import Chip from "@/components/common/Chip";
import CreateWithdrawalModal from "@/components/Modals/CreateWithdrawalModal";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import {
  blockchain_standards,
  standardBlockchain,
} from "@/constants/blockchains";
import PermissionAccess from "@/middleware/PermissionAccess";
import AdvancedTable from "@/components/common/AdvancedTable";
import { ListApiResponse } from "@/components/common/AdvancedTable/types";
import momentTZ from "moment-timezone";
import { formatDateToUserTimeZone } from "@/utils/dates";
import { hasMinAccess } from "@/utils/cookies";

const withdrawalsList_table_columns: TableColumns = [
  { field: "withdrawal_uuid", headerName: "ID", sortable: true },
  {
    field: "created_at",
    headerName: "Created At",
    sortable: true,
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
    sortable: true,
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
      return (
        hasMinAccess(ModulesEnum.merchant, AccessLevelEnum.read) &&
        `/merchants/details/${row?.user?.id}`
      );
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
    field: "total_requested_amount",
    headerName: "Total Requested Amount",
    sortable: true,
  },
  { field: "requested_amount", headerName: "Requested Amount", sortable: true },
  { field: "alphaspay_fee", headerName: "Fee", sortable: true },
  { field: "transaction_type", headerName: "Currency Type", sortable: true },
  { field: "unit", headerName: "Currency", sortable: true },
  {
    field: "standard",
    headerName: "Blockchain",
    sortable: true,
    dataValidator(value, row: any) {
      return standardBlockchain[value || blockchain_standards[row?.unit]];
    },
  },
  {
    field: "recipient_address",
    headerName: "Recipient Address",
    sortable: true,
    link(row: {
      standard: string | null;
      recipient_address: string;
      unit: string;
    }) {
      let blockchain: string | null;

      if (row?.standard) {
        blockchain = standardBlockchain[row?.standard];
      } else {
        let standard = blockchain_standards[row?.unit];
        blockchain = standardBlockchain[standard];
      }

      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: blockchain,
        type: "address",
        address: row?.recipient_address,
      });
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

const Withdrawals = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [
    isWithdrawalsListLoading,
    isWithdrawalsListError,
    callWithdrawalsListApi,
  ] = useApi({ initailLoading: true });

  const [withdrawalsList, setWithdrawalsList] = useState<ListApiResponse | any>(
    user?.role == Role.USER ? null : []
  );
  const [columns, setColumns] = useState([]);
  const [listConfig, setListConfig] = useState(null);

  const getWithdrawals = async ({
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

    let withdrawalCall = () => {
      return user?.role == Role.USER
        ? getUserWithdrawalsListApi(
            { sort, filters },
            { limit: limitValue, page: pageValue }
          )
        : getAdminWithdrawalsListApi();
    };

    await callApiHook({
      apiCall: callWithdrawalsListApi(withdrawalCall()),
      successCallBack: (response: any) => {
        if (user.role == Role.USER) {
          const modifiedColumns = response?.listConfig.views[0].columns.map(
            (column) => {
              if (column.listColumnsMeta.name === "recipient_address") {
                return {
                  ...column,
                  copyable: true,
                  link(row: {
                    standard: string | null;
                    recipient_address: string;
                    unit: string;
                  }) {
                    let blockchain: string | null;

                    if (row?.standard) {
                      blockchain = standardBlockchain[row?.standard];
                    } else {
                      let standard = blockchain_standards[row?.unit];
                      blockchain = standardBlockchain[standard];
                    }

                    return showExplorerDetailsByChain({
                      env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
                      blockchain: blockchain,
                      type: "address",
                      address: row?.recipient_address,
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

          setWithdrawalsList(response);
        }
        if (user?.role == Role.ADMIN) {
          setWithdrawalsList(response);
        }
      },
    });
    // }
  };

  const formatCsvData = useMemo(() => {
    const columnOrderUser: ColumnConfig<any>[] = [
      { key: "id" },
      { key: "withdrawal_uuid" },
      { key: "requested_amount" },
      { key: "alphaspay_fee" },
      { key: "total_requested_amount" },
      { key: "unit" },
      { key: "standard" },
      { key: "recipient_address" },
      { key: "transaction_type" },
      { key: "notes" },
      { key: "reason" },
      { key: "status" },
      { key: "user_id" },
      { key: "created_at" },
      { key: "updated_at" },
    ];

    const columnOrderAdmin: ColumnConfig<any>[] = [
      { key: "id" },
      { key: "withdrawal_uuid" },
      { key: "requested_amount" },
      { key: "alphaspay_fee" },
      { key: "total_requested_amount" },
      { key: "unit" },
      { key: "standard" },
      { key: "recipient_address" },
      { key: "transaction_type" },
      { key: "notes" },
      { key: "reason" },
      { key: "status" },
      { key: "user_id" },
      { key: "withdrawalTransactions" },
      { key: "created_at" },
      { key: "updated_at" },
      { key: "user" },
    ];

    const rows =
      user?.role == Role.ADMIN ? withdrawalsList : withdrawalsList?.result;

    return formatCSVDataByColumnOrder(
      rows,
      user?.role == Role.ADMIN ? columnOrderAdmin : columnOrderUser
    );
  }, [withdrawalsList]);

  useEffect(() => {
    getWithdrawals({ limitValue: 10, pageValue: 1, filters: [], sort: [] });
  }, []);

  const toggleCreateModal = () => {
    setIsCreateOpen(!isCreateOpen);
  };

  return (
    <>
      <CreateWithdrawalModal
        isOpen={isCreateOpen}
        toggleHandler={toggleCreateModal}
        refreshHandler={() => {
          getWithdrawals({
            pageValue: 1,
            filters: [],
            limitValue: 10,
            sort: [],
          });
        }}
      />

      <div className="hidden md:flex justify-between items-center mb-8">
        <h3 className="font-semibold text-blackGrey-100 text-h3">
          Withdrawals
        </h3>

        <RenderRoleBased allowedRoles={[Role.USER, Role.ADMIN]} user={user}>
          {PermissionAccess(
            LoaderButton,
            ModulesEnum.withdrawal,
            AccessLevelEnum.full
          )({
            content: "New Withdrawal",
            className: "px-16",
            variant: "contained",
            onClick: toggleCreateModal,
          })}
        </RenderRoleBased>
      </div>

      {user?.role == Role.ADMIN && (
        <CustomTable
          loading={isWithdrawalsListLoading}
          columns={withdrawalsList_table_columns}
          // Filters={Filters}
          createHandler={toggleCreateModal}
          rows={withdrawalsList}
          csv={true}
          tableName="withdrawals"
          initialPageSize={10}
          rowClickHandler={(row: any) =>
            router.push(`/withdrawals/details/${row?.id}`)
          }
          pagination
          columnClassName="max-w-[200px]"
          csvData={formatCsvData}
        />
      )}

      {user?.role == Role.USER && (
        <div>
          <AdvancedTable
            columns={columns}
            setColumns={setColumns}
            rows={withdrawalsList?.result}
            listConfig={listConfig}
            setListConfig={setListConfig}
            selectable={false}
            onRowClick={(row) => {
              router.push(`/withdrawals/details/${row?.id}`);
            }}
            pagination
            loading={isWithdrawalsListLoading}
            totalItems={withdrawalsList?.total}
            fetchData={getWithdrawals}
            tableName="withdrawals"
            csvData={formatCsvData}
          />
        </div>
      )}
      <ErrorApiText error={isWithdrawalsListError} />
    </>
  );
};

export default PermissionAccess(
  Withdrawals,
  ModulesEnum.withdrawal,
  AccessLevelEnum.read
);
