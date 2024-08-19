// components/FilterDropdown.js

import React, { useState } from "react";
import { KeyboardArrowRight } from "@mui/icons-material";

import "./style.scss";

const FilterDropdown = ({ column, rows, setCurrentRows, columnsList }) => {
  const [filters, setFilters] = useState([]);

  const filterData = (value) => {
    const filtered = rows.filter((row) =>
      row[column.field].toString().includes(value)
    );
    setCurrentRows(filtered);
  };

  console.log(columnsList);

  const handleCheckboxChange = (col) => {
    console.log(col);
  };

  return (
    // <div
    //   className="absolute top-full mt-2 -left-8 bg-white border rounded shadow-lg z-10 p-2"
    //   onClick={(e) => e.stopPropagation()}
    // >

    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute top-full ${
        columnsList[columnsList.length - 1].field == column.field
          ? "right-0"
          : "-left-20"
      } max-h-80 overflow-y-auto bg-white border p-3 border-light-gray rounded-large mt-1 shadow-lg z-10`}
    >
      {columnsList?.map(
        (col, index) =>
          col?.filterable && (
            <div
              key={col?.field}
              className={`flex justify-between items-center p-3 cursor-pointer text-nowrap ${
                index === 0
                  ? "rounded-t-md"
                  : index === columnsList?.length - 1
                  ? "rounded-b-md"
                  : ""
              } ${
                col?.field === col.headerName
                  ? "bg-light-purple text-purple-100"
                  : "hover:bg-light-purple hover:text-black-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={col?.checked}
                    onChange={() => handleCheckboxChange(col?.field)}
                  />
                  <span className="checkmark"></span>
                </label>
                <span className="capitalize font-normal text-p16">
                  {" "}
                  {col?.headerName}{" "}
                </span>
              </div>
              <KeyboardArrowRight />
            </div>
          )
      )}
    </div>

    /* {column.type === "date" && (
        <input
          type="date"
          onChange={(e) => filterData(e.target.value)}
          className="p-2 border-b"
        />
      )}
      {column.type === "list" && (
        <select
          onChange={(e) => filterData(e.target.value)}
          className="p-2 border-b"
        >
          {Array.from(new Set(rows.map((row) => row[column.field]))).map(
            (value: string) => (
              <option key={value} value={value}>
                {value}
              </option>
            )
          )}
        </select>
      )}
      {column.type === "string" && (
        <input
          type="text"
          placeholder="Filter..."
          onChange={(e) => filterData(e.target.value)}
          className="p-2 border-b"
        />
      )} */
    // </div>
  );
};

export default FilterDropdown;
