"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Check } from "@mui/icons-material";
import { setNotification } from "@/store/slices/modal.Slice";

const Notification = () => {
  const notification = useSelector((state: any) => state.modal.notification);
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
          ? "top-4 fixed right-4  transition-all"
          : "top-4 fixed -right-56  transition-all"
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
