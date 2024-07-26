// components/IconField.js
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`mb-4 text-input ${wrapperClassName}`}>
      <label className="block mb-2 font-medium">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-0 flex h-full items-center text-gray-400" />
        )}
        <input
          type={isPasswordField && !showPassword ? "password" : "text"}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          value={value}
          placeholder={placeholder}
          className={`w-full p-4 ${Icon ? "pl-12" : "pl-4"} border-[1.5px] ${
            error
              ? "border-error-dark"
              : "border-light-gray focus:border-purple"
          } border-light-gray focus:border-purple rounded-large focus:outline-none  placeholder:text-blackGrey-placeholder`}
        />
        {isPasswordField && (
          <div
            className="absolute right-4 top-0 cursor-pointer flex h-full items-center text-gray-400"
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
