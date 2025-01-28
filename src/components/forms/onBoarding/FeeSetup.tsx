"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { FeePayer } from "@/assets/Svgs";
import LoaderButton from "@/components/common/LoaderButton";

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
    useApi({initailLoading:true});
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
    <div className="bg-white rounded-small p-12 flex flex-col gap-4 mt-8">
      <h4 className="text-black-100 text-h3.5 font-semibold">Fee Setup</h4>
      <p className="text-button text-black-100">
        Please decide whether you will be paying the fees or your client will
        for Alphaspay.
      </p>

      <div>
        <div className=" mt-6 text-p120 font-semibold">
          <h5 className="form-label-bold">Setup</h5>
        </div>

        <div className="flex flex-wrap gap-3">
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

      <p className="text-black-100">
        After Choosing, Alphaspay Fee will be deducted as per user settings.
      </p>

      <ErrorApiText error={isFeeSetupError} />

      {(selectedRole?.merchant || selectedRole?.client) && (
        <div className="mt-8 max-w-[360px]">
          <LoaderButton
            loading={isFeeSetupLoading}
            content={"Continue"}
            onClick={handleUserFeeSetup}
            variant={"contained"}
          />
        </div>
      )}
    </div>
  );
};

export default FeeSetup;

export const FeeCard = ({ name, description, selected, handleSelect }) => {
  return (
    <div
      className={`p-5 gap-8 shadow-md border w-[320px] max-w-full border-light-gray cursor-pointer transition-all rounded-[14px]  ${
        selected && "bg-light-gray-20 !border-purple-100"
      }`}
      onClick={() => handleSelect(name)}
    >
      <div className="flex justify-center">
        <FeePayer fill={selected ? "rgba(119, 53, 227, 1)" : "#AFAFAF"} />
      </div>

      <div
        className={`text-center mt-2 ${
          !selected ? "text-blackGrey-70" : "text-purple-500"
        }`}
      >
        <span className="font-semibold">{name}</span>

        <p className=" mt-[1px]">{description}</p>
      </div>
    </div>
  );
};
