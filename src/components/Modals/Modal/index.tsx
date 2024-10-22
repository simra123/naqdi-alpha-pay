import { useEffect } from "react";
import clsx from "clsx";
import { CancelIcon } from "@/assets/Svgs";

interface ModalProps {
  isOpen: boolean;
  mode?: "slide" | "zoom"; // Animation modes
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  mode = "zoom",
  children,
  className,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <div
      className={clsx(
        "fixed inset-0 flex items-center justify-center transition-opacity z-[9999] w-full min-h-full bg-[rgba(0,0,0,0.6)] overflow-auto duration-500",
        { "opacity-0 pointer-events-none": !isOpen },
        { "opacity-100 pointer-events-auto": isOpen }
      )}
    >
      <div
        className={clsx(
          "rounded-lg transition-transform duration-500 max-h-[100vh] p-3 max-w-full", // Limits modal height to 90% of the viewport height
          {
            // Slide from top
            "transform -translate-y-full": mode === "slide" && !isOpen,
            "transform translate-y-0": mode === "slide" && isOpen,

            // Zoom effect
            "transform scale-0": mode === "zoom" && !isOpen,
            "transform scale-100": mode === "zoom" && isOpen,
          }
        )}
      >
        <div
          className={`bg-white relative p-6 md:p-10 rounded-md shadow-lg inline-block my-4 max-w-full w-[576px] ${className}`}
        >
          {onClose && (
            <button
              className="absolute top-5 right-5 active:bg-red-error-dark transition-all rounded-full w-9 h-9 aspect-square bg-red-cancel flex justify-center items-center z-30"
              onClick={onClose}
            >
              <CancelIcon />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
