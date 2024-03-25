import { useState } from "react";

import "./modal.scss";

const Modal = ({ isOpen, setIsOpen, children }) => {
  return (
    <>
      <div
        className={
          (!isOpen ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100") +
          " modal_main_wrapper fixed w-full min-h-full z-index-100 transition-all top-0 bottom-0 overflow-auto duration-1000"
        }
      >
        {children}
      </div>
    </>
  );
};

export default Modal;
