import React from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";

const TransactionDetails = () => {
  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Transaction Details</h2>
        </div>
        <div className="detailspage mt-6">
          <div className="flex flex-col gap-4">
            <DetailsWrapper title={"Date Received"}>
              <TransparentInput value={"10 Feb 2024, 16:34:23"} />
            </DetailsWrapper>
            <DetailsWrapper title={"Related Payment"}>
              <TransparentInput
                value={"3b83bd15-db1b-43a7-97f0-c0e0966398b5"}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"Transaction Hash"}>
              <TransparentInput
                value={
                  "5d668fbc369068dd600dedb930d899972ca25cb66ba6dbbecfd0af…"
                }
              />
            </DetailsWrapper>
            <DetailsWrapper title={"Amount"}>
              <TransparentInput value={"102 USDT"} />
            </DetailsWrapper>
            <DetailsWrapper title={"Source Wallet Address"}>
              <TransparentInput value={"TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS"} />
            </DetailsWrapper>
            <DetailsWrapper title={"Payment Address"}>
              <TransparentInput value={"TThVPD9h54oJHZoLthMU2dMnZdPC6oKjfG"} />
            </DetailsWrapper>
            <DetailsWrapper title={"Network"}>
              <TransparentInput value={"TRX"} />
            </DetailsWrapper>
            <DetailsWrapper title={"Confirmed"}>
              <TransparentInput value={"Yes"} />
            </DetailsWrapper>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default TransactionDetails;
