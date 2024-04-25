import React, { FC } from "react";

interface WrapperProps {
  title: string;
  children: React.ReactNode;
  col?: boolean;
  align?: boolean;
}

const DetailsWrapper: FC<WrapperProps> = ({ title, children, align, col }) => {
  return (
    <div
      className={`grid-template-details ${
        col ? "items-start" : "items-center "
      }`}
    >
      <span
        className={`title text-[14px] font-bold text-gray-500 ${
          align && "pb-5"
        }`}
      >
        {title}
      </span>
      {col ? <div className="flex flex-col gap-6">{children}</div> : children}
    </div>
  );
};

export default DetailsWrapper;
