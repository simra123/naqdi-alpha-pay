import { FC } from "react";
import { ReactNode } from "react";

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
          " modal_main_wrapper fixed w-full min-h-full z-[100] bg-[rgba(0,0,0,0.6)] transition-all top-0 bottom-0 left-0 overflow-auto duration-500"
        }
      >
        <div className="flex min-h-full min-w-full items-center justify-center">
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
