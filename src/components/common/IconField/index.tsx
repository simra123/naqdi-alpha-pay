// components/IconField.js
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";

const IconField = ({ label, type = "text", placeholder, icon: Icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mb-4 text-input">
      <label className="block mb-2 font-medium">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-0 flex h-full items-center text-gray-400" />
        )}
        <input
          type={isPasswordField && !showPassword ? "password" : "text"}
          placeholder={placeholder}
          className={`w-full p-4 ${
            Icon ? "pl-12" : "pl-4"
          } border-[1.5px] border-light-gray focus:border-purple rounded-large focus:outline-none  placeholder:text-blackGrey-placeholder`}
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
    </div>
  );
};

export default IconField;
