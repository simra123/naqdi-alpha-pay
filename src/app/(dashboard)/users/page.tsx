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
import { withAuth } from "@/middleware/RoleBaseAuth";
import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import RenderRoleBased from "@/components/common/RenderRoleBased";

const statusList = [
  { label: "All", value: "all" },
  { label: "Verified", value: "verified" },
  { label: "Unverified", value: "unverified" },
];

const Users = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isUsersLoading, isUsersError, callUsersApi] = useApi(true);

  const getTransactions = async () => {};

  const handleChange = (event) => {
    setSelectedStatus(event?.target?.value);
  };

  return (
    <>
      <div className="data-grid-container">
        <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Users</h2>
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
        <ErrorApiText error={isUsersError} />

        <DataGrid
          autoHeight
          rows={users}
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
            router.push(`/users/details/${params?.row?.id}`);
          }}
          sortingOrder={["asc", "desc"]}
          pagination
        />
      </div>
    </>
  );
};

export default Users;
