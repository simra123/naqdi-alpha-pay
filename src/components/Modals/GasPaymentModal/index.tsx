"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import LoadingApi from "../../common/LoadindApi";

import LoaderButton from "../../common/LoaderButton";
import Details from "@/components/common/Details";
import { blockchain_units, unitName } from "@/constants/blockchains";
import {
  addFeeStaticWalletAdminApi,
  addFeeVirtualWalletAdminApi,
} from "@/services/admin/payments";
import { getLocalStorageValue } from "@/utils/cookies";
import { Fiats } from "@/constants/fiat";
import { WalletType } from "@/constants/types";
import useFormValidation from "@/hooks/useFormValidation";
import { paymentSchema } from "@/models/payment";
import IconField from "@/components/common/IconField";
import ErrorApiText from "@/components/common/ErrorApiText";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  walletType: string;
  walletAddress: string;
  blockchain: string;
}

let initialFormValues = {
  amount: 0,
};

const GasPaymentModal = ({
  isOpen,
  closeModal,
  walletType,
  walletAddress,
  blockchain,
}) => {
  const user = getLocalStorageValue("user");
  const [paymentDetails, setPaymentDetails] = useState<null | any>(null);
  const [
    isGasPaymentLoading,
    isGasPaymentError,
    callGasPaymentApi,
    setGasPaymentError,
  ] = useApi();

  let blockchainUnit;
  if (isOpen) {
    blockchainUnit = blockchain_units[blockchain?.toLowerCase()];
  }

  const {
    errors,
    handleChange,
    handleSubmit,
    values,
    setValues,
    validateField,
    setErrors,
  } = useFormValidation(initialFormValues, paymentSchema);

  const createVirtualGasPayment = async () => {
    await callApiHook({
      apiCall: callGasPaymentApi(
        addFeeVirtualWalletAdminApi({
          passthrough: JSON?.stringify({
            userId: user?.id,
            username: user?.username,
            email: user?.email,
          }),
          requested_amount: values?.amount,
          requested_currency: Fiats.USD,
          wallet_Address: walletAddress,
          payment_currency: blockchainUnit,
        })
      ),
      successCallBack: (response) => {
        setPaymentDetails(response);
      },
    });
  };

  const createStaticGasPayment = async () => {
    await callApiHook({
      apiCall: callGasPaymentApi(
        addFeeStaticWalletAdminApi({ wallet_address: walletAddress })
      ),
      successCallBack: (response) => {
        setPaymentDetails(response);
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setGasPaymentError();
      setValues({ amount: 0 });
    }
  }, [isOpen]);

  const resetAndClose = () => {
    setPaymentDetails({});
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose}>
      <h2 className="mb-6 font-bold text-xl">{walletType} Gas Payment</h2>

      {walletType == WalletType.Virtual && (
        <form
          className="flex flex-col gap-2 mt-8"
          onSubmit={(e) => handleSubmit(e, createVirtualGasPayment)}
        >
          <LoadingApi loading={isGasPaymentLoading}>
            {!paymentDetails?.qr_code && (
              <IconField
                value={values.amount}
                label={"Payment Amount (USD)"}
                onChange={handleChange}
                name="amount"
                type="number"
                onBlur={validateField}
                error={errors.amount}
              />
            )}

            {paymentDetails?.qr_code && (
              <>
                <Details
                  value={`${paymentDetails?.requested_amount} ${paymentDetails?.requested_currency}`}
                  label="Requested Amount"
                />
                <Details
                  value={`${paymentDetails?.payment_currency_amount} ${paymentDetails?.payment_currency}`}
                  label="Payment Amount"
                />
                <div className="flex flex-col items-center mt-4 overflow-hidden">
                  <Image
                    src={paymentDetails?.qr_code}
                    height={250}
                    width={250}
                    alt="Depoist"
                  />

                  <Details copyable value={paymentDetails?.address} />
                </div>
              </>
            )}
          </LoadingApi>
          {!paymentDetails?.qr_code && (
            <div className="flex flex-col justify-end mt-2">
              <LoaderButton
                type="submit"
                className="mt-6"
                content={`Create Payment`}
                variant="contained"
              />
            </div>
          )}
        </form>
      )}

      {walletType == WalletType.Static && (
        <>
          <LoadingApi loading={isGasPaymentLoading}>
            {paymentDetails?.qrCode && (
              <>
                <div className="flex flex-col items-center overflow-hidden">
                  <Image
                    src={paymentDetails?.qrCode}
                    height={250}
                    width={250}
                    alt="Depoist"
                  />

                  <Details copyable value={paymentDetails?.wallet_Address} />
                </div>

                <p className="mt-6 text-button text-custom-caption-gray">
                  This Address is generated for Depositing{" "}
                  {paymentDetails?.blockchain} on the {paymentDetails?.network}{" "}
                  network.
                </p>
              </>
            )}
          </LoadingApi>
          {!paymentDetails?.qrCode && (
            <div className="flex flex-col justify-end mt-2">
              <LoaderButton
                type="submit"
                className="mt-6"
                content={`Create Deposit`}
                variant="contained"
                onClick={createStaticGasPayment}
              />
            </div>
          )}
        </>
      )}
      <ErrorApiText error={isGasPaymentError} />
    </Modal>
  );
};

export default GasPaymentModal;
