import React from "react";
import Image from "next/image";
import "./auth.scss";
import { Typography } from "@mui/material";

const Authlayout = ({ children }) => {
  return (
    <main id="auth_layout">
      <header className="auth_header">
        <div className="flex flex-col items-center">
          <Image src={"/logo.png"} height={100} width={150} alt="logo" priority/>
          <Typography variant="h5" color="primary">
            Alphaspay
          </Typography>
        </div>
      </header>
      {children}
      <footer>
        {/* <Image src={"/logo.png"} height={100} width={150} /> */}
        <svg
          width="110"
          height="85"
          viewBox="0 0 76 59"
          fill="none"
          className="mx-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M35 0H41V20H35V0Z" className="secondary-color"></path>
          <path d="M35 26H41V46H35V26Z" className="secondary-color"></path>
          <path d="M12 26H18V46H12V26Z" className="primary-color"></path>
          <path d="M58 26H64V46H58V26Z" className="primary-color"></path>
          <path d="M23 13H29V33H23V13Z" className="secondary-color"></path>
          <path d="M47 13H53V33H47V13Z" className="secondary-color"></path>
        </svg>
        <Typography>Copyright 2024. All Rights Reserved @Alphaspay.</Typography>
      </footer>
    </main>
  );
};

export default Authlayout;
