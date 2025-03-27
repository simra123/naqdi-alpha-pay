import React, { useEffect, useState } from "react";

import Modal from "../Modal";
import IconSelectBox from "../../common/IconSelectBox";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { networks_available, unitName } from "@/constants/blockchains";
import { callApiHook } from "@/utils/apifuncs";
import { getAllWalletBalancesApi } from "@/services/wallet";
import {
  createWithdrawalApi,
  getWithdrawableCurrenciesListApi,
} from "@/services/withdrawal";
import { setNotification } from "@/store/slices/modal.Slice";
import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import LoadingApi from "../../common/LoadindApi";
import ErrorApiText from "../../common/ErrorApiText";
import OtpInput from "react-otp-input";
import { Info } from "@mui/icons-material";
import useFormValidation from "@/hooks/useFormValidation";
import {
  emptySchema,
  getWithdrawalSchema,
  otpSchema,
} from "@/models/withdrawal";
import { getFeesApi } from "@/services/common";
import { roundToPrecision } from "@/utils/math";
import { capitalize, formattedBlockchainName } from "@/utils/dataFormatters";
import { ExternalWithdrawal } from "@/models/ExternalWithdrawal";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
}

const initalFormValues = {
  transactionHash: "",
  senderAddress: "",
  internalNote: "",
  externalNote: "",
};

const ExternalWithdrawalModal = ({ isOpen, toggleHandler }: Props) => {
  const [
    isWithdrawalLoading,
    isWithdrawalError,
    callWithdrawalApi,
    setWithdrawalError,
  ] = useApi({ notify: true });

  // Initialize useFormValidation
  const {
    errors,
    handleChange,
    handleSubmit,
    values,
    setValues,
    validateField,
    setErrors,
  } = useFormValidation(initalFormValues, ExternalWithdrawal);

  const handleExternalWithdrawal = async () => {
    await callApiHook({
      apiCall: callWithdrawalApi(),
      successCallBack(response) {},
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={toggleHandler}>
      <h2 className="mb-4 font-semibold text-h3.5">External</h2>

      <form
        className="flex flex-col gap-2 mt-8"
        onSubmit={(e) =>
          handleSubmit(
            e,
            () => {},
            () => console.log("Something went wrong")
          )
        }
      >
        <IconField
          value={values.transactionHash}
          label="Transaction Hash"
          onChange={handleChange}
          placeholder="Enter Transacion hash"
          name="transactionHash"
          onBlur={validateField}
          error={errors.transactionHash}
        />

        <IconField
          value={values.senderAddress}
          label="Sender Wallet Address"
          placeholder="Enter Sender Wallet Address"
          onChange={handleChange}
          name="senderAddress"
          onBlur={validateField}
          error={errors.senderAddress}
        />

        <div className="flex flex-col gap-2">
          <label className="block mb-1 font-medium">Internal Note</label>
          <textarea
            value={values.internalNote}
            name="internalNote"
            placeholder="Your internal note Here"
            onChange={handleChange}
            className={`border-b border-gray p-4 resize-none text-gray-400 font-medium w-full min-h-36 bg-light-gray outline-none`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block mb-1 font-medium">External Note</label>
          <textarea
            value={values.externalNote}
            name="externalNote"
            placeholder="Your Message Here"
            onChange={handleChange}
            className={`border-b border-gray p-4 resize-none text-gray-400 font-medium w-full min-h-36 bg-light-gray outline-none`}
          />
        </div>

        <div className="flex flex-col justify-end mt-4">
          <LoaderButton type="submit" content="Approve" variant="contained" />
        </div>
      </form>

      <ErrorApiText error={isWithdrawalError} />
    </Modal>
  );
};

export default ExternalWithdrawalModal;
