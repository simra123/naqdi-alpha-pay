// components/DateField.js
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { CalenderGrayIcon } from "@/assets/Svgs";
import ReactDOM from "react-dom"; // Import ReactDOM for portals
import "./style.scss";

interface Props {
  date: string;
  handleChange: (date: Date) => void;
  name: string;
  value: string;
  className?: string;
}

export default function DateField({
  date,
  handleChange,
  name,
  value,
  className,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensures the DatePicker is mounted on the client side to avoid SSR issues
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent rendering before mounted (SSR issue)

  return (
    <div className="relative">
      <DatePicker
        value={value}
        name={name}
        selected={date ? moment(date).toDate() : null}
        onChange={handleChange}
        placeholderText="MM/DD/YYYY"
        dateFormat="MM/dd/yyyy"
        className={`w-full text-[14px] py-2 px-4 focus:outline-none ${className}`}
        calendarClassName="custom-calendar z-10000"
        popperClassName="!z-[10000]"
        // We are using a React Portal here to render the popper outside of the table
        popperContainer={(props) => {
          return ReactDOM.createPortal(
            <div {...props} />, // Rendering popper container using a portal
            document.body // You can also render it to a specific element like a modal container
          );
        }}
      />
      <div className="absolute right-3 top-2.5 pointer-events-none">
        <CalenderGrayIcon />
      </div>
    </div>
  );
}
