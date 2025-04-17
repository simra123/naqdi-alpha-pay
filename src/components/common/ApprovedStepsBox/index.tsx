"use client";

import React from "react";

import "./approvedstepsbox.scss";

import { useSelector } from "react-redux";
import { STEPS } from "@/constants/onboarding";
import { MdCheck, MdSecurity } from "react-icons/md";

const ApprovedStepsBox = () => {
  const { current_step, disabled_steps } = useSelector(
    (state: any) => state?.onboarding
  );

  const checkStepState = (stepName, nextStepName) => {
    if (!disabled_steps[stepName] && disabled_steps[nextStepName]) {
      return "current_step";
    }

    if (!disabled_steps[stepName]) {
      return "completed";
    }
  };

  return (
    <div className="mt-6 approved_steps_box">
      <div className="flex flex-col gap-8 approved_box_content">
        <div className="text-center secure_icon">
          <MdSecurity />
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
            <MdCheck />
          </div>
          <div
            className={`step ${checkStepState(
              STEPS.PHONEVALIDATION,
              STEPS?.MFASETUP
            )}`}
          >
            <span>Phone Validation</span>
            <MdCheck />
          </div>
          <div
            className={`step ${checkStepState(STEPS.MFASETUP, STEPS.FEESETUP)}`}
          >
            <span>MFA Setup</span>
            <MdCheck />
          </div>
          <div
            className={`step ${checkStepState(
              STEPS.FEESETUP,
              STEPS.IDENTITYCHECK
            )}`}
          >
            <span>Fee Setup</span>
            <MdCheck />
          </div>
          <div
            className={`step ${checkStepState(
              STEPS.IDENTITYCHECK,
              STEPS.KYCAPPROVAL
            )}`}
          >
            <span>Indentity Check</span>
            <MdCheck />
          </div>
          <div
            className={`step ${checkStepState(
              STEPS.KYCAPPROVAL,
              STEPS.FEESCHEDULE
            )}`}
          >
            <span>KYC Approval</span>
            <MdCheck />
          </div>
          <div className={`step ${checkStepState(STEPS.FEESCHEDULE, false)}`}>
            <span>Fee Schedule</span>
            <MdCheck />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedStepsBox;
