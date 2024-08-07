"use client";
import useLocalStorage from "@/hooks/useLocalStorage";
import { capitalize } from "@/utils/dataFormatters";
import { KeyboardArrowDown, Menu, Notifications } from "@mui/icons-material";
import React from "react";

const Header = () => {
  const user = useLocalStorage("user");

  return (
    <div className="md:bg-white py-2 md:px-7 rounded-small mb-10">
      <div className="flex items-center gap-6 justify-between md:justify-end">
        <div className="items-center gap-3 flex md:hidden">
          <button className="bg-none bg-transparent outline-0 border-0 rounded-full transition-all w-12 h-12 hover:bg-white hover:shadow-md p-3">
            <Menu />
          </button>
          <h5 className="text-h5 text-black-100 font-semibold">Profile</h5>
        </div>

        <div className="flex gap-6 items-center">
          <div className="icon">
            <Notifications />
          </div>
          <div className="avatar hidden md:flex cursor-pointer gap-2 items-center bg-light-blue rounded-full p-2 pr-3">
            <div>
              <img
                src="/avatar.jpg"
                alt="Avatar"
                className="rounded-full h-14 border border-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-custom-title-gray font-medium">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-[8px] text-custom-caption-gray font-medium">
                {capitalize(user?.user_type)}
              </span>
            </div>
            <div className="icon ml-3">
              <KeyboardArrowDown />
            </div>
          </div>

          <div className="avatar flex md:hidden cursor-pointer gap-2 items-center  rounded-full ">
            <div>
              <img
                src="/avatar.jpg"
                alt="Avatar"
                className="rounded-full h-14 border border-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
