"use client";
import React, { useEffect, useRef, useState } from "react";
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
  updateColumnSortState,
  updateFilterState,
} from "@/components/common/AdvancedTable/utils";

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
    id: 2,
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    sticky: true,
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
    // sticky: true,
  },
  {
    field: "requestedPaymentAmount",
    headerName: "Requested Payment Amount",
    id: 6,
    // sticky: true,
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
  const [paymentsList, setPaymentsList] = useState<ListApiResponse>(null);
  const [sortData, setSortData] = useState<[] | any>([]);
  const [filtersData, setFilterData] = useState<[] | any>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
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
                dataValidator: (value: string) =>
                  moment(value).format("DD-MM-YYYY : HH:MM:A"),
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
          columns={paymentsList?.listConfig?.views[0]?.columns}
          rows={paymentsList?.result}
          listConfig={paymentsList?.listConfig}
          selectable={false}
          pagination
          loading={isPaymentLoading}
          totalItems={paymentsList?.total}
          currentPage={page}
          limit={limit}
          sortData={sortData}
          filtersData={filtersData}
          onSearch={(column, event) => {
            const { value } = event.target;

            // Update the filter state
            let filteredColsData = updateFilterState(
              column,
              [value],
              filtersData
            );

            setFilterData(filteredColsData);
            console.log(column, value, filteredColsData);
          }}
          onSearchKeyDown={(event) => {
            console.log(event.key);
            if (event.key == "Enter") {
              getPayments({
                sort: sortData,
                filters: filtersData,
                limitValue: limit,
                pageValue: page,
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
              pageValue: page,
            });

            scrollToTop();
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
