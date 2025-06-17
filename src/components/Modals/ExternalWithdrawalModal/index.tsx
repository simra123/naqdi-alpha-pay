import React from "react";

import Modal from "../Modal";

import { useApi } from "@/hooks/useApi";

import { callApiHook } from "@/utils/apifuncs";

import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";

import ErrorApiText from "../../common/ErrorApiText";

import useFormValidation from "@/hooks/useFormValidation";

import { ExternalWithdrawal } from "@/models/externalWithdrawal";
import { externalWithdrawalApproveAdminApi } from "@/services/admin/withdrawal";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshHandler: () => void;
  withdrawId: any;
  blockchain: string;
}

const initalFormValues = {
  transactionHash: "",
  senderAddress: "",
  internalNote: "",
};

const ExternalWithdrawalModal = ({
  isOpen,
  toggleHandler,
  withdrawId,
  refreshHandler,
  blockchain,
}: Props) => {
  const dispatch = useDispatch();
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
  } = useFormValidation(initalFormValues, ExternalWithdrawal(blockchain));

  const handleExternalWithdrawal = async () => {
    await callApiHook({
      apiCall: callWithdrawalApi(
        externalWithdrawalApproveAdminApi(withdrawId, {
          sender_address: values?.senderAddress,
          hash: values?.transactionHash,
          internal_note: values?.internalNote,
        })
      ),
      successCallBack(response) {
        refreshHandler();
        dispatch(
          setNotification({
            message: "External Withdrawal has been processed successfuly.",
            status: "success",
          })
        );
        toggleHandler();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={toggleHandler}>
      <h2 className="mb-4 font-semibold text-h3.5">External</h2>

      <form
        className="flex flex-col gap-2 mt-8"
        onSubmit={(e) => handleSubmit(e, handleExternalWithdrawal)}
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

        <div className="flex flex-col justify-end mt-4">
          <LoaderButton
            type="submit"
            content="Approve"
            variant="contained"
            loading={isWithdrawalLoading}
          />
        </div>
      </form>

      <ErrorApiText error={isWithdrawalError} />
    </Modal>
  );
};

export default ExternalWithdrawalModal;
