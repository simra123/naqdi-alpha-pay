"use client";
import React, { useState } from "react";

import Details from "@/components/common/Details";
import { Mail } from "@mui/icons-material";

const permissionsList = [
  "Integrations",
  "Payments",
  "Payouts",
  "Users",
  "Withdrawals",
];

const UserDetails = ({ params }) => {
  const userID = params?.id;
  const [permissions, setPermissions] = useState({
    integrations: "none",
    payments: "none",
    payouts: "none",
    users: "none",
    withdrawals: "none",
  });

  const handleChange = (permission, value) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: value,
    }));
  };

  const renderRadioButton = (permission, value, label) => (
    <label className="custom-radio">
      <input
        type="radio"
        name={permission}
        value={value}
        checked={permissions[permission] === value}
        onChange={() => handleChange(permission, value)}
      />
      <span className="radio-label">{label}</span>
    </label>
  );

  return (
    <div className="rounded-medium flex flex-col  bg-white p-10">
      <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
        User Details
      </h3>

      <div className="res-4-grid py-6 mt-4 border-light-gray border-b-2">
        <Details Icon={Mail} label="Profile ID" value={"1"} />
        <Details Icon={Mail} label="First Name" value={"Muhammad"} />
        <Details Icon={Mail} label="Last Name" value={"Ahmed"} />
        <Details Icon={Mail} label="Email" value={"aw708596@gmail.com"} />
        <Details Icon={Mail} label="Status" value={"Accepted"} />
      </div>

      <div className="grid grid-cols-4 gap-4 mt-8 mb-6">
        <div className="font-semibold text-button text-black-100">
          Permissions
        </div>
      </div>
      {permissionsList.map((permission, index) => (
        <div
          className="grid grid-cols-5 gap-4 items-center py-5 border-light-gray border-b"
          key={index}
        >
          <div className="col-span-2 text-button text-black-100">
            {permission}
          </div>
          <div className="col-span-1 text-center">
            {renderRadioButton(permission.toLowerCase(), "none", "None")}
          </div>
          <div className="col-span-1 text-center">
            {renderRadioButton(
              permission.toLowerCase(),
              "read-only",
              "Read-only"
            )}
          </div>
          <div className="col-span-1 text-center">
            {renderRadioButton(
              permission.toLowerCase(),
              "full-access",
              "Full Access"
            )}
          </div>
        </div>
      ))}

      <div className="flex gap-4 items-center mt-20 flex-wrap">
        <button className="border-0 py-3 text-center text-white bg-red-button rounded-medium w-56 ">
          Delete
        </button>
        <button className="border-0 py-3 text-center text-white bg-green-button rounded-medium w-56 ">
          Edit
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
