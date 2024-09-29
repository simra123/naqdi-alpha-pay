// components/FilterModal.js

import { useState } from "react";

const FilterModal = ({ isOpen, onClose, column, applyFilter }) => {
  const [filterValue, setFilterValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="font-medium leading-tight mb-4">
          Filter by {column.Header}
        </h3>
        <input
          type="text"
          className="border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm w-full mb-4"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => applyFilter(filterValue)}
        >
          Apply
        </button>
        <button
          className="ml-4 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
