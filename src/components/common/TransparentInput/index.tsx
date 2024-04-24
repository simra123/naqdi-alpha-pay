import React, { FC } from "react";

interface TransparentInputProps {
  disabled?: boolean;
  value: string;
  label?: string;
  textarea?: boolean;
}

const TransparentInput: FC<TransparentInputProps> = ({
  disabled = true,
  value,
  label,
  textarea,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {textarea ? (
        <textarea
          disabled={disabled}
          className="transparent font-semibold text-[14px]"
          value={value}
        />
      ) : (
        <>
          <input
            disabled={disabled}
            className="transparent font-semibold text-[14px]"
            value={value}
          />
          <span className="text-[12px] font-semibold  text-gray-500">
            {label}
          </span>
        </>
      )}
    </div>
  );
};

export default TransparentInput;
