"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";
import { MdCheck } from "react-icons/md";

const Notification = () => {
  const notification = useSelector((state: any) => state.modal.notification);
  const dispatch = useDispatch();

  useEffect(() => {
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
      <div
        className={`content w-max mx-auto ${
          notification?.status == "success"
            ? "bg-green-400 text-green-700"
            : "bg-red-400 text-red-700"
        } font-bold px-5 py-3 rounded-md`}
      >
        <div className="flex justify-between items-center gap-3">
          <div className="icon">
            <MdCheck />
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
