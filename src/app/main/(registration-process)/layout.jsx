"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Security, Settings } from "@mui/icons-material";
import "./registration_process.scss";
import UpgradeTraderModal from "@/components/common/UpgradeTraderModal";

const layout = ({ children }) => {
  const router = useRouter();

  return (
    <div>
      <UpgradeTraderModal />
      <header className="registration_layout_header sticky top-0 z-50">
        <div className="upgrade_message flex">
          <p className="message">
            In order for you to Trade, you have to complete your Onboarding
            Registration process!
          </p>
          <div className="actions">
            <button className="btn-yellow">
              <Security />
            </button>
            <button className="btn-yellow" onClick={() => router.push("/main")}>
              Upgrade to trader
            </button>
          </div>
        </div>

        <nav className="navbar px-8 py-6">
          <div className="nav_wrapper flex justify-between">
            <div className="left_nav flex items-center gap-20">
              <div className="logo text-2xl font-bold">Alphas</div>
              <div className="nav_links flex gap-4">
                <Link href="/main/home" className="font-bold">
                  Dashboard
                </Link>
                <Link href="/main/trade" className="font-bold">
                  Trade
                </Link>
                <Link href="/main/wallet" className="font-bold">
                  Wallets
                </Link>
              </div>
            </div>

            <div className="right_nav flex items-center gap-14">
              <div className="user_name flex items-center gap-5">
                <div className="name text-end">
                  <div className="font-bold"> Muhammad Ahmed </div>
                  <div className="text-sm">Standard User</div>
                </div>
                <div className="icon">
                  <Security />
                </div>
              </div>
              <div className="setting">
                <button>
                  <Settings />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {children}
    </div>
  );
};

export default layout;
