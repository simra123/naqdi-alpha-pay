"use client";

import { FolderIcon, StatusIcon } from "@/assets/Svgs";
import ChangePasswordModal from "@/components/common/ChangePasswordModal";
import Details from "@/components/common/Details";
import LoaderButton from "@/components/common/LoaderButton";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import {
  CalendarMonth,
  ContactMail,
  ContactMailOutlined,
  Contacts,
  ContactSupport,
  LocationOnOutlined,
  Mail,
  Payment,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const Account = () => {
  const user = useSelector((state: any) => state?.user?.data?.userDetails);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

  const changePasswordModalToggler = () => {
    setChangePasswordOpen(!isChangePasswordOpen);
  };

  return (
    <>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        toggleHandler={changePasswordModalToggler}
      />
      <div className="items-center justify-between mb-8 hidden md:flex">
        <h3 className="text-h3 font-semibold text-blackGrey-100">Account</h3>

        <LoaderButton
          content={"Change Password"}
          onClick={changePasswordModalToggler}
          className="px-16"
          variant="contained"
        />
      </div>
      <div className="rounded-medium flex flex-col bg-white p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-2 border-b border-light-gray pb-4">
          <FolderIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">General</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="ID" value={user?.user?.id} />
          <Details label="First Name" value={user?.user?.first_name} />
          <Details label="Last Name" value={user?.user?.last_name} />
          <Details label="Username" value={user?.user?.username} />
          <Details label="User Type" value={user?.user?.user_type} />
        </div>

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <ContactMailOutlined className="text-purple-100" />
          <h5 className="text-purple-100 text-h5 font-semibold">Contacts</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="Email" value={user?.user?.email} />
          <Details label="Phone" value={user?.phone_number} />
        </div>

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <LocationOnOutlined className="text-purple-100" />
          <h5 className="text-purple-100 text-h5 font-semibold">Addressess</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="Address" value={user?.address_line_1} />
          <Details label="Country" value={user?.country} />
          <Details label="State" value={user?.state} />
          <Details label="City" value={user?.city} />
          <Details label="Postal Code" value={user?.postal_code} />
        </div>

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <StatusIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">Status</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="KYC" value={user?.kyc_status} />
          <Details label="MFA" value={user?.mfa ? "Enabled" : "Disabled"} />
          <Details label="Fees" value={user?.fees + "%"} />
        </div>
      </div>

      <div className="mt-16 max-w-[360px] pb-8 md:hidden">
        <LoaderButton
          content={"Change Password"}
          onClick={changePasswordModalToggler}
          variant={"contained"}
        />
      </div>
    </>
  );
};

export default Account;
