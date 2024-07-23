"use client";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { payoutsList_table_columns } from "./columns";
import { Button } from "@mui/material";
import { Sync } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { Role } from "@/constants/roles";
import { listAdminPayoutsApi, listUserPayoutsApi } from "@/services/payout";
import { generateCSVApi } from "@/services/common";
import LoaderButton from "@/components/common/LoaderButton";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import { formatPayouts } from "@/utils/dataFormatters";

const Payouts = () => {
  const router = useRouter();
  const user = useLocalStorage("user");

  const [payoutsList, setpayoutsList] = useState([]);
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();
  const [isPayoutsListLoading, isPayoutsListError, callPayoutsListApi] =
    useApi(true);

  const getAllPayouts = async () => {
    await callApiHook({
      apiCall: callPayoutsListApi(
        user?.role == Role.USER ? listUserPayoutsApi() : listAdminPayoutsApi()
      ),
      successCallBack: (response: any) => {
        const tableData = formatPayouts(response);
        setpayoutsList(tableData);
      },
    });
  };

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(payoutsList)),
      successCallBack: (response: any) => {
        downloadCSV(response, "payouts.csv");
      },
    });
  };

  useEffect(() => {
    getAllPayouts();
  }, []);
  return (
    <>
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payouts</h2>
          <div className="actions flex gap-3">
            <LoaderButton
              content={<Sync />}
              loading={isPayoutsListLoading}
              onClick={getAllPayouts}
            />
            <LoaderButton
              content={"Export CSV"}
              onClick={ExportCSVHandler}
              loading={isCSVLoading}
            />
            {user?.role == Role.USER && (
              <Button
                variant="text"
                color="primary"
                LinkComponent={Link}
                className="font-semibold"
                href="/payouts/create"
              >
                New Payout
              </Button>
            )}
          </div>
        </div>

        <LoadingApi loading={isPayoutsListLoading}>
          <DataGrid
            rows={payoutsList}
            autoHeight
            columns={payoutsList_table_columns}
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
              router.push(`/payouts/details/${params?.row?.id}`);
            }}
            sortingOrder={["asc", "desc"]}
            pagination
          />
        </LoadingApi>
        <ErrorApiText error={isPayoutsListError} />
      </div>
    </>
  );
};

export default Payouts;
