import React from "react";
import Modal from "../Modal";
import { Close } from "@mui/icons-material";

const ImageModal = ({ isOpen, setIsOpen }) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <button
        className="btn-status error !min-w-8 !px-3 absolute right-4 top-4"
        onClick={() => setIsOpen(null)}
      >
        <Close color="error a" />
      </button>

      <div className="grid grid-cols-1 h-full place-items-center">
        <img src={isOpen} alt="image-zoom" className="w-2/3" />
      </div>
    </Modal>
  );
};

export default ImageModal;
