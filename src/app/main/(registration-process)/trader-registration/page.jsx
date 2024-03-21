import React from "react";
import "./trader-registration.scss";
import { Check, Security } from "@mui/icons-material";
import ProfileForm from "@/components/forms/onBoarding/ProfileForm";
const TraderRegistration = () => {
  return (
    <div className="container-custom mx-auto py-3">
      {/* Header steps */}
      <div className="flex justify-between gap-3">
        <button className="px-4 py-3 header_step_btn flex-1 active">
          Profile
        </button>
        <button className="px-4 py-3 header_step_btn  flex-1">
          Phone Vaidation
        </button>
        <button className="px-4 py-3 header_step_btn  flex-1" disabled>
          MFA Setup
        </button>
        <button className="px-4 py-3 header_step_btn  flex-1" disabled>
          certifification
        </button>
        <button className="px-4 py-3 header_step_btn  flex-1" disabled>
          Identity Check
        </button>
        <button className="px-4 py-3 header_step_btn  flex-1" disabled>
          KYC Approval
        </button>
        <button className="px-4 py-3 header_step_btn  flex-1" disabled>
          Fee Schedule
        </button>
      </div>

      <div className="form_section flex justify-between mt-16 gap-12">
        <div className="form_wrapper w-4/6">
          <ProfileForm />
        </div>

        {/* RIGHT SIDE OF FLEX BELOW */}

        <div className="wrapper w-1/3">
          <div className="help_box">
            <div className="content_box flex flex-col gap-3">
              <h3 className="font-bold">Need Help?</h3>
              <a href="#">Submit a request</a>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default TraderRegistration;
