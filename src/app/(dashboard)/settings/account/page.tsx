"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  ContactMailOutlined,
  ErrorOutlineOutlined,
  LocationOnOutlined,
  WarningOutlined,
  WarningRounded,
} from "@mui/icons-material";
import { FolderIcon, StatusIcon } from "@/assets/Svgs";

import ChangePasswordModal from "@/components/Modals/ChangePasswordModal";
import Details from "@/components/common/Details";
import LoaderButton from "@/components/common/LoaderButton";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import GenerateQRCodeModal from "@/components/Modals/GenerateQRCodeModal";
import EditableField from "@/components/common/IconField/EditableField";

const Account = () => {
  const localUser = useLocalStorage("user");
  const [isMFaVerified, setIsMfaVerified] = useState(false);

  const user =
    localUser?.role == Role.ADMIN
      ? localUser
      : useSelector((state: any) => state?.user?.data);

  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isQROpen, setQROpen] = useState(false);

  const changePasswordModalToggler = () => {
    setChangePasswordOpen(!isChangePasswordOpen);
  };

  const qrCodeModalToggler = () => {
    setQROpen(!isQROpen);
  };

  useEffect(() => {
    if (user?.role == Role.ADMIN && user?.userDetails?.mfa) {
      setIsMfaVerified(true);
    }
  }, [user]);

  return (
    <>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        toggleHandler={changePasswordModalToggler}
      />
      <GenerateQRCodeModal
        isOpen={isQROpen}
        setIsOpen={setQROpen}
        setIsMfaVerified={setIsMfaVerified}
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
          <Details label="ID" value={user?.id} />
          <Details label="First Name" value={user?.first_name} />
          <Details label="Last Name" value={user?.last_name} />
          <Details label="Username" value={user?.username} />
          <Details
            label="User Type"
            value={localUser?.role == Role.ADMIN ? "Admin" : user?.user_type}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <ContactMailOutlined className="text-purple-100" />
          <h5 className="text-purple-100 text-h5 font-semibold">Contacts</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="Email" value={user?.email} />
          <RenderRoleBased user={localUser} allowedRoles={[Role.USER]}>
            <Details label="Phone" value={user?.userDetails?.phone_number} />
          </RenderRoleBased>
        </div>

        <RenderRoleBased user={localUser} allowedRoles={[Role.USER]}>
          <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
            <LocationOnOutlined className="text-purple-100" />
            <h5 className="text-purple-100 text-h5 font-semibold">
              Addressess
            </h5>
          </div>
          <div className="res-2-grid py-6">
            <Details
              label="Address"
              value={user?.userDetails?.address_line_1}
            />
            <Details label="Country" value={user?.userDetails?.country} />
            <Details label="State" value={user?.userDetails?.state} />
            <Details label="City" value={user?.userDetails?.city} />
            <Details
              label="Postal Code"
              value={user?.userDetails?.postal_code}
            />
          </div>
        </RenderRoleBased>

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <StatusIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">Status</h5>
        </div>
        <div className="res-2-grid py-6">
          <div className="flex gap-4 items-center">
            <Details
              label="MFA"
              value={user?.userDetails?.mfa ? "Enabled" : "Disabled"}
            />
            {localUser?.role == Role.ADMIN &&
              (!localUser?.userDetails?.mfa || !isMFaVerified) && (
                <LoaderButton
                  content={
                    <div className="flex gap-2 text-[14px] font-semibold items-center">
                      <span>Setup MFA</span>
                      <ErrorOutlineOutlined className="text-purple-100 text-[18px]" />
                    </div>
                  }
                  variant="text"
                  className="hover:underline"
                  onClick={qrCodeModalToggler}
                />
              )}
          </div>
          {!user?.parentUser && (
            <>
              <RenderRoleBased user={localUser} allowedRoles={[Role.USER]}>
                <Details label="KYC" value={user?.userDetails?.kyc_status} />
                <Details
                  label="Admin Fees"
                  value={user?.userDetails?.fees + "%"}
                />
                {/* <Details
                  label="Client Fees"
                  value={
                    <EditableField
                      onCancel={() => {}}
                      onEdit={() => {}}
                      inputClassName="py-2 max-w-[140px]"
                      onChange={(event) => {}}
                      value={2}
                    />
                  }
                /> */}
              </RenderRoleBased>
            </>
          )}
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
