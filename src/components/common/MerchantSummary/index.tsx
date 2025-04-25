"use client";

import { BsChevronDown } from "react-icons/bs";

const data = [
  { label: "Deposit", values: [20, 4000, 12000] },
  { label: "Withdrawal", values: [40, 4700, 14000] },
  { label: "Fee", values: [10, 5500, 20000] },
  { label: "Withdrawal Fee", values: [30, 8000, 10000] },
  { label: "Balance Fee", values: [70, 6000, 40000] },
  { label: "Outstanding Balance", values: [110, 7800, 10000] },
];

const columns = ["Today’s", "This Week", "This Month"];

export default function MerchantSummary() {
  return (
    <div className="px-5 py-[30px] border rounded-[28px]">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="font-semibold text-[#1F243B] text-lg">
          Merchant Deposit - Withdrawal Summary
        </h2>
        <button className="flex items-center gap-2 bg-white hover:bg-gray-50 shadow-sm px-4 py-1.5 border border-gray-200 rounded-full text-[#1F243B] text-sm">
          All
          <BsChevronDown size={16} />
        </button>
      </div>

      {/* Grid Header */}
      <div className="gap-8 grid grid-cols-4 mt-4 mb-4 px-1">
        <div></div>
        {columns.map((col) => (
          <div
            key={col}
            className="w-full font-medium text-purple-600 text-sm text-center"
          >
            {col}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="items-center gap-8 grid grid-cols-4">
            <div className="bg-purple-gradient px-4 py-2 rounded-xl w-full font-medium text-white text-sm text-center">
              {item.label}
            </div>
            {item.values.map((value, vIdx) => (
              <div
                key={vIdx}
                className="py-2 border rounded-xl font-medium text-[#1F243B] text-sm text-center"
              >
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
