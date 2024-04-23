"use client";
import React from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import RadioButton from "@/components/common/RadioButton";
import CheckboxWithInput from "@/components/common/CheckBoxWithInput";
import { Button } from "@mui/material";

const ProfileDetails = ({ params }) => {
  const profileId = params?.id;

  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Profile Details</h2>
        </div>

        <div className="detailspage mt-6">
          <div className="flex flex-col gap-4">
            <DetailsWrapper title={"Profile ID"}>
              <TransparentInput value={profileId} />
            </DetailsWrapper>
            <DetailsWrapper title={"Profile Name"} align>
              <TransparentInput
                label={`For internal use. Name profile for your own recognition.`}
                value={`Alphaspay`}
              />
            </DetailsWrapper>

            <DetailsWrapper title={"Webhook URL"} align>
              <TransparentInput
                value={`www.webhook.com`}
                label={"Optional. URL for payment notifications."}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"Send Email Notifications"}>
              <div className="flex gap-12">
                <RadioButton
                  value={"true"}
                  name="notification"
                  onChange={() => {}}
                  label={`Yes`}
                  selctedValue={"false"}
                />
                <RadioButton
                  value={"false"}
                  name="notification"
                  onChange={() => {}}
                  label={`No`}
                  selctedValue={"false"}
                />
              </div>
            </DetailsWrapper>

            <DetailsWrapper title={"Notification Emails"}>
              <TransparentInput
                value={`aw7086@gmail.com, ahmed@alphaspay.com, ahmed@example.com`}
                label={
                  "Email addresses for notifications. Specify multiple emails separated by a comma."
                }
              />
            </DetailsWrapper>

            <DetailsWrapper title={"Currency Confiuration"} col>
              <div className="flex">
                <span className="text-[12px] font-semibold min-w-24  text-gray-500">
                  Currency
                </span>
                <span className="text-[12px] font-semibold  text-gray-500">
                  Markup Profit %
                </span>
              </div>
              <CheckboxWithInput label={"BTC"} />
              <CheckboxWithInput label={"ETH"} />
              <CheckboxWithInput label={"USDT"} />
              <CheckboxWithInput label={"USDC"} />
            </DetailsWrapper>

            <div className="flex gap-2 justify-center max-w-[75%] mt-6">
              <Button variant="text" className="py-2 px-8" disabled>Edit</Button>
              <Button variant="outlined" className="py-2 px-8">Delete</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default ProfileDetails;
