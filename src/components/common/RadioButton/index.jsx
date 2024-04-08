import React from "react";

const RadioButton = ({
  type = "radio",
  value,
  selctedValue,
  name,
  onChange,
  label,
}) => {
  return (
    <label className="inline-flex items-center">
      <input
        type={type}
        className="form-radio color-primary h-5 w-5"
        value={value}
        name={name}
        checked={Boolean(selctedValue) == Boolean(value)}
        onChange={onChange}
      />
      <span className="ml-2">{label}</span>
    </label>
  );
};

export default RadioButton;
