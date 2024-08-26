"use client";

import Details from "@/components/common/Details";
import IconSelectBox from "@/components/common/IconSelectBox";
import LoaderButton from "@/components/common/LoaderButton";
import { Mail } from "@mui/icons-material";
import React, { useState } from "react";

const supportOptions = [
  { label: "Deposit Issue", value: "Deposit Issue" },
  { label: "Payment Issue", value: "Payment Issue" },
  { label: "WIthdrawal Issue", value: "WIthdrawal Issue" },
];

const Support = () => {
  const [supportData, setSupportData] = useState({
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSupportData((pre) => ({ ...pre, [name]: value }));
  };

  return (
    <div className="rounded-medium flex flex-col  bg-white p-6 shadow-sm">
      <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">Need Help</h3>

      <div className="mt-8 max-w-full w-[480px]">
        <IconSelectBox
          options={supportOptions}
          onChange={handleChange}
          label={<span className="text-button font-semibold">Subject</span>}
          name="subject"
          placeholder="Select your Subject"
          inputContainerClassName="!bg-blackGrey-filled-input"
          value={supportData.subject}
        />
      </div>

      <div className="flex flex-col gap-2 mt-8">
        <label className="block mb-1 font-medium">Message</label>

        <textarea
          value={supportData?.message}
          placeholder="Your Message Here"
          onChange={handleChange}
          name="message"
          className={`border border-light-gray p-4 resize-none text-gray-400 font-medium w-full min-h-36 rounded-medium bg-light-gray outline-none`}
        />
      </div>

      <div className="flex gap-4 items-center mt-20 flex-wrap mb-8">
        <LoaderButton
          content="Contact Support"
          variant="contained"
          className="w-[310px] max-w-full"
        />
      </div>
    </div>
  );
};

export default Support;
