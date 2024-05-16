import React, { useState } from "react";
import "./sidebar.scss";
import Link from "next/link";
import {
  AccountBalance,
  Assignment,
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
import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";

const nav_items = [
  {
    name: "Dashboard",
    icon: <Home />,
    path: "/",
    roles: [Role.ADMIN, Role.USER],
  },
  {
    name: "Users",
    icon: <Assignment />,
    path: "/users",
    roles: [Role.ADMIN],
  },
  {
    name: "KYC Requests",
    icon: <Assignment />,
    path: "/kyc",
    roles: [Role.ADMIN],
  },
  {
    name: "Payments",
    icon: <Payments />,
    path: "/payments",
    roles: [Role.ADMIN, Role.USER],
  },
  {
    name: "Transactions",
    icon: <Receipt />,
    path: "/transactions",
    roles: [Role.ADMIN, Role.USER],
  },
  {
    name: "Withdrawals",
    icon: <Paid />,
    path: "/withdrawals",
    roles: [Role.ADMIN, Role.USER],
  },
  {
    name: "Payouts",
    icon: <ShoppingBasket />,
    path: "/payouts",
    roles: [Role.ADMIN, Role.USER],
  },
  {
    name: "Profiles",
    icon: <People />,
    path: "/profiles",
    roles: [Role.USER],
  },
  {
    name: "Settings",
    icon: <Settings />,
    path: "/settings/account",
    roles: [Role.USER],
    sub_nav: [
      {
        name: "Account",
        icon: <AccountBalance />,
        path: "/settings/account",
        roles: [Role.ADMIN, Role.USER],
      },
      {
        name: "Users",
        icon: <PersonRounded />,
        path: "/settings/users",
        roles: [Role.ADMIN, Role.USER],
      },
      {
        name: "Integrations",
        icon: <Key />,
        path: "/settings/integrations",
        roles: [Role.ADMIN, Role.USER],
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const user = useLocalStorage("user");
  const [openSubNav, setOpenSubNav] = useState(""); // State to manage open sub-navigation

  // Function to toggle sub-navigation
  const toggleSubNav = (name: string) => {
    if (name == openSubNav) return;
    setOpenSubNav(openSubNav === name ? "" : name);
  };

  return (
    <div className="px-6 py-4 SidebarWrapper h-full">
      <div className="flex flex-col gap-4">
        {nav_items.map(
          ({ icon, name, path, sub_nav, roles }) =>
            roles.includes(user?.role) && (
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
            )
        )}
      </div>
    </div>
  );
};

export default Sidebar;
