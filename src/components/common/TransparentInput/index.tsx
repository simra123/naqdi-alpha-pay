import React, { ChangeEvent, ChangeEventHandler, FC } from "react";

interface TransparentInputProps {
  disabled?: boolean;
  value: string;
  label?: string;
  textarea?: boolean;
  inputClass?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TransparentInput: FC<TransparentInputProps> = ({
  disabled = true,
  value,
  label,
  textarea,
  inputClass,
  onChange,
}) => {
  return (
    <div className={`flex flex-col gap-2  ${inputClass}`}>
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
            className={`transparent font-semibold text-[14px]`}
            value={value}
            onChange={onChange}
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
