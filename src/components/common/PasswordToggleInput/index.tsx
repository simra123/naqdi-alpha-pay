// PasswordToggleInput.js
import React, { ChangeEventHandler, FC, useState } from "react";
import {
  InputAdornment,
  IconButton,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: () => void;
  name: string;
  value: string;
  placeholder?: string;
}

const PasswordToggleInput: FC<Props> = ({
  onChange,
  onBlur,
  name,
  value,
  placeholder,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <OutlinedInput
        fullWidth
        type={passwordVisible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        className="input-field"
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={togglePasswordVisibility}
              edge="end"
              color="primary"
            >
              {passwordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={null}
      />
    </div>
  );
};

export default PasswordToggleInput;
