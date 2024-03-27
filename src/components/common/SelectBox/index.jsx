import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

const SelectBox = ({ placeholder, options, value, onChange, name, onBlur }) => {
  const getSelectedLabel = () => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : "";
  };

  return (
    <FormControl fullWidth className="input-field">
      <Select
        value={value}
        className="primary-color"
        onChange={onChange}
        name={name}
        onBlur={onBlur}
        displayEmpty
        renderValue={() => {
          if (!value) {
            return <span className="placeholder_gray">{placeholder}</span>;
          }
          return getSelectedLabel();
        }}
        MenuProps={{
          MenuListProps: {
            sx: {
              backgroundColor: "#e8e6ee",
              color: "#9e9e9e",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectBox;
