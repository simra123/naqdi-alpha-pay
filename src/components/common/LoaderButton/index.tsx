import { Button, CircularProgress } from "@mui/material";
import React from "react";
import Loader from "../Loader";

interface Props {
  loading?: boolean;
  onClick?: () => void;
  variant?: "contained" | "outlined";
  content: any;
  disabled?: boolean;
  type?: "reset" | "submit";
  className?: string;
}

const LoaderButton = ({
  loading,
  onClick,
  variant,
  content,
  disabled,
  type,
  className,
}: Props) => {
  return (
    <div className="flex justify-center">
      <button
        className={`transition-[width]  ease-in-out ${className} ${
          disabled ? "!bg-disabled !bg-none !text-purple-100 font-medium" : ""
        } ${
          loading
            ? `${
                variant == "contained"
                  ? "w-16 p-2 rounded-full bg-pink-gradient"
                  : "border-purple-100 border rounded-medium p-3 flex"
              }`
            : `w-full ${
                variant == "outlined"
                  ? "bg-transparent border-purple-100 border hover:bg-purple-10 transition-all text-purple-100 p-3 px-8 rounded-medium text-input"
                  : "pink-gradient-button"
              }`
        }`}
        onClick={onClick}
        disabled={disabled || loading}
        type={type}
      >
        {loading ? (
          variant == "contained" ? (
            <Loader />
          ) : (
            <CircularProgress className="text-purple-100" size={20} />
          )
        ) : (
          content
        )}
      </button>
    </div>
  );
};

export default LoaderButton;
