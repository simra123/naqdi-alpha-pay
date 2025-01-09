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
    <div className="border border-purple-10 px-5 py-[13px] w-full flex items-center rounded-[28px] gap-8 justify-between">
      <div className="flex items-center gap-2">
        <div
          className={`w-[63px] h-[63px] bg-opacity-20 flex items-center justify-center rounded-full ${
            direction == "incoming" ? "bg-green-300" : "bg-red-300"
          }`}
        >
          {direction == "incoming" ? <ReciveIconGreen /> : <SendIconRed />}
        </div>
        <div>
          <h5 className="text-h4 font-semibold leading-[28px] capitalize">
            {currencyName}
          </h5>
          <span className="text-subtitle">{formatCustomDate(date)}</span>
        </div>
      </div>

      <span className="text-h4 font-semibold text-end overflow-hidden text-ellipsis">{amount}</span>
    </div>
  );
};

export default TransactionCard;
