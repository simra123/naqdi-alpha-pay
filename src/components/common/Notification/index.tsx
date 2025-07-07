"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";
import { MdCheck } from "react-icons/md";

const Notification = () => {
  const notification = useSelector((state: any) => state.modal.notification);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification?.message) {
      setVisible(true);

      const hideTimeout = setTimeout(() => {
        setVisible(false); // triggers slide out

        // Wait for the slide-out animation to complete before resetting the state
        setTimeout(() => {
          dispatch(setNotification({ status: null, message: null }));
        }, 300); // match the CSS transition duration
      }, 4000);

      return () => clearTimeout(hideTimeout);
    }
  }, [notification?.message]);

  if (!notification?.message) return null;

  return (
    <div
      className={`fixed top-4 transition-all duration-300 ${
        visible ? "right-4" : "-right-56"
      }`}
    >
      <div
        className={`w-max mx-auto ${
          notification?.status === "success"
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
