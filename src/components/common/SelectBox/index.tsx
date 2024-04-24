import React from "react";
import { FormControl, Select, MenuItem, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface Option {
  value: string;
  label: string;
}

interface SelectBoxProps {
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  onBlur?: any;
  IconName?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  className?: string;
  sx?: object;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  placeholder,
  options,
  value,
  onChange,
  name,
  onBlur,
  IconName,
  className = "input-field",
  sx,
}) => {
  const getSelectedLabel = () => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : "";
  };

  return (
    <FormControl fullWidth className={`${className}`}>
      <Select
        value={value}
        className="primary-color"
        onChange={onChange}
        name={name}
        IconComponent={() => (
          <IconName sx={{ marginRight: "8px", marginLeft: "-8px" }} />
        )}
        sx={sx}
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
