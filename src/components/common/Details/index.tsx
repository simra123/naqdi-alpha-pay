"use client";

import Link from "next/link";
import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";

type Props = {
  value: any;
  label?: string;
  copyable?: boolean;
  link?: string;
  className?: string;
  target?: string;
};

const Details = ({
  label,
  value,
  copyable,
  link,
  className,
  target = "_blank",
}: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {}
  };

  return (
    <div
      className={`flex gap-4 items-start text-button whitespace-nowrap max-w-full overflow-hidden text-ellipsis ${className}`}
    >
      {label && (
        <span className="font-medium text-custom-caption-gray">{label}:</span>
      )}
      {link ? (
        <Link
          href={link}
          target={target}
          className="overflow-hidden font-semibold text-blue-700 hover:text-blue-600 hover:underline text-ellipsis capitalize transition-all"
        >
          {isCopied ? "Copied" : value}
        </Link>
      ) : (
        <span className="overflow-hidden font-semibold text-black-100 text-ellipsis capitalize">
          {isCopied ? "Copied" : value}
        </span>
      )}
      {copyable && (
        <button
          type="button"
          onClick={copyToClipboard(value)}
          className="flex justify-center items-center bg-transparent hover:bg-purple-10 active:bg-purple-20 p-1 border-0 rounded-full outline-0 w-8 h-8 aspect-square text-[14px] transition-all"
        >
          <MdContentCopy className="text-[12px]" />
        </button>
      )}
    </div>
  );
};

export default Details;
