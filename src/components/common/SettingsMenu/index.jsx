"use client";

import React from "react";

import { useDispatch } from "react-redux";

import Link from "next/link";

import "./settingsmenu.scss";
import { setModal } from "@/store/slices/modal.Slice";

const SettingsMenu = ({ isOpen, setOpen }) => {
  const dispatch = useDispatch();

  const openUpgrade = () => {
    setOpen(false);
    dispatch(setModal(true));
  };

  return (
    <div
      className={
        isOpen ? "open settings_menu_wrapper" : "settings_menu_wrapper"
      }
      onClick={(e) => e.stopPropagation()}
    >
      <span className="menu_item heading">Muhammad Ahmed</span>

      <Link href="#" className="menu_item Link">
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

      <Link href="/login" className="menu_item Link">
        Logout
      </Link>
    </div>
  );
};

export default SettingsMenu;
