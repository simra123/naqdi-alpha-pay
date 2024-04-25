import React, { useState } from "react";
import "./sidebar.scss";
import Link from "next/link";
import {
  AccountBalance,
  Home,
  Key,
  Paid,
  Payments,
  People,
  Person,
  PersonRounded,
  Receipt,
  Settings,
  ShoppingBasket,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";

const nav_items = [
  { name: "Dashboard", icon: <Home />, path: "/" },
  { name: "Payments", icon: <Payments />, path: "/payments" },
  { name: "Transactions", icon: <Receipt />, path: "/transactions" },
  { name: "Withdrawals", icon: <Paid />, path: "/withdrawals" },
  { name: "Payouts", icon: <ShoppingBasket />, path: "/payouts" },
  { name: "Profiles", icon: <People />, path: "/profiles" },
  {
    name: "Settings",
    icon: <Settings />,
    path: "/settings/account",
    sub_nav: [
      { name: "Account", icon: <AccountBalance />, path: "/settings/account" },
      { name: "Users", icon: <PersonRounded />, path: "/settings/users" },
      { name: "Integrations", icon: <Key />, path: "/settings/integrations" },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [openSubNav, setOpenSubNav] = useState(""); // State to manage open sub-navigation

  // Function to toggle sub-navigation
  const toggleSubNav = (name: string) => {
    if (name == openSubNav) return;
    setOpenSubNav(openSubNav === name ? "" : name);
  };

  return (
    <div className="px-6 py-4 SidebarWrapper h-full">
      <div className="flex flex-col gap-4">
        {nav_items.map(({ icon, name, path, sub_nav }) => (
          <div className={`flex flex-col gap-2`} key={name}>
            <div
              className={`flex gap-2 navLink items-center ${
                (pathname === path || name == openSubNav) && "active"
              }`}
              onClick={() => toggleSubNav(name)} // Toggle sub-navigation on click
            >
              <div>{icon}</div>
              {path ? (
                <Link href={path}>{name}</Link>
              ) : (
                <span className="cursor-pointer">{name}</span>
              )}
            </div>
            {sub_nav &&
              openSubNav === name && ( // Conditionally render sub-navigation based on state
                <div className="flex flex-col gap-2 pl-5">
                  {sub_nav.map(({ icon, name, path }) => (
                    <div
                      className={`flex gap-2 navLink items-center ${
                        pathname === path && "active"
                      }`}
                      key={name}
                    >
                      <div>{icon}</div>
                      <Link href={path}>{name}</Link>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
