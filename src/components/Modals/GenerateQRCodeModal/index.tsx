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
import {
  generateMFAForAdminApi,
  verifyMFAForAdminApi,
} from "@/services/admin/auth";
import OTPInput from "react-otp-input";

import { updateMfaInCookie } from "@/utils/cookies";
import { getLocalStorageValue } from "@/utils/cookies";
import { QRCodeCanvas } from "qrcode.react";
import { MdInfo } from "react-icons/md";

const GenerateQRCodeModal = ({ isOpen, setIsOpen, setIsMfaVerified }) => {
  const user = getLocalStorageValue("user");
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
      <h2 className="mb-6 font-bold text-xl">Secure You Account</h2>

      {step == 1 ? (
        qrcode && (
          <>
            <div className="flex flex-col items-center overflow-hidden">
              <div className="flex justify-center mt-6 qr_code">
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

              <p className="mt-4 font-semibold text-black-100">
                Please scan the code into your autheticator app or manually
                enter the secret. Then press next to verify.
              </p>
            </div>
          </>
        )
      ) : (
        <>
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <label className="block mb-2 font-medium">Enter Code</label>

              <div className="group relative flex items-center">
                <MdInfo className="mb-1 text-[18px] text-blue-info" />

                <div className="hidden group-hover:block -top-[112px] -left-[50px] absolute bg-dark-gray py-2 rounded-large w-96 text-white text-sm transition-opacity duration-200">
                  <div className="relative p-2">
                    <p className="w-full text-center">
                      Use your Google Autheticator code here
                    </p>
                    <div className="-bottom-[38px] left-[33px] absolute bg-dark-gray rounded-large w-[50px] h-[50px] polygon-clip"></div>
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
                  className="bg-blackGrey-filled-input p-2 md:p-4 py-4 border border-light-gray rounded-large outline-none !w-14 max-w-full"
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
            className="mt-2 px-4 py-2 text-black-100"
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
