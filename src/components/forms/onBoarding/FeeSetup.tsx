"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Typography } from "@mui/material";
import { Check, CheckCircle, Forward } from "@mui/icons-material";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { userDetailsApi } from "@/services/user";
import LoadingApi from "@/components/common/LoadindApi";
import { useRouter } from "next/navigation";
import { setStep } from "@/store/slices/onboarding.slice";
import { STEPS } from "@/constants/onboarding";
import { useDispatch } from "react-redux";
import { FeeSetupApi } from "@/services/onBoarding";

enum FEEROLES {
  MERCHANT = "Me",
  CLIENT = "Client",
}

const FeeSetup = () => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState({
    merchant: false,
    client: false,
  });
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi(true);
  const [isFeeSetupLoading, isFeeSetupError, callFeeSetupApi] = useApi();

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(userDetailsApi()),
      successCallBack: (response: any) => {
        setSelectedRole({
          client: response?.userDetails?.client_fees,
          merchant: response?.userDetails?.merchant_fees,
        });
      },
    });
  };

  const handleUserFeeSetup = async () => {
    if (!selectedRole.client && !selectedRole.merchant) {
      return setError("Please Select Who Will Pay !!");
    }

    setError(null);

    await callApiHook({
      apiCall: callFeeSetupApi(
        FeeSetupApi({
          client_fees: selectedRole?.client,
          merchant_fees: selectedRole?.merchant,
        })
      ),
      successCallBack: (response: any) => {
        console.log("MOVING TO NEXG STEP");

        dispatch(
          setStep({
            previous_step: STEPS.FEESETUP,
            current_step: STEPS.IDENTITYCHECK,
            next_step: STEPS?.KYCAPPROVAL,
          })
        );
      },
    });
  };

  const handleChange = (name) => {
    if (name == FEEROLES.CLIENT) {
      setSelectedRole({ client: true, merchant: false });
    }

    if (name == FEEROLES.MERCHANT) {
      setSelectedRole({ client: false, merchant: true });
    }
  };

  return (
    <>
      <h2 className="large_heading_bold">Fee Setup</h2>
      <p>
        Please decide whether you will be paying the fees or your client will
        for Alphaspay.
      </p>

      <div>
        <div className="register_form__trader__heading mt-10">
          <Typography variant="h5" color="primary" className="form-label-bold">
            Setup
          </Typography>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <LoadingApi loading={isUserDetailsLoading}>
            <FeeCard
              name={FEEROLES.MERCHANT}
              description={"I will pay fee myself"}
              selected={selectedRole?.merchant}
              handleSelect={handleChange}
            />
            <FeeCard
              name={FEEROLES.CLIENT}
              description={"My Client will pay the fee"}
              selected={selectedRole?.client}
              handleSelect={handleChange}
            />

            <ErrorApiText error={isUserDetailsError} />
          </LoadingApi>
        </div>
      </div>
      <div className="mt-2">
        <ErrorApiText error={error} />
      </div>

      <p className="note mt-14">
        After Choosing, Alphaspay Fee will be deducted as per user settings.
      </p>
      <ErrorApiText error={isFeeSetupError} />
      {(selectedRole?.merchant || selectedRole?.client) && (
        <div className="btn_wrapper text-right">
          <LoadingApi loading={isFeeSetupLoading}>
            <button
              className="header_step_btn active fl"
              onClick={handleUserFeeSetup}
            >
              <span>Next </span>
            </button>
          </LoadingApi>
        </div>
      )}
    </>
  );
};

export default FeeSetup;

export const FeeCard = ({ name, description, selected, handleSelect }) => {
  return (
    <div
      className={`card p-5 gap-6 shadow-md border cursor-pointer transition-all relative ${
        selected && "bg-gray-200"
      }`}
      onClick={() => handleSelect(name)}
    >
      <div className="text-center p-6">
        <span className="font-bold text-4xl">{name}</span>

        <p className=" mt-[1px] !text-[12px] font-semibold">{description}</p>
      </div>
      {selected && (
        <div className="absolute top-2 right-2">
          <CheckCircle color="success" />
        </div>
      )}
    </div>
  );
};
