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
import { generateMFAForAdminApi } from "@/services/auth";

const GenerateQRCodeModal = ({ isOpen, setIsOpen }) => {
  const [isQRCodeLoading, isQRCodeError, callQRCodeApi] = useApi();

  const [qrcode, setQRCode] = useState(null);

  const createQRCode = async () => {
    await callApiHook({
      apiCall: callQRCodeApi(generateMFAForAdminApi()),
      successCallBack: (response: any) => {
        console.log("I am response from admin api response ", response);
        setQRCode(response);
      },
    });
  };

  const closeModal = () => {
    setIsOpen(false);
  }; 

  return (
    <Modal isOpen={isOpen}>
      <div className="modal_content_wrapper bg-white px-6 p-8 sm:px-8 rounded-md shadow-lg w-[547px] max-w-[90%]">
        <h2 className="text-xl font-bold mb-6">Secure You Account</h2>

        <LoadingApi loading={isQRCodeLoading}>
          {qrcode && (
            <>
              <div className="flex flex-col items-center overflow-hidden">
                <Image src={qrcode.qrCodeUrl} height={250} width={250} alt="mfa code" />

                <Details copyable value={qrcode} />
              </div>
            </>
          )}
        </LoadingApi>

        <ErrorApiText error={isQRCodeError} />

        <div className="flex flex-col justify-end mt-2">
          <LoaderButton
            type="submit"
            className="mt-6"
            content={`Generate Secret`}
            variant="contained"
            onClick={createQRCode}
          />

          <button
            type="button"
            className="text-black-100 px-4 py-2 mt-2"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GenerateQRCodeModal;
