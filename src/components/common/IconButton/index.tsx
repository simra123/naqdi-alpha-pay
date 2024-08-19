// components/IconButton.tsx
import React from "react";

interface IconButtonProps {
  children?: any;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const IconButton = ({
  children,
  onClick,
  className,
  disabled,
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-[35px] h-[35px] p-2 rounded-full transition-colors ${
        !disabled && "hover:bg-gray-300 active:bg-gray-400"
      }  ${className} `}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default IconButton;
