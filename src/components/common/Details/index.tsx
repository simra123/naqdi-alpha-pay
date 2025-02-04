"use client";

import { ContentCopy } from "@mui/icons-material";
import React, { useState } from "react";

type Props = {
  value: any;
  label?: string;
  copyable?: boolean;
  link?: string;
  className?: string;
};

const Details = ({ label, value, copyable, link, className }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      className={`flex gap-4 items-center text-button whitespace-nowrap max-w-full overflow-hidden text-ellipsis ${className}`}
    >
      {label && (
        <span className="text-custom-caption-gray font-medium">{label}:</span>
      )}
      {link ? (
        <a
          href={link}
          target="_blank"
          className="hover:text-blue-700 hover:underline transition-all text-black-100 font-semibold text-ellipsis overflow-hidden capitalize"
        >
          {isCopied ? "Copied" : value}
        </a>
      ) : (
        <span className=" text-black-100 font-semibold text-ellipsis overflow-hidden capitalize">
          {isCopied ? "Copied" : value}
        </span>
      )}
      {copyable && (
        <button
          type="button"
          onClick={copyToClipboard(value)}
          className="bg-transparent border-0 outline-0 text-[14px] hover:bg-purple-10 active:bg-purple-20 transition-all w-8 h-8 aspect-square rounded-full p-1"
        >
          <ContentCopy className="text-[12px]" />
        </button>
      )}
    </div>
  );
};

export default Details;
