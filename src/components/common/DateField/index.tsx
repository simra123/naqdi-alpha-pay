import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import ReactDOM from "react-dom";
import "./style.scss";
import { MdCalendarMonth } from "react-icons/md";
import { CalenderGrayIcon } from "@/assets/Svgs";

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
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex">
      <DatePicker
        value={value}
        name={name}
        selected={date ? moment(date).toDate() : null}
        onChange={handleChange}
        placeholderText="Select Date & Time"
        showTimeSelect
        timeFormat="hh:mm a"
        timeIntervals={10} // You can change this to 5, 10, 30, etc.
        timeCaption="Time"
        dateFormat="MM/dd/yyyy hh:mm aa" // Ensure AM/PM is included
        className={`w-full text-[14px] py-[10px] focus:outline-none ${className}`}
        calendarClassName="custom-calendar z-10000"
        popperClassName="!z-[10000]"
        icon={<CalenderGrayIcon />}
        showIcon
        popperContainer={(props) =>
          ReactDOM.createPortal(<div {...props} />, document.body)
        }
      />
    </div>
  );
}
