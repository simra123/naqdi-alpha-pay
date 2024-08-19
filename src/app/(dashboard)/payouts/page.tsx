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
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8">Payouts</h3>

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
        />

        <ErrorApiText error={isPayoutsListError} />
      </LoadingApi>
    </>
  );
};

export default Payouts;
