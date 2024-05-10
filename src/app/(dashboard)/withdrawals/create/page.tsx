import React from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { DataGrid } from "@mui/x-data-grid";

const WithdrawalDetails = () => {
  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">New Withdrawal</h2>
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
            <DetailsWrapper title={"Source Amount"}>
              <TransparentInput value={`2 USDT`} />
            </DetailsWrapper>

            <DetailsWrapper title={"Gross Amount"}>
              <TransparentInput value={`1 USD`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Withdrawal Fee"}>
              <TransparentInput value={`0.01 USD`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Payment"}>
              <TransparentInput value={`1.0001 USD`} label={"Payment Amount"} />
              <TransparentInput
                value={`0 USDT`}
                label={"Payment Amount Received"}
              />
            </DetailsWrapper>

            <DetailsWrapper title={"Net Amount "}>
              <TransparentInput value={`0 USD`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Status"}>
              <TransparentInput value={`Pending`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Wallet Address"}>
              <TransparentInput
                value={`0x0BE060762C1D69f04085646B8e285c3031741`}
                label={"ETH Wallet Address "}
              />
              <TransparentInput value={`Eth`} label={"Network"} />
            </DetailsWrapper>

            <DetailsWrapper title={"Transaction Hash"}>
              <TransparentInput value={`_`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Profile"}>
              <TransparentInput value={`Alphaspay`} />
            </DetailsWrapper>

            <DetailsWrapper title={"Notes"}>
              <TransparentInput value={`Hellow`} textarea />
            </DetailsWrapper>
            <DetailsWrapper title={"Pass Through"}>
              <TransparentInput value={`_`} textarea />
            </DetailsWrapper>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default WithdrawalDetails;
