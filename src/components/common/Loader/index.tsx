import React from "react";

const Loader = ({
  bg = false,
  className,
  wrapperClassName,
}: {
  bg?: boolean;
  className?: string;
  wrapperClassName?: string;
}) => {
  return (
    <div className={`w-full text-center  ${wrapperClassName}`}>
      {bg ? (
        <div className={`w-16 p-2 rounded-full bg-pink-gradient`}>
          <div className={`loader mx-auto `}></div>
        </div>
      ) : (
        <div className={`loader mx-auto ${className}`}></div>
      )}
    </div>
  );
};

export default Loader;
