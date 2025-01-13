"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { capitalize } from "@/utils/dataFormatters";
import {
  KeyboardArrowDown,
  Menu,
  Notifications,
  Search,
} from "@mui/icons-material";
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

const Header = ({ navHandler }) => {
  const user = useLocalStorage("user");
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
    dispatch(resetSteps({}));
    dispatch(setUser(null));
  };

  return (
    <div className="md:bg-white md:shadow-md py-3 md:py-2 px-6 md:px-7 rounded-small mb-[2px]">
      <div className="flex items-center gap-6 justify-between">
        <div className="items-center gap-3 flex md:hidden">
          <button
            onClick={navHandler}
            className="bg-none bg-transparent outline-0 border-0 rounded-full transition-all w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-md p-1"
          >
            <MenuIcon />
          </button>
          {/* <h5 className="text-h5 text-black-100 font-semibold">
            {getHeaderName()}
          </h5> */}
        </div>

        <div className="gap-6 items-center">
          {/* <div className="icon">
            <Notifications />
          </div> */}
          <div className="avatar hidden md:flex cursor-pointer gap-2 items-center rounded-full p-2 pr-3">
            <div>
              <img
                src="/avatar.png"
                alt="Avatar"
                className="rounded-full h-14 border border-white"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-p120 font-medium leading-5">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-button text-custom-caption-gray font-medium">
                {capitalize(user?.user_type)}
              </span>
            </div>
          </div>
        </div>
        <div className="search">
          <IconField
            onChange={(event) => console.log(event.target.value)}
            value={""}
            placeholder="Find something here..."
            icon={SearchbarIcon}
            inputContainerClassName="3xl:min-w-[360px] max-w-full text"
            wrapperClassName="!mb-0 relative 3.5xl:right-48 !w-[250px] max-w-full lg:block hidden"
            inputClassName="py-3 !rounded-[26.5px] text-caption"
          />
        </div>

        <div className="items-center gap-6 hidden md:flex">
          <Link href="/support/create">
            <BorderedIconButton>
              <SupportIcon />
            </BorderedIconButton>
          </Link>
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
        <div className="flex md:hidden">
          <img
            src="/avatar.png"
            alt="Avatar"
            className="rounded-full h-14 border border-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
