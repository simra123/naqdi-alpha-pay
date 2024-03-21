import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SelectBox = ({ label, options, value, onChange }) => {
  return (
    <FormControl fullWidth className="input-field">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        className="primary-color"
        onChange={onChange}
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
