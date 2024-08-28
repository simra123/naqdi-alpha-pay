"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { withAuth } from "@/middleware/RoleBaseAuth";
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
import Loader from "@/components/common/Loader";
import CreateWithdrawalModal from "@/components/common/CreateWithdrawalModal";
import RenderRoleBased from "@/components/common/RenderRoleBased";

const withdrawalsList_table_columns = [
  { field: "id", headerName: "ID", sortable: true },
  { field: "created_at", headerName: "Created At", sortable: true },
  { field: "updated_at", headerName: "Updated At", sortable: true },
  { field: "requested_amount", headerName: "Requested Amount", sortable: true },
  { field: "withdrawal_type", headerName: "Withdrawal Type", sortable: true },
  { field: "network", headerName: "Network", sortable: true },
  { field: "transaction_hash", headerName: "Transaction Hash", sortable: true },
  {
    field: "recipient_address",
    headerName: "Recipient Address",
    sortable: true,
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

  const [withdrawalsList, setwithdrawalsList] = useState([]);
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();
  const [
    isWithdrawalsListLoading,
    isWithdrawalsListError,
    callWithdrawalsListApi,
  ] = useApi(true);

  const getAllWithdrawals = async () => {
    await callApiHook({
      apiCall: callWithdrawalsListApi(
        user?.role == Role.USER
          ? getUserWithdrawalsListApi()
          : getAdminWithdrawalsListApi()
      ),
      successCallBack: (response: any) => {
        const tableData = formatWithdrawals(response);
        setwithdrawalsList(tableData);
      },
    });
  };

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(withdrawalsList)),
      successCallBack: (response: any) => {
        downloadCSV(response, "withdrawals.csv");
      },
    });
  };

  const toggleCreateModal = () => {
    setIsCreateOpen(!isCreateOpen);
  };

  useEffect(() => {
    getAllWithdrawals();
  }, []);

  return (
    <>
      <CreateWithdrawalModal
        isOpen={isCreateOpen}
        toggleHandler={toggleCreateModal}
        refreshHandler={getAllWithdrawals}
      />

      <div className="flex items-center justify-between mb-8">
        <h3 className="text-h3 font-semibold text-blackGrey-100">
          Withdrawals
        </h3>

        <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
          <LoaderButton
            content={"New Withdrawal"}
            className="px-16"
            variant="contained"
            onClick={toggleCreateModal}
          />
        </RenderRoleBased>
      </div>

      <LoadingApi loading={isWithdrawalsListLoading}>
        <CustomTable
          columns={withdrawalsList_table_columns}
          // Filters={Filters}
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
        />

        <ErrorApiText error={isWithdrawalsListError} />
      </LoadingApi>
    </>
  );
};

export default withAuth(Withdrawals, [Role.ADMIN, Role.USER]);
