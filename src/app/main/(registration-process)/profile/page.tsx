"use client";

import React, { useEffect, useState } from "react";

import "./profile.scss";
import HelpBox from "@/components/ui/HelpBox";
import ApprovedStepsBox from "@/components/common/ApprovedStepsBox";
import { Devices } from "@mui/icons-material";
import PasswordToggleInput from "@/components/common/PasswordToggleInput";
import OtpInput from "react-otp-input";
import { ProfileSchema } from "@/models/ProfilePage";
import useFormValidation from "@/hooks/useFormValidation";
import { useRouter } from "next/navigation";
import RequestEditModal from "@/components/common/RequestEditModal";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { ChangePassowordApi } from "@/services/auth";
import { Button } from "@mui/material";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import useLocalStorage from "@/hooks/useLocalStorage";
import { capitalize } from "@/utils/dataFormatters";
import { userDetailsApi } from "@/services/user";

const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  otp: "",
};

const Profile = () => {
  const [
    isChangePasswordLoading,
    isChangePasswordError,
    callChangePasswordApi,
  ] = useApi();
  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi();
  const {
    errors,
    handleChange,
    handleSubmit,
    validateField,
    values,
    setValues,
  } = useFormValidation(initialValues, ProfileSchema);

  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [info, setInfo] = useState(null);

  const closeEditModal = () => {
    setEditOpen(!editOpen);
  };

  const onSubmit = async () => {
    await callApiHook({
      apiCall: callChangePasswordApi(
        ChangePassowordApi({
          currentPassword: values?.oldPassword,
          newPassword: values?.newPassword,
          confirmPassword: values?.confirmNewPassword,
          token: values?.otp,
        })
      ),
      successCallBack: () => {
        console.log("Password changed successfully");
      },
    });
  };

  const fetchUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(userDetailsApi()),
      successCallBack: (response) => {
        setInfo(response?.userDetails);
      },
    });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const onSubmitError = () => {
    window.scrollTo(0, 800);
  };

  return (
    <div className={"container-custom mx-auto py-3"}>
      <RequestEditModal isOpen={editOpen} setIsOpen={setEditOpen} />
      <h2 className="large_heading_bold mt-6">Ahmed Legal Entity</h2>
      <div className="form_section flex justify-between mt-16 gap-12">
        <div className="form_wrapper w-4/6">
          {/* PROFILE BOX STARTS HERE */}
          <ErrorApiText error={isUserDetailsError} />
          <LoadingApi loading={isUserDetailsLoading}>
            <div className="profile_box shadow-sm border py-4">
              <div className="account_type">
                <h5 className="text-center bg-slate-100 font-bold text-lg p-2">
                  Standard User
                </h5>

                <div className="account_details flex flex-col gap-8 p-7 border-b">
                  <h3 className="medium_heading_light !font-semibold">
                    Account
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="title">First Name</span>
                    <span className="value">
                      {capitalize(info?.user?.first_name)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="title">Middle Name</span>
                    <span className="value">
                      {info?.user?.middle_name
                        ? capitalize(info?.user?.middle_name)
                        : "_"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="title">Last Name</span>
                    <span className="value">
                      {capitalize(info?.user?.last_name)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="title">Registered Email</span>
                    <span className="value">{info?.user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="title">Username</span>
                    <span className="value">{info?.user?.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="title">Registered Address</span>
                    <span className="value">{info?.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="title">Mobile No.</span>
                    <span className="value">{info?.phone_number}</span>
                  </div>
                </div>

                {info?.user?.legal_type && (
                  <div className="account_details flex flex-col gap-1 p-7">
                    <div className="flex items-center justify-between">
                      <span className="title">Account Type</span>
                      <span className="value">
                        {capitalize(info?.user?.user_type)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="title">Instituition Name</span>
                      <span className="value">
                        {capitalize(info?.user?.legal_name)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="title">Institution Type</span>
                      <span className="value">
                        {capitalize(info?.user?.legal_type)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="px-7 py-3">
                  <button
                    className="gradient_bg text-white uppercase px-4 py-2 text-sm font-semibold"
                    onClick={closeEditModal}
                  >
                    request edit
                  </button>
                </div>
              </div>
            </div>
          </LoadingApi>

          {/* MFA BOX STARTS HERE */}
          {/* <div className="MFA_box mt-12">
            <div className="heading flex justify-between items-center">
              <h5 className="medium_heading_bold">MFA Devices</h5>
              <button className="gradient_bg text-white uppercase px-8 py-2 text-[10px] font-semibold">
                add device
              </button>
            </div>
            <p className="mt-4">
              Your verified Multi-Factor Authentication (MFA) devices are listed
              here. A valid MFA authorisation code is required for certain
              restricted actions on Alphaspay. You can use any one of the
              devices listed below.
            </p>

            <div className="devices_wrapper flex gap-2 justify-between">
              <div className="device border shadow-sm min-w-80">
                <div className="flex py-8 px-6 gap-4 flex-col border-b">
                  <div className="flex items-center gap-4">
                    <div>
                      <Devices className="!text-3xl" />
                    </div>
                    <span className="uppercase text-lg font-bold">
                      85D00042C594
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="title">Added on</span>
                    <span className="value">March 22,2024</span>
                  </div>
                </div>

                <button className="secondary-color font-bold w-full p-1">
                  Remove device
                </button>
              </div>
              <div className="device border shadow-sm min-w-80">
                <div className="flex py-8 px-6 gap-4 flex-col border-b">
                  <div className="flex items-center gap-4">
                    <div>
                      <Devices className="!text-3xl" />
                    </div>
                    <span className="uppercase text-lg font-bold">
                      85D00042C594
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="title">Added on</span>
                    <span className="value">March 22,2024</span>
                  </div>
                </div>

                <button className="secondary-color font-bold w-full p-1">
                  Remove device
                </button>
              </div>
            </div>
          </div> */}

          {/* Change Passworf below */}

          <form
            className="form mt-12  max-w-lg"
            onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
          >
            <h5 className="medium_heading_bold">Change Password</h5>

            <div className="flex flex-col gap-3 mt-6">
              <div>
                <PasswordToggleInput
                  value={values.oldPassword}
                  onChange={handleChange}
                  onBlur={validateField}
                  name="oldPassword"
                  placeholder={"Old Password*"}
                />
                {errors.oldPassword && (
                  <div className="error_text">{errors.oldPassword}</div>
                )}
              </div>

              <div>
                <PasswordToggleInput
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={validateField}
                  name="newPassword"
                  placeholder={"New Password*"}
                />
                {errors.newPassword && (
                  <div className="error_text">{errors.newPassword}</div>
                )}
              </div>

              <div>
                <PasswordToggleInput
                  value={values.confirmNewPassword}
                  onChange={handleChange}
                  onBlur={validateField}
                  name="confirmNewPassword"
                  placeholder={"Confirm New Password*"}
                />
                {errors.confirmNewPassword && (
                  <div className="error_text">{errors.confirmNewPassword}</div>
                )}
              </div>
            </div>

            <div className="otp mt-6">
              <h5 className="medium_heading_bold">Enter MFA Code</h5>
              <div className="my-5">
                <OtpInput
                  numInputs={6}
                  placeholder="XXXXXX"
                  containerStyle={{
                    display: "flex",

                    gap: "1.5rem",
                  }}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="input-field min-w-14 p-4 outline-none"
                    />
                  )}
                  onChange={(value) =>
                    setValues((pre) => ({ ...pre, otp: value }))
                  }
                  value={values.otp}
                />
                {errors.otp && <div className="error_text">{errors.otp}</div>}
              </div>
              <p className="note">
                If you have lost your device, please contact support.
              </p>
            </div>
            <ErrorApiText error={isChangePasswordError} />
            <LoadingApi loading={isChangePasswordLoading}>
              <Button className="btn gradient-btn" type="submit">
                confirm
              </Button>
            </LoadingApi>
          </form>
        </div>

        {/* RIGHT SIDE OF FLEX BELOW */}

        <div className="wrapper w-1/3">
          <HelpBox />
          <ApprovedStepsBox />
        </div>
      </div>
    </div>
  );
};

export default Profile;
