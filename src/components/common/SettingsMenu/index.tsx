"use client";

import React from "react";
import { useDispatch } from "react-redux";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { setModal } from "@/store/slices/modal.Slice";

import "./settingsmenu.scss";

const SettingsMenu = ({ isOpen, setOpen }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const openUpgrade = () => {
    setOpen(false);
    dispatch(setModal(true));
  };

  const redirect = (e) => {
    e.preventDefault();
    setOpen(false);
    console.log(e.target.href);
    router.push(e.target.href);
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    setOpen(false);
    window?.localStorage?.removeItem("token");
    window?.localStorage?.removeItem("user");
    router.push(e.target.href);
  };

  return (
    <div
      className={
        isOpen ? "open settings_menu_wrapper" : "settings_menu_wrapper"
      }
      onClick={(e) => e.stopPropagation()}
    >
      <span className="menu_item heading">Muhammad Ahmed</span>

      <Link href="/main/profile" onClick={redirect} className="menu_item Link">
        Profile
      </Link>

      <Link href="#" onClick={openUpgrade} className="menu_item Link">
        Fee Schedule
      </Link>

      <Link href="#" className="menu_item Link">
        User Agreement
      </Link>

      <Link href="#" className="menu_item Link">
        Custody Agreement
      </Link>

      <Link href="#" onClick={openUpgrade} className="menu_item Link">
        Bank Accounts
      </Link>

      <Link href="#" className="menu_item Link">
        FAQ
      </Link>

      <Link href="/login" onClick={logoutHandler} className="menu_item Link">
        Logout
      </Link>
    </div>
  );
};

export default SettingsMenu;
