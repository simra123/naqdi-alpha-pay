"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Security, Settings } from "@mui/icons-material";
import UpgradeTraderModal from "@/components/common/UpgradeTraderModal";
import SettingsMenu from "@/components/common/SettingsMenu";
import "./registration_process.scss";
import useLocalStorage from "@/hooks/useLocalStorage";
import { capitalize } from "@/utils/dataFormatters";

const Nav_items = [
  {
    name: "Dashboard",
    activePath: "/main/home",
  },
  {
    name: "Trade",
    activePath: "/main/trade",
  },
  {
    name: "Wallets",
    activePath: "/main/wallet",
  },
];

const layout = ({ children }) => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const pathname = usePathname();

  const [isSettingOpen, setSettingOpen] = useState(false);

  return (
    <div onClick={(e) => setSettingOpen(false)}>
      <UpgradeTraderModal />
      <header className="registration_layout_header sticky top-0 z-50">
        <div className="upgrade_message flex">
          <p className="message">
            In order for you to Trade, you have to complete your Onboarding
            Registration process!
          </p>
          <div
            className={
              pathname == "/main/trader-registration"
                ? "actions hide_mate"
                : "actions"
            }
          >
            <button className="btn-yellow">
              <Security />
            </button>
            <Link
              className="btn-yellow no-radius"
              href={"/main/trader-registration"}
            >
              Upgrade to trader
            </Link>
          </div>
        </div>

        <nav className="navbar px-8 py-6">
          <div className="nav_wrapper flex justify-between">
            <div className="left_nav flex items-center gap-20">
              <div className="logo text-2xl font-bold">Alphas</div>
              <div className="nav_links flex gap-4">
                {Nav_items.map(({ activePath, name }) => (
                  <Link
                    href={activePath}
                    className={
                      pathname == activePath ? "active font-bold" : "font-bold"
                    }
                    key={activePath}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="right_nav flex items-center gap-14">
              <div className="user_name flex items-center gap-5">
                <div className="name text-end">
                  <div className="font-bold">
                    {" "}
                    {capitalize(user?.first_name)} {capitalize(user?.last_name)}{" "}
                  </div>
                  <div className="text-sm"> {capitalize(user?.user_type)}</div>
                </div>
                <div className="icon">
                  <Security />
                </div>
              </div>
              <div className="setting relative" id="setting_wrapper">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSettingOpen(!isSettingOpen);
                  }}
                  id="setting_btn"
                  className={isSettingOpen ? "active" : ""}
                >
                  <Settings
                    className={
                      isSettingOpen
                        ? "-rotate-90 transition-all"
                        : "transition-all rotate-0"
                    }
                  />
                </button>
                <SettingsMenu isOpen={isSettingOpen} setOpen={setSettingOpen} />
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
