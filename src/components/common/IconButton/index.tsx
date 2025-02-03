// components/IconButton.tsx
import { Tooltip } from "react-tooltip";
import React from "react";

interface IconButtonProps {
  children?: any;
  onClick?: any;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const IconButton = ({
  children,
  onClick,
  className,
  disabled,
  type,
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className={`flex items-center justify-center min-w-[35px] h-[35px] p-2 rounded-full transition-colors ${
        !disabled && "hover:bg-gray-300 active:bg-gray-400"
      }  ${className} `}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default IconButton;

export const BorderedIconButton = ({
  children,
  onClick,
  className,
  disabled,
  onMouseEnter,
  onMouseLeave,
  hoveredClasses,
  tooltip, // New prop for tooltip text
  tooltipId,
}: {
  children?: any;
  onClick?: any;
  className?: string;
  disabled?: boolean;
  onMouseEnter?: any;
  onMouseLeave?: any;
  hoveredClasses?: string;
  tooltip?: string; // Optional tooltip text
  tooltipId?: string;
}) => {
  return (
    <>
      <button
        id={tooltipId}
        className={`border rounded-full border-grey-100 flex items-center justify-center w-[45px] h-[45px] ${
          disabled
            ? "hover:!bg-gray-300 active:!bg-gray-300"
            : hoveredClasses || "hover:bg-blackGrey-20 active:bg-blackGrey-30"
        } transition-all ${className}`}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </button>
      {tooltip && disabled && (
        <Tooltip
          content={tooltip}
          anchorSelect={"#" + tooltipId}
          className="z-30 !bg-red-500 max-w-64 xs:max-w-max"
        />
      )}
    </>
  );
};
