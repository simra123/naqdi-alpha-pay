import React, { useEffect } from "react";
import Modal from "../Modal";

import IconField from "../IconField";
import LoaderButton from "../LoaderButton";
import ErrorApiText from "../ErrorApiText";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  handleSubmit: any;
  loading: boolean;
  error: boolean | string;
  data: any;
  setData: any;
}

const KYCReasonModal = ({
  isOpen,
  toggleHandler,
  handleSubmit,
  loading,
  error,
  data,
  setData,
}: Props) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((pre) => ({ ...pre, [name]: value }));
  };

  useEffect(() => {
    if (isOpen) {
      setData({ reason: "" });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen}>
      <div className="modal_content_wrapper bg-white p-10 rounded-md shadow-lg w-[547px] max-w-full">
        <h2 className="text-h3.5 font-semibold mb-4">Reason For Rejection</h2>

        <form
          className="mt-8 flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <IconField
            value={data.reason}
            name="reason"
            label="Reason"
            onChange={handleInputChange}
          />

          <div className="flex flex-col justify-end mt-4">
            <LoaderButton
              type="submit"
              content={`Reject`}
              variant="contained"
              loading={loading}
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

        <ErrorApiText error={error} />
      </div>
    </Modal>
  );
};

export default KYCReasonModal;
