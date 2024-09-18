// components/DateField.js
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { CalenderGrayIcon} from "@/assets/Svgs";
import "./style.scss";

interface Props {
  date: string;
  handleChange: (date: Date) => void;
  name: string;
  value:string;
}
export default function DateField({ date, handleChange,name,value }: Props) {
  return (
    <div className="relative border rounded-medium">
      <DatePicker
        value={value}
        name={name}
        selected={date ? moment(date).toDate() : null}
        onChange={handleChange}
        placeholderText="MM/DD/YYYY"
        dateFormat="MM/dd/yyyy"
        className="w-full text-[14px] py-2 px-4 rounded-medium focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300"
        calendarClassName="custom-calendar" // Custom calendar class
      />
      <div className="absolute right-3 top-2.5 pointer-events-none">
        <CalenderGrayIcon />
      </div>
    </div>
  );
}
