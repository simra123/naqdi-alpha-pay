"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { FolderIcon, StatusIcon } from "@/assets/Svgs";

import ChangePasswordModal from "@/components/Modals/ChangePasswordModal";
import Details from "@/components/common/Details";
import LoaderButton from "@/components/common/LoaderButton";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import GenerateQRCodeModal from "@/components/Modals/GenerateQRCodeModal";
import EditableField from "@/components/common/IconField/EditableField";
import useFormValidation from "@/hooks/useFormValidation";
import { clientFeeSchema } from "@/models/clientFee";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getClientFeeApi, setClientFeeApi } from "@/services/user";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";
import LoadingApi from "@/components/common/LoadindApi";
import {
  MdOutlineContactMail,
  MdOutlineErrorOutline,
  MdOutlineLocationOn,
} from "react-icons/md";

let initalFormValues = {
  clientFee: 0,
};

const Account = () => {
  const dispatch = useDispatch();
  const localUser = useLocalStorage("user");
  const [isMFaVerified, setIsMfaVerified] = useState(false);
  const [isFeeEditing, setIsFeeEditing] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isQROpen, setQROpen] = useState(false);
  const [initFeeVal, setInitFeeVal] = useState(5);

  const [isClientFeeLoading, isClientFeeError, callClientFeeApi] = useApi();
  const [isGetClientFeeLoading, isGetClientFeeError, callGetClientFeeApi] =
    useApi({ initailLoading: true });

  const user =
    localUser?.role == Role.ADMIN
      ? localUser
      : useSelector((state: any) => state?.user?.data);

  // Initialize useFormValidation
  const {
    errors,
    handleChange,
    handleSubmit,
    values,
    setValues,
    validateField,
    setErrors,
  } = useFormValidation(initalFormValues, clientFeeSchema);

  const changePasswordModalToggler = () => {
    setChangePasswordOpen(!isChangePasswordOpen);
  };

  const qrCodeModalToggler = () => {
    setQROpen(!isQROpen);
  };

  const setClientFeeHandler = async () => {
    setIsFeeEditing(false);
    await callApiHook({
      apiCall: callClientFeeApi(setClientFeeApi({ amount: values?.clientFee })),
      successCallBack: (response) => {
        SetFeeValues(values?.clientFee);
        dispatch(
          setNotification({
            status: "success",
            message: "Client Fee has been updated successfully.",
          })
        );
      },
    });
  };

  const getClientFeeHandler = async () => {
    await callApiHook({
      apiCall: callGetClientFeeApi(getClientFeeApi()),
      successCallBack: (response) => {
        SetFeeValues(response?.fee);
      },
    });
  };

  const SetFeeValues = (fee) => {
    setValues({ clientFee: fee });
    setInitFeeVal(fee);
  };

  useEffect(() => {
    if (user?.role == Role.ADMIN && user?.userDetails?.mfa) {
      setIsMfaVerified(true);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role == Role.USER) {
      getClientFeeHandler();
    }
  }, []);

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

      <div className="hidden md:flex justify-between items-center mb-8">
        <h3 className="font-semibold text-blackGrey-100 text-h3">Account</h3>

        <LoaderButton
          content={"Change Password"}
          onClick={changePasswordModalToggler}
          className="px-16"
          variant="contained"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 pb-4 border-b border-light-gray">
          <FolderIcon />
          <h5 className="font-semibold text-h5 text-purple-500">General</h5>
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

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <MdOutlineContactMail className="text-purple-500" />
          <h5 className="font-semibold text-h5 text-purple-500">Contacts</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="Email" value={user?.email} />
          <RenderRoleBased user={localUser} allowedRoles={[Role.USER]}>
            <Details label="Phone" value={user?.userDetails?.phone_number} />
          </RenderRoleBased>
        </div>

        <RenderRoleBased user={localUser} allowedRoles={[Role.USER]}>
          <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
            <MdOutlineLocationOn className="text-purple-500" />
            <h5 className="font-semibold text-h5 text-purple-500">
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

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <StatusIcon />
          <h5 className="font-semibold text-h5 text-purple-500">Status</h5>
        </div>
        <div className="!items-baseline res-2-grid py-6">
          <div className="flex items-center gap-4">
            <Details
              label="MFA"
              value={user?.userDetails?.mfa ? "Enabled" : "Disabled"}
            />
            {localUser?.role == Role.ADMIN &&
              (!localUser?.userDetails?.mfa || !isMFaVerified) && (
                <LoaderButton
                  content={
                    <div className="flex items-center gap-2 font-semibold text-[14px]">
                      <span>Setup MFA</span>
                      <MdOutlineErrorOutline className="text-[18px] text-purple-100" />
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
                  value={user?.company?.fee + "%"}
                />
                <form onSubmit={(e) => handleSubmit(e, setClientFeeHandler)}>
                  <Details
                    label="Client Fees"
                    className={!isClientFeeLoading && "items-baseline"}
                    value={
                      <LoadingApi
                        loading={isClientFeeLoading || isGetClientFeeLoading}
                      >
                        <EditableField
                          onCancel={(initalValue) =>
                            setValues({ clientFee: initalValue })
                          }
                          inputClassName="py-2 max-w-[140px]"
                          onChange={handleChange}
                          value={values?.clientFee}
                          initalValue={initFeeVal}
                          type="number"
                          inputProps={{
                            step: "0.01",
                          }}
                          name="clientFee"
                          error={errors?.clientFee}
                          isEditing={isFeeEditing}
                          setIsEditing={setIsFeeEditing}
                        />
                      </LoadingApi>
                    }
                  />
                </form>
                <ErrorApiText error={isClientFeeError || isGetClientFeeError} />
              </RenderRoleBased>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden mt-16 pb-8 max-w-[360px]">
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
