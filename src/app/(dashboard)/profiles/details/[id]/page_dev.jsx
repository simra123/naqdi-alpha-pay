"use client";
import React, { useState } from "react";

import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import Details from "@/components/common/Details";
import { LabelRadioButton } from "@/components/common/RadioButton";
import {MdEmail} from "react-icons/md"

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
    <div className="flex flex-col bg-white shadow-sm p-6 rounded-medium">
      <h3 className="font-semibold text-blackGrey-100 text-h3.5">
        Profile Details
      </h3>

      <LoadingApi loading={false}>
        <div className="res-4-grid mt-4 py-6 border-b border-light-gray">
          <Details Icon={MdEmail} label="Profile ID" value={payout?.id} />
          <Details
            Icon={MdEmail}
            label="Profile Name"
            value={payout?.profileName}
          />
          <Details Icon={MdEmail} label="Webhook URL" value={payout?.webhookURL} />
          <Details Icon={MdEmail} label="Webhook URL" value={payout?.email} />
        </div>

        <h4 className="my-8 font-semibold text-button">Profile Settings</h4>

        <div className="flex flex-wrap gap-x-24 gap-y-8">
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
            <span className="text-black-100 text-button">
              Currency Configuration
            </span>
            <table>
              <thead>
                <tr>
                  <th className="pr-8 font-medium text-gray-600">Currency</th>
                  <th className="px-8 font-medium text-gray-600">
                    Markup Profit %
                  </th>
                </tr>
              </thead>
              <tbody>
                {checkedState.map((checked, index) => (
                  <tr key={index}>
                    <td className="">
                      <div className="relative flex items-center">
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

        <div className="flex flex-wrap items-center gap-4 mt-20">
          <button className="bg-red-button py-3 border-0 rounded-medium w-56 text-white text-center">
            Delete
          </button>
          <button className="bg-green-button py-3 border-0 rounded-medium w-56 text-white text-center">
            Edit
          </button>
        </div>

        <ErrorApiText error={false} />
      </LoadingApi>
    </div>
  );
};

export default ProfileDetails;
