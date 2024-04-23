"use client";
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import OtpInput from "react-otp-input";
import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import { generateMFACodeApi, MfaSetupApi } from "@/services/onBoarding";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import { STEPS } from "@/constants/onboarding";
import { useDispatch } from "react-redux";
import { setStep } from "@/store/slices/onboarding.slice";

const MFASetup = () => {
  const dispatch = useDispatch();
  
  const [isQrCodeLoading, isQrCodeError, callQrCodeApi] = useApi();
  const [isVerifyLoading, isVerifyError, callVerifyApi] = useApi();

  const [otp, setOtp] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [isVerified, setIsVerfied] = useState(null);

  const qrCodeGenerator = async () => {
    await callApiHook({
      apiCall: callQrCodeApi(generateMFACodeApi()),
      successCallBack: (response) => {
        setQrCode(response);
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(otp);

    if (!otp) {
      return setOtpError("Please Enter Otp");
    }
    if (otp && otp.length < 6) {
      return setOtpError("Otp is not valid");
    }
    if (otp) {
      setOtpError(null);
      await callApiHook({
        apiCall: callVerifyApi(
          MfaSetupApi({ secret: qrCode?.secret, token: otp })
        ),
        successCallBack: (response) => {
          setIsVerfied(true);
        },
      });
    }
  };

  const handleSubmitMfaSetup = () => {
    dispatch(
      setStep({
        previous_step: STEPS.MFASETUP,
        current_step: STEPS.IDENTITYCHECK,
        next_step: STEPS?.KYCAPPROVAL,
      })
    );
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
          {qrCode && (
            <QRCodeCanvas
              value={`otpauth://totp/Alphapay?secret=${encodeURIComponent(
                qrCode?.secret
              )}&issuer=Alphapay
            `}
              width={200}
              height={200}
            />
          )}
        </div>
        <ErrorApiText error={isQrCodeError} />

        <LoadingApi loading={isQrCodeLoading}>
          <button
            className="btn-secondary font-bold rounded-none mt-6 min-w-32"
            onClick={qrCodeGenerator}
          >
            Generate
          </button>
        </LoadingApi>
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
                  disabled={isVerified}
                  className="input-field min-w-14 p-4 outline-none"
                />
              )}
              onChange={(value) => setOtp(value)}
              value={otp}
            />
            {otpError && <div className="error_text">{otpError}</div>}
          </div>

          <ErrorApiText error={isVerifyError} />

          <LoadingApi loading={isVerifyLoading}>
            {isVerified && (
              <p className="success note mt-5">Verified Successfully.</p>
            )}
            {!isVerified && (
              <button
                className="btn-secondary font-bold rounded-none mt-6 min-w-32"
                type="submit"
                disabled={!qrCode}
              >
                Verify
              </button>
            )}
          </LoadingApi>
        </div>
      </form>

      <p className="note mt-6">
        Alphaspay does not charge any fees for using MFA. If you have any
        questions or concerns, please Contact us
      </p>
      <div className="btn_wrapper text-right">
        <button
          className="header_step_btn active fl"
          onClick={isVerified && handleSubmitMfaSetup}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default MFASetup;
