// components/SwitchButton.tsx

import React from "react";

interface SwitchButtonProps {
  isOn: boolean;
  handleToggle: () => void;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ isOn, handleToggle }) => {
  return (
    <div
      onClick={() => handleToggle()}
      className={`${
        isOn ? "bg-purple-light" : "bg-gray-300"
      } relative inline-flex h-4 w-8 items-center rounded-full cursor-pointer transition-colors duration-300`}
    >
      <span
        className={`${
          isOn ? "translate-x-[18px]" : "translate-x-[2px]"
        } inline-block h-3 w-3 transform bg-white rounded-full transition-transform duration-300`}
      />
    </div>
  );
};

export default SwitchButton;
