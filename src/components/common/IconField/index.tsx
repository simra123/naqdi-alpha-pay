// components/IconField.js
import { Info, Visibility, VisibilityOff } from "@mui/icons-material";
import React, { ChangeEventHandler, useState } from "react";

interface Props {
  label?: string;
  type?: string;
  placeholder?: string;
  icon?: any;
  wrapperClassName?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  value?: string;
  error?: string | boolean;
  info?: string;
  inputContainerClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
}

const IconField = ({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  wrapperClassName,
  onChange,
  onBlur,
  name,
  value,
  error,
  info,
  inputContainerClassName,
  inputClassName,
  disabled,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`mb-4 text-input ${wrapperClassName}`}>
      {label && (
        <div className="flex gap-2 items-center">
          <label className="block mb-2 font-medium">{label}</label>
          {info && (
            <div className="relative flex items-center group">
              <Info className="text-blue-info mb-1 text-[18px]" />

              <div className="absolute w-96 bg-dark-gray text-white text-sm -top-[112px] rounded-large py-2 -left-[50px] hidden group-hover:block transition-opacity duration-200">
                <div className="relative p-2">
                  <p className="w-full text-center">{info}</p>

                  <div className="absolute polygon-clip bg-dark-gray w-[50px] h-[50px] rounded-large left-[33px] -bottom-[38px]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div
        className={`relative rounded-large bg-white ${inputContainerClassName}`}
      >
        {Icon && (
          <Icon className="absolute left-4 top-0 flex !h-full items-center text-gray-400" />
        )}
        <input
          type={isPasswordField ? (!showPassword ? "password" : "text") : type}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          className={`w-full p-4 bg-transparent ${inputClassName} ${
            Icon ? "pl-12" : "pl-4"
          } border-[1.5px] ${
            error
              ? "border-error-dark"
              : "border-light-gray focus:border-purple"
          } border-light-gray focus:border-purple rounded-large focus:outline-none  placeholder:text-blackGrey-placeholder`}
        />
        {isPasswordField && (
          <div
            className="absolute right-4 top-0 cursor-pointer flex !h-full items-center text-gray-400"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-error-dark text-subtitle mt-[4px] ml-4">
          {error}
        </p>
      )}
    </div>
  );
};

export default IconField;
