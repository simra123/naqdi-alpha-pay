"use client";

import React, { useEffect } from "react";
import ProfileForm from "@/components/forms/onBoarding/ProfileForm";
import { STEPS } from "@/constants/onboarding";
import PhoneValidation from "@/components/forms/onBoarding/PhoneValidation";
import MFASetup from "@/components/forms/onBoarding/MFASetup";
import IdentityCheck from "@/components/forms/onBoarding/IdentityCheck";
import KYCApproval from "@/components/forms/onBoarding/KYCApproval";
import FeeSchedule from "@/components/forms/onBoarding/FeeSchedule";

import { useDispatch, useSelector } from "react-redux";
import { setStep } from "@/store/slices/onboarding.slice";
import FeeSetup from "@/components/forms/onBoarding/FeeSetup";
import "./onboarding.scss";

const Onboarding = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: any) => state.user.data);
  const user = userState?.userDetails;

  const currentStep = useSelector(
    (state: any) => state.onboarding.current_step
  );
  const disabledSteps = useSelector(
    (state: any) => state.onboarding.disabled_steps
  );



  const handleStepChange = (stepName) => () => {
    dispatch(setStep({ current_step: stepName }));
  };

  const returnActiveStep = (stepName) => {
    return currentStep === stepName ? " active" : "";
  };
  const returnActiveForm = (stepName, FormComponent) => {
    return currentStep === stepName && <FormComponent />;
  };



  return (
    <>
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8">
        Onboarding
      </h3>
      {/* Header steps */}
      <div
        className={`${
          !userState?.parentUser && "justify-between"
        } gap-8 px-4 hidden lg:flex bg-white rounded-small`}
      >
        <button
          className={
            "px-4 py-3 header_step_btn flex-1" + returnActiveStep(STEPS.PROFILE)
          }
          disabled={user}
          onClick={handleStepChange(STEPS.PROFILE)}
        >
          <div
            className="flex gap-2 
          items-center"
          >
            <span className="step-no">1</span>
            <span>Basic Information</span>
          </div>
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.PHONEVALIDATION)
          }
          disabled={disabledSteps[STEPS.PHONEVALIDATION] || user?.phone_number}
          onClick={handleStepChange(STEPS.PHONEVALIDATION)}
        >
          <div
            className="flex gap-2 
          items-center"
          >
            <span className="step-no">2</span>
            <span> Phone Vaidation </span>
          </div>
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.MFASETUP)
          }
          disabled={disabledSteps[STEPS.MFASETUP] || user?.mfa}
          onClick={handleStepChange(STEPS.MFASETUP)}
        >
          <div
            className="flex gap-2 
          items-center"
          >
            <span className="step-no">3</span>
            <span>MFA Setup</span>
          </div>
        </button>
        {!userState?.parentUser && (
          <>
            <button
              className={
                "px-4 py-3 header_step_btn  flex-1" +
                returnActiveStep(STEPS.FEESETUP)
              }
              disabled={
                disabledSteps[STEPS.FEESETUP] ||
                user?.client_fees ||
                user?.merchant_fees
              }
              onClick={handleStepChange(STEPS.FEESETUP)}
            >
              <div
                className="flex gap-2 
            items-center"
              >
                <span className="step-no">4</span>
                <span>Fee Setup</span>
              </div>
            </button>

            <button
              className={
                "px-4 py-3 header_step_btn  flex-1" +
                returnActiveStep(STEPS.IDENTITYCHECK)
              }
              disabled={
                disabledSteps[STEPS.IDENTITYCHECK] || user?.kyc_approved
              }
              onClick={handleStepChange(STEPS.IDENTITYCHECK)}
            >
              <div
                className="flex gap-2 
            items-center"
              >
                <span className="step-no">5</span>
                <span>Identity Check</span>
              </div>
            </button>
            <button
              className={
                "px-4 py-3 header_step_btn  flex-1" +
                returnActiveStep(STEPS.KYCAPPROVAL)
              }
              disabled={disabledSteps[STEPS.KYCAPPROVAL] || user?.kyc_approved}
              onClick={handleStepChange(STEPS.KYCAPPROVAL)}
            >
              <div
                className="flex gap-2 
            items-center"
              >
                <span className="step-no">6</span>
                <span>KYC Approval</span>
              </div>
            </button>
            <button
              className={
                "px-4 py-3 header_step_btn  flex-1" +
                returnActiveStep(STEPS.FEESCHEDULE)
              }
              disabled={disabledSteps[STEPS.FEESCHEDULE] || user?.fees}
              onClick={handleStepChange(STEPS.FEESCHEDULE)}
            >
              <div
                className="flex gap-2 
            items-center"
              >
                <span className="step-no">7</span>
                <span>Fee Schedule</span>
              </div>
            </button>
          </>
        )}
      </div>

      {returnActiveForm(STEPS.PROFILE, ProfileForm)}
      {returnActiveForm(STEPS.PHONEVALIDATION, PhoneValidation)}
      {returnActiveForm(STEPS.MFASETUP, MFASetup)}
      {returnActiveForm(STEPS.FEESETUP, FeeSetup)}
      {returnActiveForm(STEPS.IDENTITYCHECK, IdentityCheck)}
      {returnActiveForm(STEPS.KYCAPPROVAL, KYCApproval)}
      {returnActiveForm(STEPS.FEESCHEDULE, FeeSchedule)}
    </>
  );
};

export default Onboarding;
