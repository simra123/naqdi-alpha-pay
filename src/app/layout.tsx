"use client";

import { Montserrat, Barlow } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import store from "@/store";
import Notification from "@/components/common/Notification";
import "./globals.scss";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={barlow.className}>
        <Provider store={store}>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            {children}
          </LocalizationProvider>

          <Notification />
        </Provider>
      </body>
    </html>
  );
}