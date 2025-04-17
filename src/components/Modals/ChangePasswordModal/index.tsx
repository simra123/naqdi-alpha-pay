"use client";
import React, { useState } from "react";
import Modal from "../Modal"; // Make sure to adjust the import path if necessary

import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";

import { callApiHook } from "@/utils/apifuncs";
import { setNotification } from "@/store/slices/modal.Slice";
import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import ErrorApiText from "../../common/ErrorApiText";
import OtpInput from "react-otp-input";
import { ChangePasswordSchema } from "@/models/profilePage";
import useFormValidation from "@/hooks/useFormValidation";
import { ChangePassowordApi } from "@/services/auth";
import { ChangePassowordAdminpi } from "@/services/admin/auth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";
import { MdInfo, MdLock } from "react-icons/md";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
}

const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  otp: "",
};

const ChangePasswordModal = ({ isOpen, toggleHandler }: Props) => {
  const dispatch = useDispatch();
  const user = useLocalStorage("user");
  const [misMatchError, setMisMatchError] = useState("");
  const [
    isChangePasswordLoading,
    isChangePasswordError,
    callChangePasswordApi,
  ] = useApi();

  const {
    errors,
    handleChange,
    handleSubmit,
    validateField,
    values,
    setValues,
  } = useFormValidation(initialValues, ChangePasswordSchema);

  const onSubmit = async () => {
    let changePasswordFn =
      user?.role == Role.ADMIN ? ChangePassowordAdminpi : ChangePassowordApi;

    await callApiHook({
      apiCall: callChangePasswordApi(
        changePasswordFn({
          currentPassword: values?.oldPassword,
          newPassword: values?.newPassword,
          confirmPassword: values?.confirmNewPassword,
          token: values?.otp,
        })
      ),
      successCallBack: () => {
        toggleHandler();
        dispatch(
          setNotification({
            message: "Password changed successfully",
            status: "success",
          })
        );
        setValues(initialValues);
      },
    });
  };

  const validateMatch = (e) => {
    const { value } = e.target;

    if (value == values?.newPassword) {
      setMisMatchError("");
    } else {
      setMisMatchError("Passwords Must Match.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={toggleHandler}>
      <h2 className="mb-4 font-semibold text-h3.5">Change Password</h2>

      <form
        className="flex flex-col gap-2 mt-8"
        onSubmit={(e) =>
          handleSubmit(e, onSubmit, () => console.log("Something went wrong"))
        }
      >
        <IconField
          label="Current Password"
          type="password"
          error={errors.oldPassword}
          value={values.oldPassword}
          onChange={handleChange}
          onBlur={validateField}
          name="oldPassword"
          icon={MdLock}
          placeholder="Enter Your Current Password"
        />

        <IconField
          label="New Password"
          type="password"
          error={errors.newPassword}
          value={values.newPassword}
          onChange={handleChange}
          info="Use 8 or more characters with a mix of letters, numbers,
                special & uppercase characters."
          onBlur={validateField}
          name="newPassword"
          icon={MdLock}
          placeholder="Enter Your New Password"
        />

        <IconField
          label="Confirm New Password"
          type="password"
          error={misMatchError}
          value={values.confirmNewPassword}
          onChange={handleChange}
          onBlur={validateMatch}
          name="confirmNewPassword"
          icon={MdLock}
          placeholder="Confirm Your New Password"
        />

        <div className="mt-2">
          <div className="flex items-center gap-2">
            <label className="block mb-2 font-medium">Enter Code</label>

            <div className="group relative flex items-center">
              <MdInfo className="mb-1 text-[18px] text-blue-info" />

              <div className="hidden group-hover:block -top-[112px] -left-[50px] absolute bg-dark-gray py-2 rounded-large w-96 text-white text-sm transition-opacity duration-200">
                <div className="relative p-2">
                  <p className="w-full text-center">
                    Use your Google Autheticator code here
                  </p>
                  <div className="-bottom-[38px] left-[33px] absolute bg-dark-gray rounded-large w-[50px] h-[50px] polygon-clip"></div>
                </div>
              </div>
            </div>
          </div>
          <OtpInput
            numInputs={6}
            containerStyle={{
              display: "flex",
              gap: "1rem",
              marginTop: "6px",
              flexWrap: "wrap",
            }}
            renderInput={(props) => (
              <input
                {...props}
                className="bg-blackGrey-filled-input p-2 md:p-4 py-4 border border-light-gray rounded-large outline-none !w-14 max-w-full"
              />
            )}
            onChange={(value) => setValues((pre) => ({ ...pre, otp: value }))}
            value={values?.otp}
          />
        </div>

        <div className="flex flex-col justify-end mt-4">
          <LoaderButton
            type="submit"
            content={`Submit`}
            variant="contained"
            loading={isChangePasswordLoading}
          />

          {/* <button
            type="button"
            className="mt-2 px-4 py-2 text-black-100"
            onClick={toggleHandler}
          >
            Cancel
          </button> */}
        </div>
      </form>

      <ErrorApiText error={isChangePasswordError} />
    </Modal>
  );
};

export default ChangePasswordModal;
