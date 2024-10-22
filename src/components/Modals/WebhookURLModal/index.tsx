import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";

import { setNotification } from "@/store/slices/modal.Slice";

import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import ErrorApiText from "../../common/ErrorApiText";
import { addWebhookURLAPI, generateApiKeyApi } from "@/services/Integration";
import useFormValidation from "@/hooks/useFormValidation";
import { urlSchema } from "@/models/webhook";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshHandler: () => void;
  initialWebhookValue: string | null;
}

const initalValue = { url: "" };

const WebhookURLModal = ({
  isOpen,
  toggleHandler,
  refreshHandler,
  initialWebhookValue,
}: Props) => {
  const dispatch = useDispatch();
  const [isURLLoading, isURLError, callURLApi] = useApi();

  const {
    errors,
    handleChange,
    handleSubmit,
    values,
    setValues,
    validateField,
  } = useFormValidation(initalValue, urlSchema);

  const handleWebhook = async () => {
    await callApiHook({
      apiCall: callURLApi(addWebhookURLAPI({ url: values.url })),
      successCallBack: () => {
        dispatch(
          setNotification({
            message: "Webhook URL Updated Successfully",
            status: "success",
          })
        );
        toggleHandler();
        refreshHandler();
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      setValues({ url: initialWebhookValue });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={toggleHandler}>
      <h2 className="text-h3.5 font-semibold mb-4">Add Webhook URL</h2>

      <form
        className="mt-8 flex flex-col gap-2"
        onSubmit={(e) =>
          handleSubmit(e, handleWebhook, () =>
            console.log("Something went wrong")
          )
        }
      >
        <IconField
          value={values.url}
          name="url"
          onBlur={validateField}
          label="Webhook URL"
          error={errors?.url}
          onChange={handleChange}
        />

        <div className="flex flex-col justify-end mt-4">
          <LoaderButton
            type="submit"
            content={`Update`}
            variant="contained"
            loading={isURLLoading}
          />

          {/* <button
            type="button"
            className="text-black-100 px-4 py-2 mt-2"
            onClick={toggleHandler}
          >
            Cancel
          </button> */}
        </div>
      </form>

      <ErrorApiText error={isURLError} />
    </Modal>
  );
};

export default WebhookURLModal;
