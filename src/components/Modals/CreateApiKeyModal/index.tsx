import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";

import { setNotification } from "@/store/slices/modal.Slice";

import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import ErrorApiText from "../../common/ErrorApiText";
import { generateApiKeyApi } from "@/services/Integration";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshHandler: () => void;
}

const CreateApiKeyModal = ({
  isOpen,
  toggleHandler,
  refreshHandler,
}: Props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({ keyName: "" });
  const [isKeyLoading, isKeyError, callNewKeyApi] = useApi();

  const handleApiKeyGeneration = async () => {
    await callApiHook({
      apiCall: callNewKeyApi(generateApiKeyApi({ name: data.keyName })),
      successCallBack: () => {
        dispatch(
          setNotification({
            message: "API Key Created Successfully",
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
      setData({ keyName: "" });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen}>
      <div className="modal_content_wrapper bg-white p-10 rounded-md shadow-lg w-[547px] max-w-full">
        <h2 className="text-h3.5 font-semibold mb-4">Add API KEY</h2>

        <form className="mt-8 flex flex-col gap-2">
          <IconField
            value={data.keyName}
            name="keyName"
            label="Key Name"
            onChange={handleInputChange}
          />

          <div className="flex flex-col justify-end mt-4">
            <LoaderButton
              type="submit"
              content={`Create API Key`}
              variant="contained"
              onClick={handleApiKeyGeneration}
              loading={isKeyLoading}
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

        <ErrorApiText error={isKeyError} />
      </div>
    </Modal>
  );
};

export default CreateApiKeyModal;
