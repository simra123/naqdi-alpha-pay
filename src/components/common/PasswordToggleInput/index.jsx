// PasswordToggleInput.js
import React, { useState } from "react";
import {
  InputAdornment,
  IconButton,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordToggleInput = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <OutlinedInput
        fullWidth
        type={passwordVisible ? "text" : "password"}
        placeholder="Password*"
        value={password}
        className="input-field"
        onChange={(e) => setPassword(e.target.value)}
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
