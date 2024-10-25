'use client'
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
import { Info, Lock } from "@mui/icons-material";
import { ChangePasswordSchema } from "@/models/ProfilePage";
import useFormValidation from "@/hooks/useFormValidation";
import { ChangePassowordAdminpi, ChangePassowordApi } from "@/services/auth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";

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
  const user = useLocalStorage('user')
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

    let changePasswordFn = user?.role == Role.ADMIN ? ChangePassowordAdminpi : ChangePassowordApi

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
        setValues(initialValues)
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

      <h2 className="text-h3.5 font-semibold mb-4">Change Password</h2>

      <form
        className="mt-8 flex flex-col gap-2"
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
          icon={Lock}
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
          icon={Lock}
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
          icon={Lock}
          placeholder="Confirm Your New Password"
        />

        <div className="mt-2">
          <div className="flex gap-2 items-center">
            <label className="block mb-2 font-medium">Enter Code</label>

            <div className="relative flex items-center group">
              <Info className="text-blue-info mb-1 text-[18px]" />

              <div className="absolute w-96 bg-dark-gray text-white text-sm -top-[112px] rounded-large py-2 -left-[50px] hidden group-hover:block transition-opacity duration-200">
                <div className="relative p-2">
                  <p className="w-full text-center">
                    Use your Google Autheticator code here
                  </p>
                  <div className="absolute polygon-clip bg-dark-gray w-[50px] h-[50px] rounded-large left-[33px] -bottom-[38px]"></div>
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
                className="!w-14 p-2 py-4 max-w-full md:p-4 rounded-large outline-none border border-light-gray bg-blackGrey-filled-input"
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
            className="text-black-100 px-4 py-2 mt-2"
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
