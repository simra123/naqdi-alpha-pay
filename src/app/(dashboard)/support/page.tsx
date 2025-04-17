"use client";

import React, { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";

import Chip from "@/components/common/Chip";
import CustomTable from "@/components/common/CustomTable";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoaderButton from "@/components/common/LoaderButton";
import LoadingApi from "@/components/common/LoadindApi";

import { useApi } from "@/hooks/useApi";
import { TicketsListApi } from "@/services/support";
import { callApiHook } from "@/utils/apifuncs";
import moment from "moment";
import { Role } from "@/constants/roles";

const supportList_columns = [
  {
    field: "id",
    headerName: "ID",
    sortable: true,
  },
  {
    field: "date",
    headerName: "Date",
    sortable: true,
  },
  {
    field: "subject",
    headerName: "Subject",
    sortable: true,
  },
  {
    field: "serviceType",
    headerName: "Service Type",
    sortable: true,
  },
  {
    field: "updatedAt",
    headerName: "Last Updated",
    sortable: true,
  },
  {
    field: "status",
    headerName: "Status",
    sortable: true,
    dataValidator: (value) => {
      return <Chip status={value} />;
    },
  },
];

const getStatusfromNumber = (statusNo: number) => {
  const status = {
    2: "Open",
    3: "Pending",
    4: "Resolved",
    5: "Closed",
  };
  return status[statusNo];
};

const Support = () => {
  const router = useRouter();
  const [ticketsList, setTicketsList] = useState([]);

  const [isListLoading, isListError, callListApi] = useApi({
    initailLoading: true,
  });

  notFound();

  const getListHandler = async () => {
    await callApiHook({
      apiCall: callListApi(TicketsListApi()),
      successCallBack: (response: any) => {
        const tableData = response.map((item) => {
          return {
            id: item?.id,
            date: moment(item?.created_at).format("DD-MM-YYYY : hh:mm A"),
            updatedAt: moment(item?.updated_at).format("DD-MM-YYYY : hh:mm A"),
            subject: item?.subject,
            serviceType: item?.type,
            requestedPaymentAmount: `${item?.requested_amount} ${item?.requested_currency}`,
            status: getStatusfromNumber(item?.status),
          };
        });
        setTicketsList(tableData);
      },
    });
  };

  useEffect(() => {
    getListHandler();
  }, []);

  return (
    <>
      <div className="hidden md:flex justify-between items-center mb-8">
        <h3 className="font-semibold text-blackGrey-100 text-h3">Support</h3>
        <LoaderButton
          content={"New Ticket"}
          className="px-16"
          variant="contained"
          onClick={() => router.push("/support/create")}
        />
      </div>

      {/* Table Actions Below */}
      <div>
        <CustomTable
          loading={isListLoading}
          columns={supportList_columns}
          rows={ticketsList}
          createHandler={() => router.push("/support/create")}
          initialPageSize={10}
          pagination
        />

        <ErrorApiText error={isListError} />
      </div>
    </>
  );
};

export default Support;
