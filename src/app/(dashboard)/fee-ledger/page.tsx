"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Role } from "@/constants/roles";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";

import ErrorApiText from "@/components/common/ErrorApiText";

import { generateCSVApi } from "@/services/common";
import CustomTable from "@/components/common/CustomTable";

import CreateWithdrawalModal from "@/components/Modals/CreateWithdrawalModal";

import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";

import PermissionAccess from "@/middleware/PermissionAccess";
import AdvancedTable from "@/components/common/AdvancedTable";
import { ListApiResponse } from "@/components/common/AdvancedTable/types";
import momentTZ from "moment-timezone";
import { formatDateToUserTimeZone } from "@/utils/dates";
import { getUserLedgerListApi } from "@/services/feeLedger";
import { getAdminLedgerListApi } from "@/services/admin/feeLedger";
import {  hasMinAccess } from "@/utils/cookies";


const FeeLedger = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [FeeLedgerList, setFeeLedgerList] = useState<ListApiResponse | any>(
    user?.role == Role.USER ? null : []
  );
  const [columns, setColumns] = useState([]);
  const [listConfig, setListConfig] = useState(null);
  const [isFeeLedgerListLoading, isFeeLedgerListError, callFeeLedgerListApi] =
    useApi({ initailLoading: true });

  const getFeeLedger = async ({
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

    let feeLeadgerCall = () => {
      return user?.role == Role.USER
        ? getUserLedgerListApi(
            { sort, filters },
            { limit: limitValue, page: pageValue }
          )
        : getAdminLedgerListApi();
    };

    await callApiHook({
      apiCall: callFeeLedgerListApi(feeLeadgerCall()),
      successCallBack: (response: any) => {
        if (user.role == Role.USER) {
          const modifiedColumns = response?.listConfig.views[0].columns.map(
            (column) => {
              if (["createdAt"].includes(column.listColumnsMeta.name)) {
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
              if (["fee"].includes(column.listColumnsMeta.name)) {
                return {
                  ...column,
                  dataValidator: (value: string) => {
                    return `${value} %`;
                  },
                };
              }

              return column;
            }
          );

          response.listConfig.views[0].columns = modifiedColumns;

      

          setColumns(modifiedColumns);

          setListConfig(response.listConfig);

          setFeeLedgerList(response);
        }
        if (user?.role == Role.ADMIN) {
          setFeeLedgerList(response);
        }
      },
    });
    // }
  };

  const feeLedger_table_columns: TableColumns = [
    { field: "id", headerName: "ID", sortable: true },
    {
      field: "type",
      headerName: "Transaction Type",
      link(row: any) {
        if (row?.payment_id && hasMinAccess(ModulesEnum.payment,AccessLevelEnum.read)) {
          return `/payments/details/${row?.payment_id}`;
        }
        if (row?.withdraw_id && hasMinAccess(ModulesEnum.withdrawal,AccessLevelEnum.read)) {
          return `/withdrawals/details/${row?.withdraw_id}`;
        }
      },
      target: "_self",
    },
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
    { field: "transaction_type", headerName: "Currency Type", sortable: true },
    { field: "unit", headerName: "Currency", sortable: true },

    { field: "received_amount", headerName: "Received Amount", sortable: true },
    { field: "paid_amount", headerName: "Paid Amount", sortable: true },
    { field: "fee_amount", headerName: "Fee Amount", sortable: true },
    {
      field: "fee",
      headerName: "Fee (%)",
      sortable: true,
      dataValidator(value, row) {
        return `${value} %`;
      },
    },
    {
      field: "owner_first_name",
      headerName: "Merchant First Name",
    },
    {
      field: "owner_last_name",
      headerName: "Merchant Last Name",
    },
    {
      field: "owner_email",
      headerName: "Merchant Email",
    },
    {
      field: "owner_user_type",
      headerName: "Merchant Type",
    },
  ];

  useEffect(() => {
    getFeeLedger({ limitValue: 10, pageValue: 1, filters: [], sort: [] });
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
          getFeeLedger({
            pageValue: 1,
            filters: [],
            limitValue: 10,
            sort: [],
          });
        }}
      />

      <div className="hidden md:flex justify-between items-center mb-8">
        <h3 className="font-semibold text-blackGrey-100 text-h3">Fee Ledger</h3>
      </div>

      {user?.role == Role.ADMIN && (
        <CustomTable
          loading={isFeeLedgerListLoading}
          columns={feeLedger_table_columns}
          // Filters={Filters}
          createHandler={toggleCreateModal}
          rows={FeeLedgerList}
          csv={true}
          tableName="fee-ledger"
          initialPageSize={10}
          rowClickHandler={(row: any) =>
            hasMinAccess(ModulesEnum.merchant,AccessLevelEnum.read) &&
            router.push(`/merchants/details/${row?.owner_id}`)
          }
          pagination
          columnClassName="max-w-[200px]"
        />
      )}

      {user?.role == Role.USER && (
        <div>
          <AdvancedTable
            columns={columns}
            setColumns={setColumns}
            rows={FeeLedgerList?.result}
            listConfig={listConfig}
            setListConfig={setListConfig}
            selectable={false}
            onRowClick={(row) => {
              if (row?.payment && hasMinAccess(ModulesEnum.payment,AccessLevelEnum.read)) {
                router.push(`payments/details/${row.payment?.id}`);
              }
              if (row?.withdraw && hasMinAccess(ModulesEnum.withdrawal,AccessLevelEnum.read)) {
                router.push(`withdrawals/details/${row.withdraw?.id}`);
              }
            }}
            pagination
            loading={isFeeLedgerListLoading}
            totalItems={FeeLedgerList?.total}
            fetchData={getFeeLedger}
            tableName="fee-ledger"
          />
        </div>
      )}
      <ErrorApiText error={isFeeLedgerListError} />
    </>
  );
};

export default PermissionAccess(
  FeeLedger,
  ModulesEnum.feeLedger,
  AccessLevelEnum.read
);
