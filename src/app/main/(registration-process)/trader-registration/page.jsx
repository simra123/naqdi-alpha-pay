"use client";

import React, { useState } from "react";
import "./trader-registration.scss";
import { Check, Security } from "@mui/icons-material";
import ProfileForm from "@/components/forms/onBoarding/ProfileForm";
import { STEPS } from "@/constants/onboarding";
import PhoneValidation from "@/components/forms/onBoarding/PhoneValidation";
import MFASetup from "@/components/forms/onBoarding/MFASetup";
import Certification from "@/components/forms/onBoarding/Certification";
import IdentityCheck from "@/components/forms/onBoarding/IdentityCheck";
import KYCApproval from "@/components/forms/onBoarding/KYCApproval";
import FeeSchedule from "@/components/forms/onBoarding/FeeSchedule";
import HelpBox from "@/components/ui/HelpBox";
import ApprovedStepsBox from "@/components/common/ApprovedStepsBox";
const TraderRegistration = () => {
  const [selectedStep, setSelectedStep] = useState(STEPS.PROFILE);

  const handleStepChange = (stepName) => () => {
    setSelectedStep(stepName);
  };

  const returnActiveStep = (stepName) => {
    return selectedStep === stepName ? " active" : "";
  };
  const returnActiveForm = (stepName, FormComponent) => {
    return selectedStep === stepName && <FormComponent />;
  };

  console.log(selectedStep);

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
          onClick={handleStepChange(STEPS.PHONEVALIDATION)}
        >
          Phone Vaidation
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.MFASETUP)
          }
          ret
          onClick={handleStepChange(STEPS.MFASETUP)}
        >
          MFA Setup
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.CERTIFICATION)
          }
          onClick={handleStepChange(STEPS.CERTIFICATION)}
        >
          certifification
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.IDENTITYCHECK)
          }
          onClick={handleStepChange(STEPS.IDENTITYCHECK)}
        >
          Identity Check
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.KYCAPPROVAL)
          }
          onClick={handleStepChange(STEPS.KYCAPPROVAL)}
        >
          KYC Approval
        </button>
        <button
          className={
            "px-4 py-3 header_step_btn  flex-1" +
            returnActiveStep(STEPS.FEESCHEDULE)
          }
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
          {returnActiveForm(STEPS.CERTIFICATION, Certification)}
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
