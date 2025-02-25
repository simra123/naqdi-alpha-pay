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

const withdrawalsList_table_columns: TableColumns = [
  { field: "uuid", headerName: "ID", sortable: true },
  { field: "created_at", headerName: "Created At", sortable: true },
  { field: "updated_at", headerName: "Updated At", sortable: true },
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
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(withdrawalsList)),
      successCallBack: (response: any) => {
        downloadCSV(response, "withdrawals.csv");
      },
    });
  };

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

                    console.log({ currentTimeZone });

                    let date: string | string[] = momentTZ(value)
                      .tz(currentTimeZone)
                      .format("DD-MM-YYYY.hh:mm A");

                    console.log({ date });

                    let [day, time] = date.split(".");
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

          setWithdrawalsList(response);
        }
        if (user?.role == Role.ADMIN) {
          const tableData = formatWithdrawals(response);
          setWithdrawalsList(tableData);
        }
      },
    });
    // }
  };

  useEffect(() => {
    getWithdrawals({ limitValue: 10, pageValue: 1, filters: [], sort: [] });
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
          getWithdrawals({
            pageValue: 1,
            filters: [],
            limitValue: 10,
            sort: [],
          });
        }}
      />

      <div className="items-center justify-between mb-8 hidden md:flex">
        <h3 className="text-h3 font-semibold text-blackGrey-100">
          Withdrawals
        </h3>

        <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
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
          csv={{
            handler: ExportCSVHandler,
            loading: isCSVLoading,
            error: isCSVError,
          }}
          initialPageSize={10}
          rowClickHandler={(row: any) =>
            router.push(`/withdrawals/details/${row?.id}`)
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
            rows={withdrawalsList?.result}
            listConfig={listConfig}
            setListConfig={setListConfig}
            selectable={false}
            onRowClick={(row) => {
              console.log({ row });
              router.push(`/withdrawals/details/${row?.id}`);
            }}
            pagination
            loading={isWithdrawalsListLoading}
            totalItems={withdrawalsList?.total}
            fetchData={getWithdrawals}
            tableName="payments"
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
