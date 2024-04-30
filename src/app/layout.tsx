"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import theme from "@/config/theme";
import store from "@/store";
import Notification from "@/components/common/Notification";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              {children}
            </LocalizationProvider>
          </ThemeProvider>
          <Notification />
        </Provider>
      </body>
    </html>
  );
}
