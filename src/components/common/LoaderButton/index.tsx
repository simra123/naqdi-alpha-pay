import React from "react";
import Loader from "../Loader";

type buttonVariants = "contained" | "outlined" | "text" | "error" | "success";
type buttonColors = "success" | "error";

interface Props {
  loading?: boolean;
  onClick?: (event?: any) => void;
  variant?: buttonVariants;
  color?: buttonColors;
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
  color,
  className,
}: Props) => {
  const getVariantClasses = (variant: buttonVariants, loading: boolean) => {
    const disabledClasses = disabled
      ? "!bg-disabled !bg-none !text-purple-100 font-medium"
      : "";

    const loadingClasses = {
      contained: "w-16 p-2 rounded-full bg-pink-gradient",
      outlined: "border-purple-100 border rounded-medium p-3 flex",
      text: "",
      error: "border-red-button border py-3 w-56 rounded-medium",
      success: "border-green-button border py-3 w-56 rounded-medium",
    };

    const variantClasses = {
      contained: "pink-gradient-button w-full",
      error: "border-red-button border py-3 w-56 rounded-medium",
      outlined:
        "bg-transparent border-purple-100 border hover:bg-purple-10 transition-all text-purple-100 sm:p-3 py-[6px] px-[6px] sm:px-8 rounded-small sm:rounded-medium text-[13px] sm:text-input w-full",
      text: "bg-transparent text-purple-100 p-2",
    };

    const colors = {
      error: "border-0 py-3 text-white !bg-red-button rounded-medium w-56",
      success: "border-0 py-3 text-white !bg-green-button rounded-medium w-56",
    };
    console.log(colors[color]);

    return `${disabledClasses} ${colors[color]} ${
      loading ? loadingClasses[variant] : variantClasses[variant]
    } `;
  };

  return (
    <div className="flex justify-center">
      <button
        className={`transition-[width] whitespace-nowrap  ease-in-out ${getVariantClasses(
          variant,
          loading
        )} ${className}`}
        onClick={onClick}
        disabled={disabled || loading}
        type={type}
      >
        {loading ? (
          variant === "contained" ? (
            <Loader />
          ) : (
            <div
              className={`loader-circle 
                ${
                  color == "success"
                    ? "text-green-button"
                    : color == "error"
                    ? "text-red-button"
                    : "text-purple-100"
                }`}
            />
          )
        ) : (
          content
        )}
      </button>
    </div>
  );
};

export default LoaderButton;
