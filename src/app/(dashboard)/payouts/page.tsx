"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { Role } from "@/constants/roles";
import { listAdminPayoutsApi, listUserPayoutsApi } from "@/services/payout";
import { generateCSVApi } from "@/services/common";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import { formatPayouts } from "@/utils/dataFormatters";
import Chip from "@/components/common/Chip";
import CustomTable from "@/components/common/CustomTable";
import LoaderButton from "@/components/common/LoaderButton";
import CreatePayoutModal from "@/components/common/CreatePayoutModal";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import { Add } from "@mui/icons-material";

const payoutsList_table_columns = [
  { field: "id", headerName: "ID", sortable: true },
  { field: "created_at", headerName: "Date", sortable: true },
  { field: "from_currency", headerName: "From Currency", sortable: true },
  { field: "to_currency", headerName: "To Currency", sortable: true },
  { field: "requested_amount", headerName: "Requested Amount", sortable: true },
  { field: "account_title", headerName: "Account Title", sortable: true },
  {
    field: "status",
    headerName: "Status",
    sortable: true,
    dataValidator: (value) => {
      return <Chip status={value} />;
    },
  },
];

const Payouts = () => {
  const router = useRouter();
  const user = useLocalStorage("user");

  const [isCreateOpen, setIsCreateOpen] = useState(false);

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

  const toggleCreateModal = () => {
    setIsCreateOpen(!isCreateOpen);
  };

  useEffect(() => {
    getAllPayouts();
  }, []);
  return (
    <>
      <CreatePayoutModal
        isOpen={isCreateOpen}
        toggleHandler={toggleCreateModal}
        refreshHandler={getAllPayouts}
      />
      <div className="items-center justify-between mb-8  hidden md:flex">
        <h3 className="text-h3 font-semibold text-blackGrey-100">Payouts</h3>

        <LoaderButton
          content={"New Payout"}
          className="px-16"
          variant="contained"
          onClick={toggleCreateModal}
        />
      </div>

      <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
        <LoaderButton
          content={<Add className="!text-h2" />}
          className="!p-1 !rounded-full !w-fit absolute right-4 bottom-12 md:hidden"
          variant="contained"
          onClick={toggleCreateModal}
        />
      </RenderRoleBased>

      <LoadingApi loading={isPayoutsListLoading}>
        <CustomTable
          columns={payoutsList_table_columns}
          // Filters={Filters}
          rows={payoutsList}
          csv={{
            handler: ExportCSVHandler,
            loading: isCSVLoading,
            error: isCSVError,
          }}
          initialPageSize={10}
          rowClickHandler={(row: any) =>
            router.push(`/payouts/details/${row?.id}`)
          }
          pagination
        />

        <ErrorApiText error={isPayoutsListError} />
      </LoadingApi>
    </>
  );
};

export default Payouts;
