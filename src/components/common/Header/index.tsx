"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { getLocalStorageValue } from "@/utils/cookies";
import { capitalize } from "@/utils/dataFormatters";

import IconField from "../IconField";
import {
  LogoutDoorIcon,
  MenuIcon,
  NotificationIcon,
  SearchbarIcon,
  SupportIcon,
  ThemeChangeIcon,
} from "@/assets/Svgs";
import IconButton, { BorderedIconButton } from "../IconButton";
import Cookies from "js-cookie";
import { resetSteps } from "@/store/slices/onboarding.slice";
import { setUser } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";
import RenderRoleBased from "../RenderRoleBased";
import { Role } from "@/constants/roles";
import { clearApiCache } from "@/store/slices/apiCache.slice";

const Header = ({ navHandler }) => {
  const user = getLocalStorageValue("user");
  const router = useRouter();
  const dispatch = useDispatch();

  const pathname = usePathname();

  const getHeaderName = () => {
    if (pathname == "/") {
      return "Dashboard";
    }

    const splitted = pathname.split("/").map((item) => capitalize(item));
    splitted.shift();
    splitted.length > 2 && splitted.pop();
    if (splitted.length > 1 && splitted[0][splitted[0].length - 1] == "s") {
      const singular = Array.from(splitted[0].split(""));
      singular.pop();
      splitted[0] = singular.join("");
    }
    splitted[0].includes("Setting") && splitted.shift();

    return splitted.join(" ");
  };

  getHeaderName();

  const logoutHandler = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.replace("/login");
    dispatch(clearApiCache());
    dispatch(resetSteps({}));
    dispatch(setUser(null));
  };

  return (
    <div className="md:bg-white md:shadow-md mb-[2px] px-6 md:px-7 py-3 md:py-2 rounded-small">
      <div className="flex justify-between items-center gap-6">
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={navHandler}
            className="flex justify-center items-center bg-transparent hover:bg-white bg-none hover:shadow-md p-1 border-0 rounded-full outline-0 w-12 h-12 transition-all"
          >
            <MenuIcon />
          </button>
          {/* <h5 className="font-semibold text-black-100 text-h5">
            {getHeaderName()}
          </h5> */}
        </div>

        <div className="items-center gap-6">
          {/* <div className="icon">
            <Notifications />
          </div> */}
          <div className="hidden md:flex items-center gap-2 p-2 pr-3 rounded-full avatar">
            <div>
              <img
                src="/avatar.png"
                alt="Avatar"
                className="border border-white rounded-full h-14"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-p120 leading-5">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="font-medium text-button text-custom-caption-gray">
                {capitalize(user?.user_type)}
              </span>
            </div>
          </div>
        </div>
        <div className="search">
          <IconField
            onChange={(event) => {}}
            value={""}
            placeholder="Find something here..."
            icon={SearchbarIcon}
            inputContainerClassName="3xl:min-w-[360px] max-w-full text"
            wrapperClassName="!mb-0 relative 3.5xl:right-48 !w-[250px] max-w-full lg:block hidden"
            inputClassName="py-3 !rounded-[26.5px] text-caption"
          />
        </div>

        <div className="hidden md:flex items-center gap-6">
          <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
            <Link href="/support/create">
              <BorderedIconButton>
                <SupportIcon />
              </BorderedIconButton>
            </Link>
          </RenderRoleBased>
          <BorderedIconButton disabled>
            <ThemeChangeIcon />
          </BorderedIconButton>
          <BorderedIconButton disabled>
            <NotificationIcon />
          </BorderedIconButton>
          <BorderedIconButton onClick={logoutHandler}>
            <LogoutDoorIcon />
          </BorderedIconButton>
        </div>
        <div className="md:hidden flex">
          <img
            src="/avatar.png"
            alt="Avatar"
            className="border border-white rounded-full h-14"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
