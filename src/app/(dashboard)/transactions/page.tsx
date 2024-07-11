"use client";

import { Sync } from "@mui/icons-material";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  transactionsList_Admin_table_columns,
  transactionsList_table_columns,
} from "./columns";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { getAllTransactionsApi } from "@/services/transaction";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import SelectBox from "@/components/common/SelectBox";
import moment from "moment";
import { withAuth } from "@/middleware/RoleBaseAuth";
import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import {
  capitalize,
  formatTransactions,
  formatTransactionsByAdmin,
} from "@/utils/dataFormatters";
import { getAllTransactionsByAdminApi } from "@/services/admin/transaction";
import { generateCSVApi } from "@/services/common";
import LoaderButton from "@/components/common/LoaderButton";

const statusList = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirm" },
  { label: "Rejected", value: "reject" },
  { label: "Pending", value: "pending" },
];

const Transactions = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [transactions, setTransactions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isTransactionsLoading, isTransactionsError, callTransactionsApi] =
    useApi(true);
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const getTransactions = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callTransactionsApi(
          getAllTransactionsApi(selectedStatus == "all" ? "" : selectedStatus)
        ),
        successCallBack: (response: any) => {
          const tableData = formatTransactions(response);
          setTransactions(tableData);
        },
      });
    }
    if (user?.role == Role.ADMIN) {
      await callApiHook({
        apiCall: callTransactionsApi(getAllTransactionsByAdminApi()),
        successCallBack: (response: any) => {
          const tableData =
            user?.role == Role.ADMIN
              ? formatTransactionsByAdmin(response)
              : formatTransactions(response);
          setTransactions(tableData);
        },
      });
    }
  };

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(transactions)),
      successCallBack: (response: any) => {
        downloadCSV(response, "transactions.csv");
      },
    });
  };

  const handleChange = (event) => {
    setSelectedStatus(event?.target?.value);
  };

  useEffect(() => {
    getTransactions();
  }, [selectedStatus]);

  return (
    <>
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Transactions</h2>
          <div className="actions grid grid-flow-col gap-3">
            <LoaderButton
              onClick={getTransactions}
              loading={isTransactionsLoading}
              content={<Sync />}
            />
            <LoaderButton
              content={"Export CSV"}
              onClick={ExportCSVHandler}
              loading={isCSVLoading}
            />
            {/* <SelectBox
              className="transparent !border-0 min-w-32 !p-0"
              options={statusList}
              value={selectedStatus}
              placeholder="Status"
              onChange={handleChange}
              sx={{
                ".MuiSelect-outlined": {
                  padding: "8px 12px !important",
                },

                borderRadius: "0 !important",
              }}
            /> */}
          </div>
        </div>
        <ErrorApiText error={isTransactionsError} />

        <LoadingApi loading={isTransactionsLoading}>
          <DataGrid
            autoHeight
            rows={transactions}
            columns={
              user?.role == Role.ADMIN
                ? transactionsList_Admin_table_columns
                : transactionsList_table_columns
            }
            className="border-t-0 primary-color"
            sx={{
              ".MuiDataGrid-overlayWrapper": {
                padding: "25px",
              },
              ".MuiDataGrid-overlayWrapperInner": {
                height: "10px !important",
              },
            }}
            onRowClick={(params) => {
              router.push(`/transactions/details/${params?.row?.id}`);
            }}
            sortingOrder={["asc", "desc"]}
            pagination
          />
        </LoadingApi>
      </div>
    </>
  );
};

export default Transactions;
