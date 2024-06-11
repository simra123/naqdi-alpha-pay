import { FC } from "react";
import "./modal.scss";
import { ReactNode, useState } from "react";

interface Props {
  isOpen: boolean;
  children: ReactNode;
}

const Modal: FC<Props> = ({ isOpen, children }) => {
  return (
    <>
      <div
        className={
          (!isOpen
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100") +
          " modal_main_wrapper fixed w-full min-h-full z-index-100 transition-all top-0 bottom-0 left-0 overflow-auto duration-500"
        }
      >
        {children}
      </div>
    </>
  );
};

export default Modal;
