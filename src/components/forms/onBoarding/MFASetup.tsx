"use client";
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import OtpInput from "react-otp-input";
import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import { generateMFACodeApi, MfaSetupApi } from "@/services/onBoarding";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import { STEPS } from "@/constants/onboarding";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "@/store/slices/onboarding.slice";
import useGetUserDetaiils from "@/hooks/useGetUserDetaiils";
import LoaderButton from "@/components/common/LoaderButton";

interface QrCode {
  secret: string | null;
}

const MFASetup = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.user?.data);
  const [isQrCodeLoading, isQrCodeError, callQrCodeApi] = useApi();
  const [isVerifyLoading, isVerifyError, callVerifyApi] = useApi();

  const { getUserDetails } = useGetUserDetaiils();

  const [otp, setOtp] = useState(null);
  const [qrCode, setQrCode] = useState<QrCode>({ secret: null });
  const [otpError, setOtpError] = useState(null);
  const [isVerified, setIsVerfied] = useState(null);

  useEffect(() => {
    if (!qrCode?.secret) {
      setQrCode({ secret: user?.userDetails?.mfa_secret });
    }
  }, [user]);

  const qrCodeGenerator = async () => {
    await callApiHook({
      apiCall: callQrCodeApi(generateMFACodeApi()),
      successCallBack: (response) => {
        console.log(response, "qr code generated response");
        setQrCode({ secret: response?.secret });
        getUserDetails();
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      return setOtpError("Please Enter Otp");
    }
    if (otp && otp.length < 6) {
      return setOtpError("Otp is not valid");
    }
    if (otp) {
      setOtpError(null);
      await callApiHook({
        apiCall: callVerifyApi(MfaSetupApi({ token: otp })),
        successCallBack: () => {
          setIsVerfied(true);
          getUserDetails();
        },
      });
    }
  };

  const handleSubmitMfaSetup = () => {
    dispatch(
      setStep({
        previous_step: STEPS.MFASETUP,
        current_step: STEPS.FEESETUP,
        next_step: STEPS?.IDENTITYCHECK,
      })
    );
  };

  return (
    <div className="bg-white rounded-small p-12 flex flex-col gap-5 mt-8">
      <h4 className="text-black-100 text-h3.5 font-semibold">
        Phone Validation
      </h4>
      <p className="text-button text-black-100">
        MFA is a simple best practice that uses Google Authenticator to add an
        extra layer of protection for your account.
      </p>

      <div className="form_steps mt-4">
        <h4 className="text-p120 text-black-100 font-semibold">
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

      <div className="form_steps mt-6 w-fit">
        <h4 className="text-p120 text-black-100 font-semibold">
          STEP 2: Generate and Scan the QR Code
        </h4>
        <div className="qr_code mt-6 flex justify-center">
          {qrCode && qrCode.secret && (
            <QRCodeCanvas
              value={`otpauth://totp/Alphapay?secret=${encodeURIComponent(
                qrCode?.secret
              )}&issuer=${user?.email}
            `}
              width={200}
              height={200}
            />
          )}
        </div>
        <ErrorApiText error={isQrCodeError} />

        {!user?.userDetails?.mfa_secret && (
          <LoaderButton
            content={"Generate Code"}
            loading={isQrCodeLoading}
            onClick={qrCodeGenerator}
            variant={"contained"}
          />
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form_steps mt-8">
          <h4 className="text-p120 text-black-100 font-semibold">
            STEP 3: Enter your personal generated MFA Code (6-Digit Code)
          </h4>
          <p className="text-lg mt-3">
            Make a note of the MFA code that appears on your device and enter
            that code in the box below, and then choose Verify.
          </p>
          <div className="mt-8">
            <OtpInput
              numInputs={6}
              containerStyle={{
                display: "flex",

                gap: "1rem",
              }}
              renderInput={(props) => (
                <input
                  {...props}
                  disabled={isVerified}
                  className="!w-10 md:!w-14 p-2 py-4 max-w-full md:p-4 rounded-large outline-none border border-light-gray bg-blackGrey-filled-input"
                />
              )}
              onChange={(value) => setOtp(value)}
              value={otp}
            />
            {otpError && <div className="error_text">{otpError}</div>}
          </div>

          {isVerified && (
            <p className="success note mt-5">Verified Successfully.</p>
          )}

          <ErrorApiText error={isVerifyError} />

          {!user?.userDetails?.mfa && (
            <div className="mt-12 max-w-[360px]">
              <LoaderButton
                content={"Verify"}
                loading={isVerifyLoading}
                type="submit"
                variant={"contained"}
              />
            </div>
          )}
        </div>
      </form>

      <p className="text-black-100 mt-4">
        Alphaspay does not charge any fees for using MFA. If you have any
        questions or concerns, please Contact us
      </p>

      {user?.userDetails?.mfa_secret && user?.userDetails?.mfa && (
        <div className="mt-8 max-w-[360px]">
          <LoaderButton
            content={"Continue"}
            onClick={handleSubmitMfaSetup}
            type="submit"
            variant={"contained"}
          />
        </div>
      )}
    </div>
  );
};

export default MFASetup;
