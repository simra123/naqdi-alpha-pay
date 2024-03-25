"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import "./globals.scss";
import theme from "@/config/theme";
import store from "@/store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
