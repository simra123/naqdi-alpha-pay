import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const AutoComplete = ({
  placeholder,
  options,
  value,
  onChange,
  name,
  onBlur,
}) => {
  const getSelectedOption = () => {
    return options.find((option) => option.value === value) || null;
  };

  return (
    <Autocomplete
      className="input-field"
      options={options}
      onBlur={onBlur}
      fullWidth
      onChange={onChange}
      onInputChange={onChange}
      value={value}
      inputValue={value}
      autoHighlight
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          name={name}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
};

export default AutoComplete;
