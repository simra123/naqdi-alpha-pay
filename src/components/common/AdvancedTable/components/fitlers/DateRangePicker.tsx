import React, { useState, useRef, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";
import { CalenderGrayIcon, RangeIcon } from "@/assets/Svgs";

const DateRangeField = ({ dateRange, setDateRange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  // Ref for the date range picker container
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleSelect = (ranges: any) => {
    setDateRange([ranges.selection]);

  };

  // Close the calendar when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div
        onClick={() => setShowCalendar(!showCalendar)}
        className={`border p-[9px] rounded w-full cursor-pointer flex items-center gap-2 overflow-hidden text-ellipsis   ${
          showCalendar ? "border-purple" : ""
        }`}
      >
        <span className="mr-3">
          <CalenderGrayIcon />
        </span>
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
          <span>
            {" "}
            {dateRange[0].startDate
              ? moment(dateRange[0].startDate).format("DD MMM, YYYY")
              : "Start Date"}
          </span>
          <RangeIcon />
          <span>
            {dateRange[0].endDate
              ? moment(dateRange[0].endDate).format("DD MMM, YYYY")
              : "End Date"}
          </span>
        </div>
      </div>
      {showCalendar && (
        <div
          ref={calendarRef}
          className="right-0 z-10 absolute shadow-lg mt-2 mb-2"
        >
          <DateRangePicker
            onChange={handleSelect}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={dateRange.map((range) => ({
              ...range,
              startDate: range.startDate || new Date(), // Default to today if null
              endDate: range.endDate || new Date(),
            }))}
            direction="horizontal"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeField;
