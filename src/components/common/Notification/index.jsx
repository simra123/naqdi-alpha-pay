"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Check } from "@mui/icons-material";
import { setNotification } from "@/store/slices/modal.Slice";

const Notification = () => {
  const notification = useSelector((state) => state.modal.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("USE EFFECT RIGGERED");
    if (notification?.message) {
      setTimeout(() => {
        dispatch(setNotification({ status: null, message: null }));
      }, 4000);
    }
  }, [notification?.message]);

  return (
    <div
      className={
        notification?.message
          ? "bottom-20 fixed left-0 w-full transition-all"
          : "-bottom-20 fixed left-0 w-full transition-all"
      }
    >
      <div className="content w-max mx-auto bg-green-400 text-green-700 font-bold px-5 py-3 rounded-md">
        <div className="flex gap-3 items-center justify-between">
          <div className="icon">
            <Check />
          </div>
          <div className="message">
            <p>{notification?.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
