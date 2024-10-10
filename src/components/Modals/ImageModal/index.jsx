import React from "react";
import Modal from "../Modal";
import { Close } from "@mui/icons-material";

const ImageModal = ({ isOpen, setIsOpen }) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} className="!w-auto">

      <div className="flex items-center justify-center h-full relative">
      <button
        className="p-1 absolute rounded right-4 top-4 bg-red-button flex"
        onClick={() => setIsOpen(null)}
      >
        <Close className="text-white text-[18px]" />
      </button>
        <img src={isOpen} alt="image-zoom" className="w-full" />
      </div>
    </Modal>
  );
};

export default ImageModal;
