import {
  ReciveIconGreen,
  SendIconRed,
  TransferIconPurple,
} from "@/assets/Svgs";
import React from "react";
import { BorderedIconButton } from "../IconButton";
import { formatCustomDate } from "@/utils/dates";

type Props = {
  onClick: () => void;
  direction: "incoming" | "outgoing";
  date: string;
  currencyName: string;
  amount: string;
};

const TransactionCard = ({
  amount,
  currencyName,
  date,
  direction,
  onClick,
}: Props) => {
  return (
    <div className="border border-purple-10 px-3 py-[10px] 2xl:px-5 2xl:py-[13px] w-full flex items-center rounded-[28px] gap-8 justify-between">
      <div className="flex items-center gap-2">
        <div
          className={`w-[35px] h-[35px] md:w-[50px] md:h-[50px] xl:w-[63px] xl:h-[63px] bg-opacity-20 flex items-center justify-center rounded-full ${
            direction == "incoming" ? "bg-green-300" : "bg-red-300"
          }`}
        >
          {direction == "incoming" ? (
            <ReciveIconGreen className="w-[14px] h-[15px] xl:w-[20px] xl:h-[21px]" />
          ) : (
            <SendIconRed className="w-[14px] h-[15px] xl:w-[20px] xl:h-[21px]" />
          )}
        </div>
        <div>
          <h5 className="text-base md:text-button 2xl:text-p120 3xl:text-p122 3.75xl:text-h4 font-semibold leading-2 2xl:leading-[28px] capitalize">
            {currencyName}
          </h5>
          <span className="text-subtitle">{formatCustomDate(date)}</span>
        </div>
      </div>

      <span className="text-base md:text-button 2xl:text-p120 3xl:text-p122 3.75xl:text-h4 font-semibold text-end overflow-hidden text-ellipsis max-w-24">
        {amount}
      </span>
    </div>
  );
};

export default TransactionCard;
