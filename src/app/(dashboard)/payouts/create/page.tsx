import React from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { Button } from "@mui/material";

const PayoutDetails = () => {
  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">New Payout</h2>
        </div>

        <div className="detailspage mt-6">
          <div className="flex flex-col gap-4">
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

            <DetailsWrapper title={"Profile"}>
              <TransparentInput value={`Alphaspay`} />
            </DetailsWrapper>

            <DetailsWrapper title={"Notes"}>
              <TransparentInput value={`Hellow`} textarea />
            </DetailsWrapper>

            <div className="flex gap-2 justify-center max-w-[75%] mt-6">
              <Button variant="text" className="py-2 px-8" disabled>
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default PayoutDetails;
