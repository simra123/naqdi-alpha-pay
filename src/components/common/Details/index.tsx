import { capitalize } from "@/utils/dataFormatters";
import React from "react";

type Props = {
  value: string;
  label: string;
};

const Details = ({ label, value }: Props) => {
  return (
    <div className="flex gap-4 items-center text-button whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
      <span className="text-custom-caption-gray font-medium text-ellipsis overflow-hidden">
        {label}:
      </span>
      <span className=" text-black-100 font-semibold text-ellipsis overflow-hidden capitalize">
        {value}
      </span>
    </div>
  );
};

export default Details;
