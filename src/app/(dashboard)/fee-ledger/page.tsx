"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Role } from "@/constants/roles";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import {
  getAdminWithdrawalsListApi,
  getUserWithdrawalsListApi,
} from "@/services/withdrawal";
import { formatWithdrawals } from "@/utils/dataFormatters";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import LoaderButton from "@/components/common/LoaderButton";
import { generateCSVApi } from "@/services/common";
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
import { getAdminLedgerListApi, getUserLedgerListApi } from "@/services/feeLedger";

const feeLedger_table_columns: TableColumns = [
  { field: "uuid", headerName: "ID", sortable: true },
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
  { field: "requested_amount", headerName: "Requested Amount", sortable: true },
  { field: "withdrawal_type", headerName: "Withdrawal Type", sortable: true },
  { field: "blockchain", headerName: "Blockchain", sortable: true },

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

const FeeLedger = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFeeLedgerListLoading, isFeeLedgerListError, callFeeLedgerListApi] =
    useApi({ initailLoading: true });

  const [FeeLedgerList, setFeeLedgerList] = useState<ListApiResponse | any>(
    user?.role == Role.USER ? null : []
  );
  const [columns, setColumns] = useState([]);
  const [listConfig, setListConfig] = useState(null);
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(FeeLedgerList)),
      successCallBack: (response: any) => {
        downloadCSV(response, "FeeLedger.csv");
      },
    });
  };

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

                    console.log({ currentTimeZone });

                    let date: string | string[] = momentTZ(value)
                      .tz(currentTimeZone)
                      .format("DD-MM-YYYY.hh:mm A");

                    console.log({ date });

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

          console.log({ modifiedColumns });

          setColumns(modifiedColumns);

          setListConfig(response.listConfig);

          setFeeLedgerList(response);
        }
        if (user?.role == Role.ADMIN) {
          const tableData = formatWithdrawals(response);
          setFeeLedgerList(tableData);
        }
      },
    });
    // }
  };

  useEffect(() => {
    getFeeLedger({ limitValue: 10, pageValue: 1, filters: [], sort: [] });
  }, []);

  console.log({ colsState: columns });

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
          csv={{
            handler: ExportCSVHandler,
            loading: isCSVLoading,
            error: isCSVError,
          }}
          initialPageSize={10}
          rowClickHandler={(row: any) =>
            router.push(`/fee-ledger/details/${row?.id}`)
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
              console.log({ row });
              router.push(`/fee-ledger/details/${row?.id}`);
            }}
            pagination
            loading={isFeeLedgerListLoading}
            totalItems={FeeLedgerList?.total}
            fetchData={getFeeLedger}
            tableName="payments"
          />
        </div>
      )}
      <ErrorApiText error={isFeeLedgerListError} />
    </>
  );
};

export default PermissionAccess(
  FeeLedger,
  ModulesEnum.withdrawal,
  AccessLevelEnum.read
);
