"use client";
import React from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import RadioButton from "@/components/common/RadioButton";
import { Button } from "@mui/material";

const UserDetails = ({ params }) => {
  const userID = params?.id;

  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">User Details</h2>
        </div>

        <div className="detailspage mt-6">
          <div className="flex flex-col gap-4">
            <DetailsWrapper title={"User ID"}>
              <TransparentInput value={userID} />
            </DetailsWrapper>
            <DetailsWrapper title={"First Name"}>
              <TransparentInput value={`Alphaspay`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Last Name"}>
              <TransparentInput value={`Alphaspay`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Email"} align>
              <TransparentInput
                value={`Alphaspay@alphaspay.com`}
                label="Email address of the user you would like to invite.
"
              />
            </DetailsWrapper>
            <DetailsWrapper title={"Status"}>
              <TransparentInput value={`Accepted`} />
            </DetailsWrapper>
            <div className="mt-2"></div>
            <DetailsWrapper title={"Permissions"} col>
              <div className="flex flex-col gap-4 w-[560px] font-bold text-[13px]">
                <div className="flex gap-3 items-center justify-between border-b pb-4">
                  <span className="w-[26%]">Api Keys</span>

                  <RadioButton
                    label={"None"}
                    name={"apikeys"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Read-only"}
                    name={"apikeys"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Full Access"}
                    name={"apikeys"}
                    onChange={() => {}}
                  />
                </div>
                <div className="flex gap-3 items-center justify-between border-b pb-4">
                  <span className="w-[26%]">Payments</span>

                  <RadioButton
                    label={"None"}
                    name={"payments"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Read-only"}
                    name={"payments"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Full Access"}
                    name={"payments"}
                    onChange={() => {}}
                  />
                </div>
                <div className="flex gap-3 items-center justify-between border-b pb-4">
                  <span className="w-[26%]">Payouts</span>

                  <RadioButton
                    label={"None"}
                    name={"payouts"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Read-only"}
                    name={"payouts"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Full Access"}
                    name={"payouts"}
                    onChange={() => {}}
                  />
                </div>
                <div className="flex gap-3 items-center justify-between border-b pb-4">
                  <span className="w-[26%]">Profiles</span>

                  <RadioButton
                    label={"None"}
                    name={"profiles"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Read-only"}
                    name={"profiles"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Full Access"}
                    name={"profiles"}
                    onChange={() => {}}
                  />
                </div>
                <div className="flex gap-3 items-center justify-between border-b pb-4">
                  <span className="w-[26%]">Settings</span>

                  <RadioButton
                    label={"None"}
                    name={"settings"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Read-only"}
                    name={"settings"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Full Access"}
                    name={"settings"}
                    onChange={() => {}}
                  />
                </div>
                <div className="flex gap-3 items-center justify-between border-b pb-4">
                  <span className="w-[26%]">Transactions</span>

                  <RadioButton
                    label={"None"}
                    name={"transactions"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Read-only"}
                    name={"transactions"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Full Access"}
                    name={"transactions"}
                    onChange={() => {}}
                  />
                </div>
                <div className="flex gap-3 items-center justify-between border-b pb-4">
                  <span className="w-[26%]">Users</span>

                  <RadioButton
                    label={"None"}
                    name={"users"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Read-only"}
                    name={"users"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Full Access"}
                    name={"users"}
                    onChange={() => {}}
                  />
                </div>
                <div className="flex gap-3 items-center justify-between border-b pb-4">
                  <span className="w-[26%]">Withdrawals</span>

                  <RadioButton
                    label={"None"}
                    name={"withdrawals"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Read-only"}
                    name={"withdrawals"}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label={"Full Access"}
                    name={"withdrawals"}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </DetailsWrapper>

            <div className="flex gap-2 justify-center max-w-[75%] mt-6">
              <Button variant="text" className="py-2 px-8" disabled>
                Edit
              </Button>
              <Button variant="outlined" className="py-2 px-8">
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default UserDetails;
