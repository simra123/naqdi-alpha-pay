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
import { Add } from "@mui/icons-material";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import {
  blockchain_standards,
  standardBlockchain,
} from "@/constants/blockchains";
import PermissionAccess from "@/middleware/PermissionAccess";

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

      console.log(blockchain);

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

  const [withdrawalsList, setwithdrawalsList] = useState([]);
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();
  const [
    isWithdrawalsListLoading,
    isWithdrawalsListError,
    callWithdrawalsListApi,
  ] = useApi({ initailLoading: true });

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

      <ErrorApiText error={isWithdrawalsListError} />
    </>
  );
};

export default PermissionAccess(
  Withdrawals,
  ModulesEnum.withdrawal,
  AccessLevelEnum.read
);
