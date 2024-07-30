import { Button, CircularProgress } from "@mui/material";
import React from "react";
import Loader from "../Loader";

interface Props {
  loading: boolean;
  onClick?: () => void;
  variant?: any;
  content: any;
  disabled?: boolean;
  type?: "reset" | "submit";
}

const LoaderButton = ({
  loading,
  onClick,
  variant = "outlined",
  content,
  disabled,
  type,
}: Props) => {
  return (
    <div className="flex justify-center">
      <button
        className={`transition-[width]  ease-in-out ${
          loading
            ? "w-16 p-2 rounded-full bg-pink-gradient"
            : "w-full pink-gradient-button"
        }`}
        onClick={onClick}
        disabled={disabled || loading}
        type={type}
      >
        {loading ? <Loader /> : content}
      </button>
    </div>
  );
};

export default LoaderButton;
