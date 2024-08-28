import { CircularProgress } from "@mui/material";
import React from "react";
import Loader from "../Loader";

type buttonVariants = "contained" | "outlined" | "text";

interface Props {
  loading?: boolean;
  onClick?: () => void;
  variant?: buttonVariants;
  content: any;
  disabled?: boolean;
  type?: "reset" | "submit";
  className?: string;
}

const LoaderButton = ({
  loading,
  onClick,
  variant = "contained", // Default variant
  content,
  disabled,
  type,
  className,
}: Props) => {


  const getVariantClasses = (variant: buttonVariants, loading: boolean) => {

    const disabledClasses = disabled
      ? "!bg-disabled !bg-none !text-purple-100 font-medium"
      : "";

    const loadingClasses = loading
      ? variant === "contained"
        ? "w-16 p-2 rounded-full bg-pink-gradient"
        : "border-purple-100 border rounded-medium p-3 flex"
      : "";

    const variantClasses = {
      contained: loading
        ? ""
        : "pink-gradient-button w-full",
      outlined: loading
        ? ""
        : "bg-transparent border-purple-100 border hover:bg-purple-10 transition-all text-purple-100 p-3 px-8 rounded-medium text-input w-full",
      text: loading ? "" : "bg-transparent text-purple-100 p-2",
    };

    return `${disabledClasses} ${loadingClasses} ${variantClasses[variant]}`;
  };

  return (
    <div className="flex justify-center">
      <button
        className={`transition-[width] ease-in-out ${getVariantClasses(variant, loading)} ${className}`}
        onClick={onClick}
        disabled={disabled || loading}
        type={type}
      >
        {loading ? (
          variant === "contained" ? (
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
