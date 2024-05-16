import React from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";

const TransactionDetails = () => {
  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">User Details</h2>
        </div>
        <div className="detailspage mt-6">
          <div className="flex flex-col gap-4">
            <DetailsWrapper title={"Date Created"}>
              <TransparentInput value={"10 Feb 2024, 16:34:23"} />
            </DetailsWrapper>
            <DetailsWrapper title={"ID"}>
              <TransparentInput
                value={"3b83bd15-db1b-43a7-97f0-c0e0966398b5"}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"Username"}>
              <TransparentInput value={"Crypto"} />
            </DetailsWrapper>

            <DetailsWrapper title={"Status"}>
              <TransparentInput value={"Verified"} />
            </DetailsWrapper>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default TransactionDetails;
