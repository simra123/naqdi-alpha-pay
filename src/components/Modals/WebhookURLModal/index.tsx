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

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshHandler: () => void;
}

const WebhookURLModal = ({ isOpen, toggleHandler, refreshHandler }: Props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({ url: "" });
  const [isURLLoading, isURLError, callURLApi] = useApi();

  const handleWebhook = async () => {
    await callApiHook({
      apiCall: callURLApi(addWebhookURLAPI({ url: data.url })),
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
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((pre) => ({ ...pre, [name]: value }));
  };

  useEffect(() => {
    if (isOpen) {
      setData({ url: "" });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen}>
     
        <h2 className="text-h3.5 font-semibold mb-4">Add Webhook URL</h2>

        <form className="mt-8 flex flex-col gap-2">
          <IconField
            value={data.url}
            name="url"
            label="Webhook URL"
            onChange={handleInputChange}
          />

          <div className="flex flex-col justify-end mt-4">
            <LoaderButton
              type="submit"
              content={`Update`}
              variant="contained"
              onClick={handleWebhook}
              loading={isURLLoading}
            />

            <button
              type="button"
              className="text-black-100 px-4 py-2 mt-2"
              onClick={toggleHandler}
            >
              Cancel
            </button>
          </div>
        </form>

        <ErrorApiText error={isURLError} />
    
    </Modal>
  );
};

export default WebhookURLModal;
