import React from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { Button } from "@mui/material";

const Account = () => {
  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Account Details</h2>
        </div>

        <div className="detailspage mt-6">
          <div className="flex flex-col gap-4">
            <DetailsWrapper title={"Account Name"}>
              <TransparentInput value={`Alphaspay (PTY) LTD BridgerPay JPP`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Account ID"}>
              <TransparentInput
                value={`1ee5b8b5-fc12-5dbb-9634-9bee0b3df3e5`}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"Company Logo"}>
              <img src="/logo.png" className="max-w-40" alt="Logo" />
            </DetailsWrapper>

            <div className="flex gap-2 justify-center max-w-[75%] mt-6">
              <Button variant="text" className="py-2 px-8" disabled>
                Edit Account Name
              </Button>
              <Button variant="text" className="py-2 px-8" disabled>
                Edit Company Logo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default Account;
