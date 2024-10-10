// import { FC } from "react";
// import clsx from 'clsx';
// import { ReactNode } from "react";

// interface Props {
//   isOpen: boolean;
//   children: ReactNode;
//   mode?: 'slide' | 'zoom';  // Default to 'slide'
// }

// const Modal: FC<Props> = ({ isOpen, children }) => {
//   return (
//     <>
//       <div
//         className={
//           (!isOpen
//             ? "-translate-y-full opacity-0 "
//             : "translate-y-0 opacity-100") +
//           " modal_main_wrapper fixed w-full min-h-full z-[100] bg-[rgba(0,0,0,0.6)] transition-all top-0 bottom-0 left-0 overflow-auto duration-500"
//         }
//       >
//         <div className="flex min-h-full min-w-full items-center justify-center">
//           {children}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Modal;


// import { useEffect } from 'react';
// import clsx from 'clsx';

// interface ModalProps {
//   isOpen: boolean;
//   mode?: 'slide' | 'zoom';  // Animation modes
//   children: React.ReactNode;
// }

// const Modal: React.FC<ModalProps> = ({ isOpen, mode = 'zoom', children }) => {


//   return (
//     <div
//       className={clsx(
//         "fixed inset-0 flex items-center justify-center transition-opacity z-[9999] w-full min-h-full z-[100] bg-[rgba(0,0,0,0.6)] transition-all top-0 bottom-0 left-0 overflow-auto duration-500 py-4",
//         { '-translate-y-full opacity-0': !isOpen },
//         { 'translate-y-0 opacity-100': isOpen }
//       )}
//     >
//       <div
//         className={clsx(
//           "rounded-lg transition-transform duration-500 ",
//           {
//             // Slide from top
//             'transform -translate-y-full': mode === 'slide' && !isOpen,
//             'transform translate-y-0 absolute top-0': mode === 'slide' && isOpen,

//             // Zoom effect
//             'transform scale-0': mode === 'zoom' && !isOpen,
//             'transform scale-100': mode === 'zoom' && isOpen,
//           }
//         )}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Modal;


import { useEffect } from 'react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  mode?: 'slide' | 'zoom';  // Animation modes
  children: React.ReactNode;
  className?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, mode = 'zoom', children, className }) => {

  useEffect(() => {

    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {


      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <div
      className={clsx(
        "fixed inset-0 flex items-center justify-center transition-opacity z-[9999] w-full min-h-full bg-[rgba(0,0,0,0.6)] overflow-auto duration-500",
        { 'opacity-0 pointer-events-none': !isOpen },
        { 'opacity-100 pointer-events-auto': isOpen }
      )}
    >
      <div
        className={clsx(
          "rounded-lg transition-transform duration-500 max-h-[100vh] p-3 max-w-full", // Limits modal height to 90% of the viewport height
          {
            // Slide from top
            'transform -translate-y-full': mode === 'slide' && !isOpen,
            'transform translate-y-0': mode === 'slide' && isOpen,

            // Zoom effect
            'transform scale-0': mode === 'zoom' && !isOpen,
            'transform scale-100': mode === 'zoom' && isOpen,
          }
        )}
      >

        <div className={`bg-white p-6 md:p-10 rounded-md shadow-lg inline-block my-4 max-w-full w-[576px] ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;




