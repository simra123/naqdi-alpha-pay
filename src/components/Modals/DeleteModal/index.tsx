import React from "react";
import Modal from "../Modal";
import LoaderButton from "../../common/LoaderButton";
import ErrorApiText from "../../common/ErrorApiText";
import { DeleteCheckIcon } from "@/assets/Svgs";

type Props = {
  isOpen: boolean;
  title: string;
  setIsOpen: (state: boolean) => void;
  handleConfirm: () => void;
  confirmLoading?: boolean;
  error?: string | boolean;
  content?: string;
};

const DeleteModal = ({
  isOpen,
  handleConfirm,
  title = "Confirmation",
  error,
  confirmLoading,
  setIsOpen,
  content = "Kindly Confirm to proceed with this request.",
}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="flex items-center justify-center mt-5">
        <DeleteCheckIcon />
      </div>
      <h2 className="text-h3.5 font-semibold mb-4 mt-8 text-center text-[38px]">
        {title}
      </h2>

      <p className="text-blackGrey-100 mt-6 text-p120 text-center">{content}</p>

      <div className="flex flex-col justify-end mt-16">
        <LoaderButton
          color="error"
          content={`Delete`}
          variant="contained"
          className="!min-w-[75px] !text-button active:!opacity-95"
          onClick={handleConfirm}
          loading={confirmLoading}
        />
      </div>

      <ErrorApiText error={error} />
    </Modal>
  );
};

export default DeleteModal;
