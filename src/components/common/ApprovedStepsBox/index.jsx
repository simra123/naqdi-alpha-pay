import React from "react";

import "./approvedstepsbox.scss";
import { Check, Security } from "@mui/icons-material";

const ApprovedStepsBox = () => {
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
          <div className="step current_step">
            <span>Profile Complete</span>
            <Check />
          </div>
          <div className="step">
            <span>Phone Validation</span>
            <Check />
          </div>
          <div className="step">
            <span>MFA Setup</span>
            <Check />
          </div>
          <div className="step">
            <span>Certification</span>
            <Check />
          </div>
          <div className="step">
            <span>KYC Indentity Check</span>
            <Check />
          </div>
          <div className="step">
            <span>KYC Approval</span>
            <Check />
          </div>
          <div className="step">
            <span>Fee Schedule</span>
            <Check />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedStepsBox;
