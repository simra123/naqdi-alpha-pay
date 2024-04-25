"use client";

import React, { useState } from "react";
import ProfileForm from "@/components/forms/onBoarding/ProfileForm";
import { STEPS } from "@/constants/onboarding";
import PhoneValidation from "@/components/forms/onBoarding/PhoneValidation";
import MFASetup from "@/components/forms/onBoarding/MFASetup";
// import Certification from "@/components/forms/onBoarding/Certification";
import IdentityCheck from "@/components/forms/onBoarding/IdentityCheck";
import KYCApproval from "@/components/forms/onBoarding/KYCApproval";
import FeeSchedule from "@/components/forms/onBoarding/FeeSchedule";
import HelpBox from "@/components/ui/HelpBox";
import ApprovedStepsBox from "@/components/common/ApprovedStepsBox";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "@/store/slices/onboarding.slice";
import "./trader-registration.scss";

const TraderRegistration = () => {
  const dipatch = useDispatch();
  const currentStep = useSelector((state: any) => state.onboarding.current_step);
  const disabledSteps = useSelector((state:any) => state.onboarding.disabled_steps);

  const handleStepChange = (stepName) => () => {
    dipatch(setStep({ current_step: stepName }));
  };

  const returnActiveStep = (stepName) => {
    return currentStep === stepName ? " active" : "";
  };
  const returnActiveForm = (stepName, FormComponent) => {
    return currentStep === stepName && <FormComponent />;
  };

  console.log(currentStep);

  return (
    <div className="container-custom mx-auto py-3">
      {/* Header steps */}
      <div className="flex justify-between gap-3">
        <button
          className={
            "px-4 py-3 header_step_btn flex-1" + returnActiveStep(STEPS.PROFILE)
          }
          onClick={handleStepChange(STEPS.PROFILE)}
        >
          Profile
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.PHONEVALIDATION)
          }
          disabled={disabledSteps[STEPS.PHONEVALIDATION]}
          onClick={handleStepChange(STEPS.PHONEVALIDATION)}
        >
          Phone Vaidation
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.MFASETUP)
          }
          disabled={disabledSteps[STEPS.MFASETUP]}
          onClick={handleStepChange(STEPS.MFASETUP)}
        >
          MFA Setup
        </button>
        {/* <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.CERTIFICATION)
          }
          disabled={disabledSteps[STEPS.CERTIFICATION]}
          onClick={handleStepChange(STEPS.CERTIFICATION)}
        >
          certifification
        </button> */}
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.IDENTITYCHECK)
          }
          disabled={disabledSteps[STEPS.IDENTITYCHECK]}
          onClick={handleStepChange(STEPS.IDENTITYCHECK)}
        >
          Identity Check
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.KYCAPPROVAL)
          }
          disabled={disabledSteps[STEPS.KYCAPPROVAL]}
          onClick={handleStepChange(STEPS.KYCAPPROVAL)}
        >
          KYC Approval
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.FEESCHEDULE)
          }
          disabled={disabledSteps[STEPS.FEESCHEDULE]}
          onClick={handleStepChange(STEPS.FEESCHEDULE)}
        >
          Fee Schedule
        </button>
      </div>

      <div className="form_section flex justify-between mt-16 gap-12">
        <div className="form_wrapper w-4/6">
          {returnActiveForm(STEPS.PROFILE, ProfileForm)}
          {returnActiveForm(STEPS.PHONEVALIDATION, PhoneValidation)}
          {returnActiveForm(STEPS.MFASETUP, MFASetup)}
          {/* {returnActiveForm(STEPS.CERTIFICATION, Certification)} */}
          {returnActiveForm(STEPS.IDENTITYCHECK, IdentityCheck)}
          {returnActiveForm(STEPS.KYCAPPROVAL, KYCApproval)}
          {returnActiveForm(STEPS.FEESCHEDULE, FeeSchedule)}
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

export default TraderRegistration;
