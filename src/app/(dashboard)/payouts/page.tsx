"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorageValue } from "@/utils/cookies";
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
import CreatePayoutModal from "@/components/Modals/CreatePayoutModal";
import RenderRoleBased from "@/components/common/RenderRoleBased";
const payoutsList_table_columns = [
  { field: "uuid", headerName: "ID", sortable: true },
  { field: "created_at", headerName: "Date", sortable: true },
  { field: "from_currency", headerName: "From Currency", sortable: true },
  { field: "to_currency", headerName: "To Currency", sortable: true },
  { field: "requested_amount", headerName: "Requested Amount", sortable: true },
  { field: "account_title", headerName: "Account Title", sortable: true },
  { field: "account_number", headerName: "Account Number", sortable: true },
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
  const user = getLocalStorageValue("user");

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [payoutsList, setpayoutsList] = useState([]);
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();
  const [isPayoutsListLoading, isPayoutsListError, callPayoutsListApi] =
    useApi({initailLoading:true});

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
      <div className="hidden md:flex justify-between items-center mb-8">
        <h3 className="font-semibold text-blackGrey-100 text-h3">Payouts</h3>

        <LoaderButton
          content={"New Payout"}
          className="px-16"
          variant="contained"
          onClick={toggleCreateModal}
        />
      </div>

      <CustomTable
        loading={isPayoutsListLoading}
        columns={payoutsList_table_columns}
        // Filters={Filters}
        createHandler={toggleCreateModal}
        rows={payoutsList}
        csv={true}
        tableName="payouts"
        initialPageSize={10}
        rowClickHandler={(row: any) =>
          router.push(`/payouts/details/${row?.id}`)
        }
        pagination
      />

      <ErrorApiText error={isPayoutsListError} />
    </>
  );
};

export default Payouts;
