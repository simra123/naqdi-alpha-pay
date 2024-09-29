"use client";
import React, { useState } from "react";

import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import Details from "@/components/common/Details";
import { Mail } from "@mui/icons-material";
import { LabelRadioButton } from "@/components/common/RadioButton";
import Checkbox from "@/components/common/CheckBox";

const ProfileDetails = ({ params }) => {
  const profileId = params?.id;
  const [emailNotifications, setEmailNotifications] = useState("yes");

  const handleEmailNotificationChange = (value) => {
    setEmailNotifications(value);
  };

  const [checkedState, setCheckedState] = useState([true, true, true, true]);

  const handleCheckboxChange = (index) => {
    const updatedCheckedState = checkedState.map((item, i) =>
      i === index ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const payout = {
    id: 1,
    profileName: "Alphaspay",
    webhookURL: " www.webhook.com",
    email: " aw708596@gmail.com",
  };

  return (
    <div className="rounded-medium flex flex-col  bg-white p-6 shadow-sm">
      <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
        Profile Details
      </h3>

      <LoadingApi loading={false}>
        <div className="res-4-grid py-6 mt-4 border-b border-light-gray">
          <Details Icon={Mail} label="Profile ID" value={payout?.id} />
          <Details
            Icon={Mail}
            label="Profile Name"
            value={payout?.profileName}
          />
          <Details Icon={Mail} label="Webhook URL" value={payout?.webhookURL} />
          <Details Icon={Mail} label="Webhook URL" value={payout?.email} />
        </div>

        <h4 className="text-button font-semibold my-8">Profile Settings</h4>

        <div className="flex gap-x-24 gap-y-8 flex-wrap">
          <LabelRadioButton
            label={"Send Email Notifications"}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            selectedOption={emailNotifications}
            handleChange={handleEmailNotificationChange}
          />

          <div className="flex flex-wrap gap-x-12 gap-y-3">
            <span className="text-button text-black-100">
              Currency Configuration
            </span>
            <table>
              <thead>
                <tr>
                  <th className="pr-8 text-gray-600 font-medium">Currency</th>
                  <th className="px-8  text-gray-600 font-medium">
                    Markup Profit %
                  </th>
                </tr>
              </thead>
              <tbody>
                {checkedState.map((checked, index) => (
                  <tr key={index}>
                    <td className="">
                      <div className="flex items-center relative">
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleCheckboxChange(index)}
                          />
                          <span className="checkmark"></span>
                          <span className="ml-8 text-[18px]">BTC</span>
                        </label>
                      </div>
                    </td>
                    <td className="py-2 text-gray-700 text-center">1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-4 items-center mt-20 flex-wrap">
          <button className="border-0 py-3 text-center text-white bg-red-button rounded-medium w-56 ">
            Delete
          </button>
          <button className="border-0 py-3 text-center text-white bg-green-button rounded-medium w-56 ">
            Edit
          </button>
        </div>

        <ErrorApiText error={false} />
      </LoadingApi>
    </div>
  );
};

export default ProfileDetails;
