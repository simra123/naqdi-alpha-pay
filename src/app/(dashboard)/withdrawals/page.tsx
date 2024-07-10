"use client";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { withdrawalsList_table_columns } from "./columns";
import { Button } from "@mui/material";
import { Sync } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { withAuth } from "@/middleware/RoleBaseAuth";
import { Role } from "@/constants/roles";
import Link from "next/link";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getWithdrawalsListApi } from "@/services/withdrawal";
import { formatWithdrawals } from "@/utils/dataFormatters";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import LoaderButton from "@/components/common/LoaderButton";



const Withdrawals = () => {
  const router = useRouter();
  const user = useLocalStorage("user");

  const [withdrawalsList, setwithdrawalsList] = useState([]);
  const [
    isWithdrawalsListLoading,
    isWithdrawalsListError,
    callWithdrawalsListApi,
  ] = useApi(true);

  const getAllWithdrawals = async () => {
    await callApiHook({
      apiCall: callWithdrawalsListApi(getWithdrawalsListApi()),
      successCallBack: (response: any) => {
        const tableData = formatWithdrawals(response);
        setwithdrawalsList(tableData);
      },
    });
  };

  useEffect(() => {
    getAllWithdrawals();
  }, []);

  return (
    <>
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Withdrawals</h2>
          <div className="actions flex gap-3">
            <LoaderButton
              content={<Sync />}
              loading={isWithdrawalsListLoading}
              onClick={getAllWithdrawals}
            />
            <Button variant="outlined" color="primary">
              Export CSV
            </Button>
            {user?.role == Role.USER && (
              <Button
                variant="text"
                color="primary"
                LinkComponent={Link}
                className="font-semibold"
                href="/withdrawals/create"
              >
                New Withdrawal
              </Button>
            )}
          </div>
        </div>

        <LoadingApi loading={isWithdrawalsListLoading}>
          <DataGrid
            rows={withdrawalsList}
            columns={withdrawalsList_table_columns}
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
              router.push(`/withdrawals/details/${params?.row?.id}`);
            }}
            sortingOrder={["asc", "desc"]}
            pagination
            autoHeight
          />
        </LoadingApi>

        <ErrorApiText error={isWithdrawalsListError} />
      </div>
    </>
  );
};

export default withAuth(Withdrawals, [Role.ADMIN, Role.USER]);
