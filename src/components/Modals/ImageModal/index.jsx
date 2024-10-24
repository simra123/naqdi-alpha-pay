import React from "react";
import Modal from "../Modal";
import { Close } from "@mui/icons-material";

const ImageModal = ({ isOpen, setIsOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={() => setIsOpen(null)}
      className="!w-auto"
    >
      <div className="flex items-center justify-center h-full relative">
        <img src={isOpen} alt="image-zoom" className="w-full" />
      </div>
    </Modal>
  );
};

export default ImageModal;
