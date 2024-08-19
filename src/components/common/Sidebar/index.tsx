import React, { useState } from "react";
import "./sidebar.scss";
import Link from "next/link";
import {
  AccountBalance,
  AppRegistration,
  Assignment,
  Help,
  Home,
  Key,
  Logout,
  Paid,
  Payments,
  People,
  PersonRounded,
  Receipt,
  Settings,
  ShoppingBasket,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";

const nav_items = [
  {
    name: "Onboarding",
    icon: <AppRegistration />,
    path: "/onboarding",
    roles: [Role.USER],
  },
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

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useLocalStorage("user");
  const [openSubNav, setOpenSubNav] = useState(""); // State to manage open sub-navigation

  // Function to toggle sub-navigation
  const toggleSubNav = (name: string, subnav: any) => {
    if (subnav) {
      return setOpenSubNav(openSubNav === name ? "" : name);
    }
    setOpenSubNav(null);
  };

  const logoutHandler = () => {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("token");
    router.replace("/login");
  };

  // Close sidebar if clicked outside
  const handleOutsideClick = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <div className="md:pl-5 flex items-center">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleOutsideClick}
        />
      )}

      <div
        className={`sidebar w-64 py-5 min-h-full md:min-h-[calc(100vh-40px)] bg-pink-gradient-vertical md:rounded-large flex flex-col justify-between SidebarWrapper
        fixed top-0 left-0 z-50 md:static md:w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
      >
        <div className="flex flex-col gap-3 p-2">
          <div className="logo mt-6 mb-12">
            <h3 className="text-center text-white text-p120 font-bold">
              ALPHASPAY
            </h3>
          </div>

          {nav_items.map(
            ({ icon, name, path, sub_nav, roles }) =>
              roles.includes(user?.role) && (
                <div className={`flex flex-col gap-2`} key={name}>
                  <Link
                    href={path}
                    className={`flex gap-2 navLink items-center ${
                      (pathname === path || name == openSubNav) && "active"
                    }`}
                    onClick={() => toggleSubNav(name, sub_nav)} // Toggle sub-navigation on click
                  >
                    <div>{icon}</div>
                    {path ? (
                      <span>{name}</span>
                    ) : (
                      <span className="cursor-pointer">{name}</span>
                    )}
                  </Link>
                  {sub_nav &&
                    openSubNav === name && ( // Conditionally render sub-navigation based on state
                      <div className="flex flex-col gap-2 pl-5">
                        {sub_nav.map(({ icon, name, path }) => (
                          <Link
                            href={path}
                            className={`flex gap-2 navLink items-center ${
                              pathname === path && "active"
                            }`}
                            key={name}
                          >
                            <div>{icon}</div>
                            <span>{name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              )
          )}
        </div>

        <div className="border-t-[1px] flex gap-3 flex-col border-placeholder-gray pt-7 pb-5 px-2">
          <div
            className={`flex gap-2 navLink items-center`}
            onClick={() => console.log("hello")}
          >
            <div>
              <Help />
            </div>

            <span className="cursor-pointer">Need Help?</span>
          </div>
          <div
            className={`flex gap-2 navLink items-center`}
            onClick={logoutHandler}
          >
            <div>
              <Logout />
            </div>

            <span className="cursor-pointer">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
