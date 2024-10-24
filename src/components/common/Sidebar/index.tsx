import React, { useState } from "react";
import Link from "next/link";
import {
  AccountBalance,
  Assignment,
  Key,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  PersonRounded,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  DashboardIcon,
  LogoutIcon,
  NeedHelpIcon,
  onBoardingIcon,
  PaymentsIcon,
  PayoutsIcon,
  SettingsIcon,
  TransactionsIcon,
  WithdrawalIcon,
} from "@/assets/Svgs";
import "./sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { setUser } from "@/store/slices/userSlice";

interface NavItem {
  name: string;
  icon: any;
  path: string;
  roles: any[];
  sub_nav?: NavItem[];
}

const boarding_nav_items: NavItem[] = [
  {
    name: "Onboarding",
    icon: onBoardingIcon,
    path: "/onboarding",
    roles: [Role.USER],
  },
];

const nav_items: NavItem[] = [
  {
    name: "Dashboard",
    icon: DashboardIcon,
    path: "/",
    roles: [Role.ADMIN, Role.USER],
  },
  {
    name: "Users",
    icon: Assignment,
    path: "/users",
    roles: [Role.ADMIN],
  },
  {
    name: "KYC Requests",
    icon: Assignment,
    path: "/kyc",
    roles: [Role.ADMIN],
  },
  {
    name: "Payments",
    icon: PaymentsIcon,
    path: "/payments",
    roles: [Role.ADMIN, Role.USER],
  },
  {
    name: "Transactions",
    icon: TransactionsIcon,
    path: "/transactions",
    roles: [Role.ADMIN, Role.USER],
  },
  // {
  //   name: "Withdrawals",
  //   icon: WithdrawalIcon,
  //   path: "/withdrawals",
  //   roles: [Role.ADMIN, Role.USER],
  // },
  // {
  //   name: "Payouts",
  //   icon: PayoutsIcon,
  //   path: "/payouts",
  //   roles: [Role.ADMIN, Role.USER],
  // },
  {
    name: "Settings",
    icon: SettingsIcon,
    path: "/settings/account",
    roles: [Role.USER, Role.ADMIN],
    sub_nav: [
      {
        name: "Account",
        icon: AccountBalance,
        path: "/settings/account",
        roles: [Role.ADMIN, Role.USER],
      },
      // {
      //   name: "Users",
      //   icon: PersonRounded,
      //   path: "/settings/users",
      //   roles: [Role.USER],
      // },
      {
        name: "Integrations",
        icon: Key,
        path: "/settings/integrations",
        roles: [Role.USER],
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
  const dispatch = useDispatch();
  const userCookie = useLocalStorage("user");
  const user =
    userCookie && userCookie?.role == Role.ADMIN
      ? userCookie
      : useSelector((state: any) => state.user.data);

  const [openSubNav, setOpenSubNav] = useState(""); // State to manage open sub-navigation
  const [isCollapsed, setIsCollapsed] = useState(false);
  let CurrentNav =
    user?.role == Role.ADMIN
      ? nav_items
      : user?.userDetails && user?.userDetails?.fees
      ? nav_items
      : boarding_nav_items;

  console.log({ CurrentNav , user });

  // Function to toggle sub-navigation
  const toggleSubNav = (name: string, subnav: any) => {
    if (subnav) {
      return setOpenSubNav(openSubNav === name ? "" : name);
    }
    setOpenSubNav(null);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const logoutHandler = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    dispatch(setUser(null));
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
        className={`relative transition-all ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <button
          className="absolute hidden md:flex aspect-square w-10 h-10 p-2 -right-5 top-16 z-30 items-center justify-center bg-pink-gradient-vertical rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <KeyboardArrowRight className="text-[24px] text-white" />
          ) : (
            <KeyboardArrowLeft className="text-[24px] text-white" />
          )}
        </button>

        <div
          className={`py-5 min-h-full w-full max-w-64 md:min-h-[calc(100vh-40px)] md:max-h-[calc(100vh-40px)] md:overflow-hidden bg-pink-gradient-vertical md:rounded-large flex flex-col  justify-between SidebarWrapper fixed top-0 left-0 z-50 md:static transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-all duration-300 ease-in-out md:translate-x-0`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
        >
          <div className="flex flex-col gap-3">
            <div className="logo mt-6 mb-12 p-2">
              <h3 className="text-center text-white text-p120 font-bold">
                {isCollapsed ? "A" : "ALPHASPAY"}
              </h3>
            </div>
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto sidebar-scrollbar">
              <div className="p-2 flex flex-col gap-3">
                {CurrentNav.map(
                  ({ icon: Icon, name, path, sub_nav, roles }) =>
                    roles.includes(user?.role) && (
                      <div
                        className={`flex flex-col gap-2 ${
                          (pathname === path || name == openSubNav) &&
                          "bg-white rounded-medium "
                        }`}
                        key={name}
                      >
                        <Link
                          href={path}
                          className={`flex gap-2 navLink items-center transition-all ${
                            isCollapsed && "justify-center"
                          } ${
                            (pathname === path || name == openSubNav) &&
                            "active"
                          }`}
                          onClick={() => toggleSubNav(name, sub_nav)} // Toggle sub-navigation on click
                        >
                          <div>
                            <Icon
                              className={` ${
                                pathname === path || name == openSubNav
                                  ? "!fill-purple-100 w-6 h-6"
                                  : "fill-white w-5 h-5"
                              }`}
                            />
                          </div>
                          {!isCollapsed &&
                            (path ? (
                              <span>{name}</span>
                            ) : (
                              <span className="cursor-pointer">{name}</span>
                            ))}
                        </Link>
                        {sub_nav &&
                          openSubNav === name && ( // Conditionally render sub-navigation based on state
                            <div
                              className={`flex flex-col gap-3 ${
                                !isCollapsed && "pl-14"
                              } pb-3`}
                            >
                              {sub_nav.map(
                                ({ icon: Icon, name, path, roles }) =>
                                  roles.includes(user?.role) && (
                                    <Link
                                      href={path}
                                      className={`flex gap-2  items-center font-medium ${
                                        isCollapsed && "justify-center"
                                      } ${
                                        pathname === path &&
                                        "text-purple-100 font-semibold text-[17px]"
                                      }`}
                                      key={name}
                                    >
                                      {isCollapsed && (
                                        <div>
                                          <Icon
                                            className={` ${
                                              pathname === path
                                                ? "!fill-purple-100 w-6 h-6"
                                                : "fill-black-100 w-5 h-5"
                                            }`}
                                          />
                                        </div>
                                      )}
                                      {!isCollapsed && <span>{name}</span>}
                                    </Link>
                                  )
                              )}
                            </div>
                          )}
                      </div>
                    )
                )}
              </div>
            </div>
          </div>

          <div className="border-t-[1px] flex gap-3 flex-col border-placeholder-gray pt-7 pb-5 px-2">
            {user?.role == Role.USER && (
              <div
                className={`flex gap-2 navLink items-center cursor-pointer ${
                  isCollapsed && "justify-center"
                }`}
                onClick={() => router.push("/support")}
              >
                <div>
                  <NeedHelpIcon className={"fill-white w-5 h-5"} />
                </div>
                {!isCollapsed && <span>Need Help?</span>}
              </div>
            )}
            <div
              className={`flex gap-2 navLink items-center cursor-pointer ${
                isCollapsed && "justify-center"
              }`}
              onClick={logoutHandler}
            >
              <div>
                <LogoutIcon className={"fill-white w-5 h-5"} />
              </div>
              {!isCollapsed && <span>Logout</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
