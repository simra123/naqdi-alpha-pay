// components/IconField.js

import React, { ChangeEventHandler, useState } from "react";
import { MdInfo, MdVisibility, MdVisibilityOff } from "react-icons/md";

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
  iconClassName?: string;
  disabled?: boolean;
  inputProps?: {}
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
  iconClassName,
  disabled,
  inputProps
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`mb-4 text-input ${wrapperClassName}`}>
      {label && (
        <div className="flex items-center gap-2">
          <label className="block mb-2 font-medium">{label}</label>
          {info && (
            <div className="group relative flex items-center">
              <MdInfo className="mb-1 text-[18px] text-blue-info" />

              <div className="hidden group-hover:block -top-[112px] -left-[50px] absolute bg-dark-gray py-2 rounded-large w-96 text-white text-sm transition-opacity duration-200">
                <div className="relative p-2">
                  <p className="w-full text-center">{info}</p>

                  <div className="-bottom-[38px] left-[33px] absolute bg-dark-gray rounded-large w-[50px] h-[50px] polygon-clip"></div>
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
          <Icon className="top-0 left-4 absolute flex items-center w-[16px] !h-full text-gray-400" />
        )}
        <input
          type={isPasswordField ? (!showPassword ? "password" : "text") : type}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          {...inputProps}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          className={`w-full p-4 bg-transparent ${inputClassName} ${Icon ? "pl-12" : "pl-4"
            } border-[1.5px] ${error
              ? "border-error-dark"
              : "border-gray focus:border-purple"
            }  focus:border-purple rounded-large focus:outline-none  placeholder:text-blackGrey-placeholder`}
        />
        {isPasswordField && (
          <div
            className={`absolute right-4 top-0 cursor-pointer flex !h-full items-center text-gray-400 ${iconClassName}`}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-[4px] ml-4 text-red-error-dark text-subtitle">
          {error}
        </p>
      )}
    </div>
  );
};

export default IconField;
