import React from "react";
import RadioButton from "../RadioButton";

const CheckboxWithInput = ({
  isChecked,
  inputValue,
  handleChange,
  checkBoxName,
  disabled,
  inputName,
  label,
}) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="min-w-20">
        <RadioButton
          type="checkbox"
          selctedValue={isChecked}
          label={label}
          name={checkBoxName}
          onChange={handleChange}
          value={isChecked}
        />
      </div>
      <input
        type="number"
        name={inputName}
        min={0}
        max={100}
        placeholder="1"
        handleChange={handleChange}
        className="transparent"
        value={inputValue}
        disabled={!isChecked || disabled}
      />
    </div>
  );
};

export default CheckboxWithInput;
