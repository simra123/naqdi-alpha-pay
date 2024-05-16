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
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderRadius: "2px",
          borderColor: "lightgray",
        },
        contained: {
          borderRadius: "2px",
        },
        text: {
          borderRadius: "2px",
          textTransform: "none",
          fontWeight: 700,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderRadius: "4px",
        },
        filled: {
          borderRadius: "4px",
        },
      },
    },
  },
});

export default theme;
