import React, { useCallback, useState } from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  DashboardIcon,
  DoubleLeftIcon,
  DoubleRightIcon,
  FeeLedgerIcon,
  KYCIcon,
  LogoutDoorIcon,
  LogoutIcon,
  MerchantIcon,
  NeedHelpIcon,
  NewsIcon,
  NotificationIcon,
  onBoardingIcon,
  PaymentsIcon,
  SettingsIcon,
  SupportIcon,
  ThemeChangeIcon,
  TransactionsIcon,
  WithdrawalIcon,
} from "@/assets/Svgs";
import "./sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { setUser } from "@/store/slices/userSlice";
import { AccessLevelEnum, ModulesEnum } from "@/constants/types";
import { resetSteps } from "@/store/slices/onboarding.slice";
import { BorderedIconButton } from "../IconButton";
import RenderRoleBased from "../RenderRoleBased";
import { MdAccountBalance, MdKey, MdPerson2 } from "react-icons/md";
import { clearApiCache } from "@/store/slices/apiCache.slice";

interface NavItem {
  name: string;
  icon: any;
  path: string;
  roles: any[];
  module?: ModulesEnum;
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
    module: ModulesEnum.wallet,
  },
  {
    name: "Merchants",
    icon: MerchantIcon,
    path: "/merchants",
    roles: [Role.ADMIN],
    module: ModulesEnum.merchant,
  },
  {
    name: "KYC Requests",
    icon: KYCIcon,
    path: "/kyc",
    module: ModulesEnum.kyc,
    roles: [Role.ADMIN],
  },
  // {
  //   name: "Wallets",
  //   icon: Wallet,
  //   path: "/wallets",
  //   roles: [Role.ADMIN],
  // },
  {
    name: "Deposits",
    icon: PaymentsIcon,
    path: "/deposits",
    roles: [Role.ADMIN, Role.USER],
    module: ModulesEnum.payment,
  },
  {
    name: "Transactions",
    icon: TransactionsIcon,
    path: "/transactions",
    roles: [Role.ADMIN, Role.USER],
    module: ModulesEnum.transaction,
  },
  {
    name: "Withdrawals",
    icon: WithdrawalIcon,
    path: "/withdrawals",
    roles: [Role.ADMIN, Role.USER],
    module: ModulesEnum.withdrawal,
  },
  {
    name: "Fee Ledger",
    icon: FeeLedgerIcon,
    path: "/fee-ledger",
    roles: [Role.ADMIN, Role.USER],
    module: ModulesEnum.feeLedger,
  },
  {
    name: "News Signups",
    icon: NewsIcon,
    path: "/news-signup",
    roles: [Role.ADMIN],
    module: ModulesEnum.newsletter,
  },
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
        icon: MdAccountBalance,
        path: "/settings/account",
        roles: [Role.ADMIN, Role.USER],
      },
      {
        name: "Users",
        icon: MdPerson2,
        path: "/settings/users",
        roles: [Role.USER, Role.ADMIN],
        module: ModulesEnum.user,
      },
      {
        name: "Integrations",
        icon: MdKey,
        path: "/settings/integrations",
        roles: [Role.USER],
        module: ModulesEnum.integration,
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

  const getCurrentNav = useCallback(() => {
    let CurrentNav = [];

    if (
      user?.role == Role.ADMIN ||
      (user?.parentUser && user?.userDetails?.mfa) ||
      (!user?.parentUser && user?.company && user?.company?.fee)
    ) {
      return nav_items;
    } else {
      return boarding_nav_items;
    }

    return CurrentNav;
  }, [user]);

  // Check if the user has at least read access for a specific module
  const hasAccess = useCallback(
    (module: ModulesEnum | undefined) => {
      if (!module) return true; // No module specified, render item

      const permissions = user?.permissions || [];
      const modulePermission = permissions.find(
        (perm: any) => perm.permission.module === module
      );

      // Check if user has at least read access
      return (
        modulePermission &&
        (modulePermission.permission.access_level == AccessLevelEnum.read ||
          modulePermission.permission.access_level == AccessLevelEnum.full)
      );
    },
    [user]
  );
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
    router.replace("/login");
    dispatch(clearApiCache());
    dispatch(resetSteps({}));
    dispatch(setUser(null));
  };

  // Close sidebar if clicked outside
  const handleOutsideClick = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <div className="flex">
      {isOpen && (
        <div
          className="z-40 fixed inset-0 bg-black bg-opacity-50"
          onClick={handleOutsideClick}
        />
      )}

      <div
        className={`relative transition-all ${isCollapsed ? "w-32" : "w-64"}`}
      >
        <button
          className={`absolute hidden md:flex ${
            isCollapsed ? "-right-[21px]" : "right-0"
          } top-[104px] z-30 items-center justify-center bg-orange-500 h-[17px] w-[22px]  shadow-md`}
          onClick={toggleSidebar}
        >
          {isCollapsed ? <DoubleRightIcon /> : <DoubleLeftIcon />}
        </button>

        <div
          className={`pt-10 min-h-full w-full max-w-64 md:overflow-hidden flex flex-col bg-white border-r border-light-white justify-between SidebarWrapper fixed top-0 left-0 z-50 md:static transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-all duration-300 ease-in-out md:translate-x-0`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
        >
          <div className="flex flex-col gap-3">
            <div className="mb-12 px-6 logo">
              <h3 className="font-bold text-p120 text-white text-center">
                {!isCollapsed ? (
                  <img src="/logo-new.png" className="w-[160px]" alt="Logo" />
                ) : (
                  <img
                    src="/logo-small.png"
                    className="m-auto w-[60px]"
                    alt="Logo"
                  />
                )}
              </h3>
            </div>
            <div className="max-h-[calc(100vh-230px)] md:max-h-[calc(100vh-160px)] overflow-y-auto sidebar-scrollbar">
              <div className="flex flex-col gap-3 px-[18px]">
                {getCurrentNav().map(
                  ({ icon: Icon, name, path, sub_nav, roles, module }) =>
                    roles &&
                    roles.includes(user?.role) &&
                    hasAccess(module) && (
                      <div
                        className={`flex flex-col gap-2 ${
                          (pathname === path || name == openSubNav) &&
                          "bg-white rounded-medium "
                        }`}
                        key={name}
                      >
                        <Link
                          href={path}
                          className={`flex gap-3 navLink items-center transition-all ${
                            isCollapsed &&
                            "justify-center h-[58px] w-[68px] m-auto"
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
                                  ? "!fill-purple-500 w-6 h-6"
                                  : "w-5 h-5"
                              }`}
                              active={pathname === path || name == openSubNav}
                            />
                          </div>
                          {!isCollapsed &&
                            (path ? (
                              <span
                                className={
                                  pathname === path || name == openSubNav
                                    ? "font-bold"
                                    : "font-semibold"
                                }
                              >
                                {name}
                              </span>
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
                                ({ icon: Icon, name, path, roles, module }) =>
                                  roles &&
                                  roles.includes(user?.role) &&
                                  hasAccess(module) && (
                                    <Link
                                      href={path}
                                      className={`flex gap-2  items-center font-medium text-p120 text-purple-500 ${
                                        isCollapsed && "justify-center"
                                      } ${
                                        pathname === path
                                          ? "font-semibold"
                                          : "font-bold"
                                      }`}
                                      key={name}
                                    >
                                      {isCollapsed && (
                                        <div>
                                          <Icon
                                            className={` ${
                                              pathname === path
                                                ? "!fill-purple-500 w-6 h-6"
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

          <div className="md:hidden flex items-center gap-2 mx-auto py-5 border-t border-light-purple">
            <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
              <BorderedIconButton>
                <SupportIcon />
              </BorderedIconButton>
            </RenderRoleBased>
            <BorderedIconButton>
              <ThemeChangeIcon />
            </BorderedIconButton>
            <BorderedIconButton>
              <NotificationIcon />
            </BorderedIconButton>
            <BorderedIconButton onClick={logoutHandler}>
              <LogoutDoorIcon />
            </BorderedIconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
