"use client";

import CustomTable from "@/components/common/CustomTable";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoaderButton from "@/components/common/LoaderButton";
import LoadingApi from "@/components/common/LoadindApi";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";

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
  },
];

const Support = () => {
  const router = useRouter();
  return (
    <>
      <div className="items-center justify-between mb-8  hidden md:flex">
        <h3 className="text-h3 font-semibold text-blackGrey-100">
          Support
        </h3>
        <LoaderButton
          content={"New Ticket"}
          className="px-16"
          variant="contained"
          onClick={() => router.push("/support/create")}
        />
      </div>

      <LoaderButton
        content={<Add className="!text-h2" />}
        className="!p-1 !rounded-full !w-fit absolute right-4 bottom-12 md:hidden"
        variant="contained"
        onClick={() => router.push("/support/create")}
      />

      {/* Table Actions Below */}
      <div>
        <LoadingApi loading={false}>
          <CustomTable
            columns={supportList_columns}
            rows={[]}
            initialPageSize={10}
            rowClickHandler={(row: any) => console.log(row)}
            pagination
          />
        </LoadingApi>
        <ErrorApiText error={false} />
      </div>
    </>
  );
};

export default Support;
