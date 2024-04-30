"use client";

import { Sync } from "@mui/icons-material";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { transactionsList_table_columns } from "./columns";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { getAllTransactionsApi } from "@/services/transaction";
import { callApiHook } from "@/utils/apifuncs";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import SelectBox from "@/components/common/SelectBox";
import moment from "moment";

const statusList = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirm" },
  { label: "Rejected", value: "reject" },
  { label: "Pending", value: "pending" },
];

const Transactions = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isTransactionsLoading, isTransactionsError, callTransactionsApi] =
    useApi(true);

  const getTransactions = async () => {
    await callApiHook({
      apiCall: callTransactionsApi(
        getAllTransactionsApi(selectedStatus == "all" ? "" : selectedStatus)
      ),
      successCallBack: (response: any) => {
        const tableData = response?.map((item: any) => ({
          id: item?.id,
          dateReceived: moment(item?.createdAt).format("DD-MM-YYYY"),
          transactionHash: item?.transaction_hash,
          amount: `${item?.amount} ${item?.unit}`,
          network: capitalize(item?.wallet?.network),
          blockchain: capitalize(item?.wallet?.blockchain),
          status: item?.status,
        }));
        setTransactions(tableData);
      },
    });
  };

  const capitalize = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
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
            <Button
              variant="outlined"
              color="primary"
              onClick={getTransactions}
            >
              <Sync />
            </Button>
            <Button variant="outlined" color="primary">
              Export CSV
            </Button>
            <SelectBox
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
            />
          </div>
        </div>
        <ErrorApiText error={isTransactionsError} />
        <LoadingApi loading={isTransactionsLoading}>
          <DataGrid
            autoHeight
            rows={transactions}
            columns={transactionsList_table_columns}
            className="border-t-0 primary-color font-semibold"
            sx={{
              ".MuiDataGrid-overlayWrapper": {
                padding: "25px",
              },
              ".MuiDataGrid-overlayWrapperInner": {
                height: "10px !important",
              },
            }}
            onRowClick={(params) => {
              console.log(params);
              router.push(`/transactions/${params?.row?.id}`);
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
