import { capitalize } from "@/utils/dataFormatters";
import React from "react";

type Props = {
  Icon: any;
  value: string;
  label: string;
};

const Details = ({ Icon, label, value }: Props) => {
  return (
    // <div className="gap-3 flex items-center p-2 overflow-hidden text-nowrap max-w-[80%]">
    //   <div className="text-purple-100 bg-detail-circle w-[42px] h-[42px] flex items-center justify-center rounded-full p-2">
    //     <Icon />
    //   </div>

    //   <div className="flex flex-col gap-1">
    //     <span className=" text-custom-title-gray font-medium text-ellipsis">
    //       {capitalize(value)}
    //     </span>
    //     <span className="text-[13px] text-custom-caption-gray font-medium">
    //       {label}
    //     </span>
    //   </div>
    // </div>

    <div className="flex gap-4 items-center text-button whitespace-nowrap max-w-full overflow-hidden">
      <span className="text-custom-caption-gray font-medium">{label}:</span>
      <span className=" text-black-100 font-semibold text-ellipsis overflow-hidden">
        {capitalize(value)}
      </span>
    </div>
  );
};

export default Details;
