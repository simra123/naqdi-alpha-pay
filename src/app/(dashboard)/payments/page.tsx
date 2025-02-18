"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import {
  getAllPaymentsByAdminApi,
  getClientPaymentsListApi,
} from "@/services/payments";
import useLocalStorage from "@/hooks/useLocalStorage";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { generateCSVApi } from "@/services/common";
import Chip from "@/components/common/Chip";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import PermissionAccess from "@/middleware/PermissionAccess";
import AdvancedTable from "@/components/common/AdvancedTable";
import { ListApiResponse } from "@/components/common/AdvancedTable/types";
import {
  replaceColumns,
  updateColumnSortState,
  updateFilterState,
} from "@/components/common/AdvancedTable/utils";

const Payments = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [paymentsList, setPaymentsList] = useState<ListApiResponse>(null);
  const [columns, setColumns] = useState([]);
  const [listConfig, setListConfig] = useState(null);
  const [sortData, setSortData] = useState<[] | any>([]);
  const [filtersData, setFilterData] = useState<[] | any>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi({
    initailLoading: true,
  });
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

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
              ["created_at", "updated_at"].includes(column.listColumnsMeta.name)
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
      },
    });
    // }
  };

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(paymentsList?.result)),
      successCallBack: (response: any) => {
        downloadCSV(response, "payments.csv");
      },
    });
  };

  useEffect(() => {
    getPayments({ limitValue: limit, pageValue: page });
  }, []);

  console.log({ colsState: columns });

  return (
    <>
      <h3
        className="text-h3 font-semibold text-blackGrey-100 mb-8 md:block hidden"
        ref={tableContainerRef}
      >
        Payments
      </h3>

      {/* Table Actions Below */}

      <div>
        <AdvancedTable
          columns={columns}
          setColumns={setColumns}
          rows={paymentsList?.result}
          listConfig={listConfig}
          selectable={false}
          pagination
          loading={isPaymentLoading}
          totalItems={paymentsList?.total}
          currentPage={page}
          limit={limit}
          sortData={sortData}
          filtersData={filtersData}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          onSearch={(column, event) => {
            const { value, type } = event.target;

            // Update the filter state
            let filteredColsData = updateFilterState(
              column,
              [value],
              filtersData,
              type == "date" ? "GREATER_THAN" : "CONTAINS"
            );

            setFilterData(filteredColsData);
            if (type == "date") {
              getPayments({
                sort: sortData,
                filters: filteredColsData,
                limitValue: limit,
                pageValue: 1,
              });
            }
            console.log(column, value, filteredColsData);
          }}
          onSearchKeyDown={(event) => {
            console.log(event.key);
            if (event.key == "Enter") {
              getPayments({
                sort: sortData,
                filters: filtersData,
                limitValue: limit,
                pageValue: 1,
              });
            }
          }}
          onSort={(sortValues) => {
            const colsToSort = updateColumnSortState(sortValues, sortData);
            setSortData(colsToSort);
            console.log({ colsToSort });
            getPayments({
              sort: colsToSort,
              filters: filtersData,
              limitValue: limit,
              pageValue: page,
            });
          }}
          onPageChange={(page) => {
            setPage(page);
            getPayments({
              sort: sortData,
              filters: filtersData,
              limitValue: limit,
              pageValue: page,
            });
            scrollToTop();
          }}
          onLimitChange={(limit) => {
            setLimit(limit);
            setPage(1);
            getPayments({
              sort: sortData,
              filters: filtersData,
              limitValue: limit,
              pageValue: 1,
            });

            scrollToTop();
          }}
          onFiltersApply={(filtersData) => {
            console.log({ filtersData });
            setFilterData(filtersData);
            getPayments({
              pageValue: page,
              filters: filtersData,
              limitValue: limit,
              sort: sortData,
            });
            setFilterOpen(false);
          }}
          onViewsApply={(viewData) => {
            console.log({ viewData });
            setColumns(viewData);
            let newConfig = replaceColumns(listConfig, viewData);
            setListConfig(newConfig);
            setFilterOpen(false);
          }}
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
