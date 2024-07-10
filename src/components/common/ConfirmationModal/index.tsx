import React from "react";
import Modal from "../Modal";
import OTPInput from "react-otp-input";
import LoaderButton from "../LoaderButton";
import { Button } from "@mui/material";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  handleConfirm: () => void;
  confirmLoading?: boolean;
  content?: string;
};

const ConfirmationModal = ({
  isOpen,
  handleClose,
  handleConfirm,
  title,
  confirmLoading,
  content = "Kindly Confirm to proceed with this request.",
}: Props) => {
  return (
    <Modal isOpen={isOpen}>
      <div className="min-h-full p-8 flex place-items-center place-content-center">
        <div className="w-[650px] max-w-[75%]">
          <div className="request_box shadow-md-border py-6 bg-white gap-4">
            <div className="flex flex-col gap-3 px-4">
              <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <div className="modal_body my-4">
              <div className="data-row w-full py-3 px-5">
                <p className="primary-color">{content}</p>
              </div>
            </div>
            <div className="flex gap-4 justify-end px-5">
              <Button variant="text" onClick={handleClose} color="primary">
                Cancel
              </Button>
              <LoaderButton
                content={"Confirm"}
                loading={confirmLoading}
                onClick={handleConfirm}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
