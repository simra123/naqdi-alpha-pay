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
  currencyName: string | React.ReactElement;
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
    <div
      className="flex justify-between items-center gap-8 hover:bg-light-gray px-3 2xl:px-5 py-[10px] 2xl:py-[13px] border border-purple-10 rounded-[28px] w-full transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-[35px] h-[35px] md:w-[50px] md:h-[50px] xl:w-[63px] xl:h-[63px] bg-opacity-20 flex items-center justify-center rounded-full ${
            direction == "incoming" ? "bg-green-300" : "bg-red-300"
          }`}
        >
          {direction == "incoming" ? (
            <ReciveIconGreen className="w-[14px] xl:w-[20px] h-[15px] xl:h-[21px]" />
          ) : (
            <SendIconRed className="w-[14px] xl:w-[20px] h-[15px] xl:h-[21px]" />
          )}
        </div>
        <div>
          <h5 className="font-semibold md:text-button 2xl:text-p120 3.75xl:text-h4 3xl:text-p122 text-base capitalize leading-2 2xl:leading-[28px]">
            {currencyName}
          </h5>
          <span className="text-subtitle">{formatCustomDate(date)}</span>
        </div>
      </div>

      <span className="max-w-24 overflow-hidden font-semibold md:text-button 2xl:text-p120 3.75xl:text-h4 3xl:text-p122 text-base text-end text-ellipsis">
        {amount}
      </span>
    </div>
  );
};

export default TransactionCard;
