import React, { ChangeEvent, ChangeEventHandler, FC } from "react";

interface TransparentInputProps {
  disabled?: boolean;
  value: string;
  label?: string;
  textarea?: boolean;
  inputClass?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
}

const TransparentInput: FC<TransparentInputProps> = ({
  disabled = true,
  value,
  label,
  textarea,
  inputClass,
  name,
  onChange,
  type,
}) => {
  return (
    <div className={`flex flex-col gap-2  ${inputClass}`}>
      {textarea ? (
        <textarea
          disabled={disabled}
          className="transparent font-semibold text-[14px]"
          name={name}
          value={value}
        />
      ) : (
        <>
          <input
            disabled={disabled}
            className={`transparent font-semibold text-[14px]`}
            value={value}
            name={name}
            min={type == "number" && 0}
            max={type == "number" && 100}
            type={type}
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
