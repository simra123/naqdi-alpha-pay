"use client";
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import OtpInput from "react-otp-input";

const MFASetup = () => {
  const [otp, setOtp] = useState(null);
  const [otpError, setOtpError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!otp) {
      return setOtpError("Please Enter Otp");
    }
    if (otp && otp.length < 6) {
      return setOtpError("Otp is not valid");
    }
    if (otp) {
      return setOtpError(null);
    }
  };

  return (
    <>
      <h2 className="large_heading_bold">Multi-Factor Authentication</h2>
      <p>
        Multi-Factor Authentication (MFA) is a simple best practice that uses
        Google Authenticator to add an extra layer of protection for your
        account.
      </p>

      <div className="form_steps mt-14">
        <h4 className="text-lg font-bold">
          STEP 1: Download Google Authenticator
        </h4>
        <div className="flex gap-4 mt-8">
          <a
            href="https://apps.apple.com/us/app/google-authenticator/id388497605"
            target="_blank"
          >
            <img src="/app_store.png" alt="app_store" className="w-40" />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
            target="_blank"
          >
            <img src="/google_play.png" alt="app_store" className="w-40" />
          </a>
        </div>
      </div>

      <div className="form_steps mt-14">
        <h4 className="text-lg font-bold">
          STEP 2: Generate and Scan the QR Code
        </h4>
        <div className="qr_code mt-6">
          <QRCodeCanvas
            value="https://reactjs.org/"
            style={{ width: "200px", height: "200px" }}
          />
        </div>
        <button className="btn-secondary font-bold rounded-none mt-6 min-w-32">
          Generate
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form_steps mt-14">
          <h4 className="text-lg font-bold">
            STEP 3: Enter your personal generated MFA Code (6-Digit Code)
          </h4>
          <p className="text-lg mt-3">
            Make a note of the MFA code that appears on your device and enter
            that code in the box below, and then choose Verify.
          </p>
          <div className="my-5">
            <OtpInput
              numInputs={6}
              placeholder="XXXXXX"
              containerStyle={{
                display: "flex",

                gap: "1.5rem",
              }}
              renderInput={(props) => (
                <input
                  {...props}
                  className="input-field min-w-14 p-4 outline-none"
                />
              )}
              onChange={(value) => setOtp(value)}
              value={otp}
            />
            {otpError && <div className="error_text">{otpError}</div>}
          </div>

          <button
            className="btn-secondary font-bold rounded-none mt-6 min-w-32"
            type="submit"
          >
            Verify
          </button>
        </div>
      </form>

      <p className="note mt-6">
        Alphaspay does not charge any fees for using MFA. If you have any questions
        or concerns, please Contact us
      </p>
      <div className="btn_wrapper text-right">
        <button className="header_step_btn active fl">Next</button>
      </div>
    </>
  );
};

export default MFASetup;
