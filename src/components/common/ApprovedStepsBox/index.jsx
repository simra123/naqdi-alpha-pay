"use client";

import React from "react";

import "./approvedstepsbox.scss";
import { Check, Security } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { STEPS } from "@/constants/onboarding";

const ApprovedStepsBox = () => {
  const { current_step, disabled_steps } = useSelector(
    (state) => state?.onboarding
  );

  const checkStepState = (stepName, nextStepName) => {
    console.log(!disabled_steps[stepName] , disabled_steps[nextStepName] , "++++++++++++");

    if (!disabled_steps[stepName] && disabled_steps[nextStepName]) {
      return "current_step";
    }

    if (!disabled_steps[stepName]) {
      return "completed";
    }
  };

  return (
    <div className="approved_steps_box mt-6">
      <div className="approved_box_content flex flex-col gap-8">
        <div className="secure_icon text-center">
          <Security />
        </div>
        <div className="heading">
          <h4>UPGRADE TO TRADER</h4>
        </div>

        <div className="steps_box">
          <div
            className={`step ${checkStepState(
              STEPS.PROFILE,
              STEPS.PHONEVALIDATION
            )}`}
          >
            <span>Profile Complete</span>
            <Check />
          </div>
          <div
            className={`step ${checkStepState(
              STEPS.PHONEVALIDATION,
              STEPS?.MFASETUP
            )}`}
          >
            <span>Phone Validation</span>
            <Check />
          </div>
          <div
            className={`step ${checkStepState(
              STEPS.MFASETUP,
              STEPS.CERTIFICATION
            )}`}
          >
            <span>MFA Setup</span>
            <Check />
          </div>
          <div
            className={`step ${checkStepState(
              STEPS.CERTIFICATION,
              STEPS.IDENTITYCHECK
            )}`}
          >
            <span>Certification</span>
            <Check />
          </div>
          <div
            className={`step ${checkStepState(
              STEPS.IDENTITYCHECK,
              STEPS.KYCAPPROVAL
            )}`}
          >
            <span>Indentity Check</span>
            <Check />
          </div>
          <div
            className={`step ${checkStepState(
              STEPS.KYCAPPROVAL,
              STEPS.FEESCHEDULE
            )}`}
          >
            <span>KYC Approval</span>
            <Check />
          </div>
          <div className={`step ${checkStepState(STEPS.FEESCHEDULE, false)}`}>
            <span>Fee Schedule</span>
            <Check />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedStepsBox;
