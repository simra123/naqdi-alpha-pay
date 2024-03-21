"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#623680",
    },
    secondary: {
      main: "#FF4081",
    },
  },
  typography: {
    fontFamily: "Mulish",
    h2: {
      fontSize: "44px",
      fontWeight: 800,
    },
  },
});

export default theme;
