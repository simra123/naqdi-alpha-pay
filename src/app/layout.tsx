"use client";

import { Montserrat, Barlow } from "next/font/google";
import { Provider } from "react-redux";

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

          {children}

          <Notification />
        </Provider>
      </body>
    </html>
  );
}
