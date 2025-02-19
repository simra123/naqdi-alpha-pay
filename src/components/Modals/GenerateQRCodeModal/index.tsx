"use client";

import React, { useState } from "react";
import Modal from "../Modal";
import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import LoadingApi from "../../common/LoadindApi";
import ErrorApiText from "../../common/ErrorApiText";

import LoaderButton from "../../common/LoaderButton";
import Details from "@/components/common/Details";
import { generateMFAForAdminApi, verifyMFAForAdminApi } from "@/services/auth";
import OTPInput from "react-otp-input";
import { Info } from "@mui/icons-material";
import { updateMfaInCookie } from "@/utils/cookies";
import useLocalStorage from "@/hooks/useLocalStorage";
import { QRCodeCanvas } from "qrcode.react";

const GenerateQRCodeModal = ({ isOpen, setIsOpen, setIsMfaVerified }) => {
  const user = useLocalStorage("user");
  const [isQRCodeLoading, isQRCodeError, callQRCodeApi] = useApi();
  const [isVerificationLoading, isVerificationError, callVerificationApi] =
    useApi({ notify: true });

  const [qrcode, setQRCode] = useState(null);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const createQRCode = async () => {
    await callApiHook({
      apiCall: callQRCodeApi(generateMFAForAdminApi()),
      successCallBack: (response: any) => {

        setQRCode(response);
      },
    });
  };

  const handleStepChange = (step: number) => () => {
    setStep(step);
  };

  const handleVerification = async () => {
    await callApiHook({
      apiCall: callVerificationApi(verifyMFAForAdminApi({ token: otp })),
      successCallBack: (response: any) => {

        setIsMfaVerified(true);
        updateMfaInCookie(true);
        setIsOpen(false);
      },
    });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <h2 className="text-xl font-bold mb-6">Secure You Account</h2>

      {step == 1 ? (
        qrcode && (
          <>
            <div className="flex flex-col items-center overflow-hidden">
              <div className="qr_code mt-6 flex justify-center">
                {qrcode && qrcode.secret && (
                  <QRCodeCanvas
                    value={`otpauth://totp/Alphapay?secret=${encodeURIComponent(
                      qrcode?.secret
                    )}&issuer=${user?.email}
            `}
                    height={250}
                    width={250}
                  />
                )}
              </div>

              <Details copyable value={qrcode?.secret} />

              <p className="text-black-100 font-semibold mt-4">
                Please scan the code into your autheticator app or manually
                enter the secret. Then press next to verify.
              </p>
            </div>
          </>
        )
      ) : (
        <>
          <div className="mt-2">
            <div className="flex gap-2 items-center">
              <label className="block mb-2 font-medium">Enter Code</label>

              <div className="relative flex items-center group">
                <Info className="text-blue-info mb-1 text-[18px]" />

                <div className="absolute w-96 bg-dark-gray text-white text-sm -top-[112px] rounded-large py-2 -left-[50px] hidden group-hover:block transition-opacity duration-200">
                  <div className="relative p-2">
                    <p className="w-full text-center">
                      Use your Google Autheticator code here
                    </p>
                    <div className="absolute polygon-clip bg-dark-gray w-[50px] h-[50px] rounded-large left-[33px] -bottom-[38px]"></div>
                  </div>
                </div>
              </div>
            </div>
            <OTPInput
              numInputs={6}
              containerStyle={{
                display: "flex",
                gap: "1rem",
                marginTop: "6px",
                flexWrap: "wrap",
              }}
              renderInput={(props) => (
                <input
                  {...props}
                  className="!w-14 p-2 py-4 max-w-full md:p-4 rounded-large outline-none border border-light-gray bg-blackGrey-filled-input"
                />
              )}
              onChange={(value) => setOtp(value)}
              value={otp}
            />
          </div>
        </>
      )}

      <ErrorApiText error={isQRCodeError || isVerificationError} />

      <div className="flex flex-col justify-end mt-2">
        {qrcode?.qrCodeUrl ? (
          <LoaderButton
            className="mt-6"
            loading={isVerificationLoading}
            content={step == 1 ? `Next` : "Verify"}
            variant="contained"
            onClick={step == 1 ? handleStepChange(2) : handleVerification}
          />
        ) : (
          <LoaderButton
            type="submit"
            className="mt-6"
            loading={isQRCodeLoading}
            content={`Generate Secret`}
            variant="contained"
            onClick={createQRCode}
          />
        )}

        {step == 2 && (
          <button
            type="button"
            className="text-black-100 px-4 py-2 mt-2"
            onClick={handleStepChange(1)}
          >
            Back
          </button>
        )}
      </div>
    </Modal>
  );
};

export default GenerateQRCodeModal;
