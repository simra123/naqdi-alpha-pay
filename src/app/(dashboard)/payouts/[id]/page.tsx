import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { webhooks_table_columns } from "../columns";

const PayoutDetails = () => {
  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payments</h2>
        </div>

        <div className="detailspage mt-6">
          <div className="flex flex-col gap-4">
            <DetailsWrapper title={"Date"} align>
              <TransparentInput
                label={`Created At`}
                value={`11 Feb 2024, 19:13:19`}
              />

              <TransparentInput
                label={`Updated At`}
                value={`11 Feb 2024, 19:13:19`}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"ID"} align>
              <TransparentInput
                label={`ID`}
                value={`75a6dce8-56a6-4afa-a1bc-b345b1a74f80
            `}
              />
              <TransparentInput
                label={`Reference`}
                value={`75a6dce8-56a6-4afa-a1bc-b345b1a74f80
            `}
              />
            </DetailsWrapper>

            <DetailsWrapper title={"Gross Amount"}>
              <TransparentInput value={`1 USD`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Fee"}>
              <TransparentInput value={`0.01 USD`} />
            </DetailsWrapper>

            <DetailsWrapper title={"Net Amount "}>
              <TransparentInput value={`0 USD`} />
            </DetailsWrapper>

            <DetailsWrapper title={"To Bank Account "}>
              <TransparentInput value={`News Bank`} />
            </DetailsWrapper>

            <DetailsWrapper title={"Status"}>
              <TransparentInput value={`Pending`} />
            </DetailsWrapper>

            <DetailsWrapper title={"Profile"}>
              <TransparentInput value={`Alphaspay`} />
            </DetailsWrapper>

            <DetailsWrapper title={"Notes"}>
              <TransparentInput value={`Hellow`} textarea />
            </DetailsWrapper>

            {/* TABLES BELOW */}

            <div className="data-grid-container">
              <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Webhooks</h2>
              </div>

              <DataGrid
                rows={[]}
                columns={webhooks_table_columns}
                className="font-semibold primary-color  border-t-0"
                hideFooter
                autoHeight
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default PayoutDetails;
