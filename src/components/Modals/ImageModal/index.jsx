import React from "react";
import Modal from "../Modal";

const ImageModal = ({ isOpen, setIsOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={() => setIsOpen(null)}
      className="!w-auto"
    >
      <div className="relative flex justify-center items-center h-full">
        <img src={isOpen} alt="image-zoom" className="w-full" />
      </div>
    </Modal>
  );
};

export default ImageModal;
