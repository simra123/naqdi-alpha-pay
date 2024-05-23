"use client";

import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import theme from "@/config/theme";
import store from "@/store";
import Notification from "@/components/common/Notification";
import "./globals.scss";

const monsterrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={monsterrat.className}>
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
