import React from "react";
import Modal from "../Modal";
import LoaderButton from "../LoaderButton";
import ErrorApiText from "../ErrorApiText";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  handleConfirm: () => void;
  confirmLoading?: boolean;
  error?: string | boolean;
  content?: string;
};

const ConfirmationModal = ({
  isOpen,
  handleClose,
  handleConfirm,
  title= "Confirmation",
  error,
  confirmLoading,
  content = "Kindly Confirm to proceed with this request.",
}: Props) => {
  return (
    <Modal isOpen={isOpen}>
      <div className="modal_content_wrapper bg-white p-10 rounded-md shadow-lg w-[547px] max-w-full">
        <h2 className="text-h3.5 font-semibold mb-4">{title}</h2>


        <p className="text-black-100">{content}</p>

        <form className="mt-8 flex flex-col gap-2">
          <div className="flex flex-col justify-end mt-4">
            <LoaderButton
              type="submit"
              content={`Confirm`}
              variant="contained"
              onClick={handleConfirm}
              loading={confirmLoading}
            />

            <button
              type="button"
              className="text-black-100 px-4 py-2 mt-2"
              onClick={handleClose}
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

export default ConfirmationModal;
