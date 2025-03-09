"use client";

import { Lato } from "next/font/google";
import localFont from "next/font/local";
import { Provider } from "react-redux";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import store from "@/store";
import Notification from "@/components/common/Notification";
import "./globals.scss";

// Font files can be colocated inside of `app`
const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["italic", "normal"],
  variable: "--font-lato",
});
// Font files can be colocated inside of `app`
const nunitoSans = localFont({
  src: [
    {
      path: "../../public/fonts/NunitoSans/NunitoSans_7pt-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/NunitoSans/NunitoSans_7pt-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../public/fonts/NunitoSans/NunitoSans_7pt-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../../public/fonts/NunitoSans/NunitoSans_7pt-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-nunito-sans",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-small.png" />
      </head>
      <body className={`${lato.variable} ${nunitoSans.variable}`}>
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
