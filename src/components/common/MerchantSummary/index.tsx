"use client";

import { BsChevronDown } from "react-icons/bs";
import IconSelectBox from "../IconSelectBox";
import { useState } from "react";

const data = [
  { label: "Deposit", values: [20, 4000, 12000] },
  { label: "Withdrawal", values: [40, 4700, 14000] },
  { label: "Outstanding Balance", values: [110, 7800, 10000] },
];

const columns = ["Today’s", "This Week", "This Month"];

interface Props {
  merchantsList: any[];
}

export default function MerchantSummary({ merchantsList }: Props) {
  const [selctedMerchant, setSelectedMerchant] = useState("ALL");

  const handleChange = (e) => {
    const { value } = e.target;
    setSelectedMerchant(value);
  };

  return (
    <div className="px-5 py-[22px] border rounded-[28px]">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 pb-4 border-b">
        <h3 className="font-nunito text-p120 2xl:text-h4 whitespace-nowrap">
          Merchant Deposit - Withdrawal Summary
        </h3>
        <div className="block">
          <IconSelectBox
            searchable
            options={[
              { label: "All", value: "ALL" },
              ...merchantsList?.map((item) => {
                return {
                  // label: `${item?.first_name} ${item?.last_name}`,
                  label: item?.username,
                  value: item?.userId,
                };
              }),
            ]}
            onChange={handleChange}
            wrapperClassName="!m-0"
            inputContainerClassName="!rounded-full py-3"
            optionsClassName="!right-0 !w-[240px]"
            value={selctedMerchant}
          />
        </div>
      </div>

      {/* Grid Header */}
      <div className="gap-2 grid grid-cols-4 mt-4 mb-4 px-1">
        <div></div>
        {columns.map((col) => (
          <div
            key={col}
            className="w-full font-medium text-[15px] text-purple-600 text-center"
          >
            {col}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="items-center gap-[10px] grid grid-cols-4">
            <div className="bg-purple-gradient px-4 py-[15px] rounded-xl w-full overflow-hidden font-semibold text-[15px] text-white text-center text-ellipsis whitespace-nowrap">
              {item.label}
            </div>
            {item.values.map((value, vIdx) => (
              <div
                key={vIdx}
                className="py-[15px] border rounded-xl overflow-hidden font-semibold text-[#1F243B] text-[15px] text-center text-ellipsis whitespace-nowrap"
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
