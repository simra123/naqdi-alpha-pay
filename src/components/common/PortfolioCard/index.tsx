import {
  ReciveIconGreen,
  SendIconRed,
  TransferIconPurple,
} from "@/assets/Svgs";
import React from "react";
import { BorderedIconButton } from "../IconButton";

type PortfolioProps = {
  IconSrc: string;
  CurrencyName: string;
  CurrencyTicker: string;
  ChartLineData: any;
  Balance: number;
  onSend: () => void;
  onRecieve: () => void;
  onTransfer: () => void;
  onClick: () => void;
};

const PortfolioCard = ({
  Balance,
  ChartLineData,
  CurrencyName,
  CurrencyTicker,
  IconSrc,
  onRecieve,
  onSend,
  onTransfer,
  onClick,
}: PortfolioProps) => {
  return (
    <div className="border border-purple-10 px-5 py-[10px] w-full flex items-center rounded-[28px] gap-8 justify-between">
      <div className="flex items-center justify-between flex-auto">
        <div className="flex items-center gap-2">
          <img
            src={IconSrc}
            alt="Currency"
            className="w-[63px] h-[63px] rounded-full"
          />
          <div>
            <h5 className="text-h4 font-semibold leading-[28px]">{CurrencyName}</h5>
            <span>{CurrencyTicker}</span>
          </div>
        </div>
        <div className="chart-data">_____________</div>

        <div className="balance flex flex-col">
          <span className="text-subtitle">Available Balance</span>
          <span className="text-h4 font-semibold text-end">{Balance}</span>
        </div>
      </div>

      <div className="flex gap-6">
        <BorderedIconButton className="w-[75px] h-[75px] bg-green-300 active:!bg-green-300 bg-opacity-20 hover:!bg-green-200 !border-0">
          <ReciveIconGreen />
        </BorderedIconButton>
        <BorderedIconButton className="w-[75px] h-[75px] bg-red-300 active:!bg-red-300 bg-opacity-20 hover:!bg-red-200 !border-0">
          <SendIconRed />
        </BorderedIconButton>
        <BorderedIconButton className="w-[75px] h-[75px] bg-purple-300 active:!bg-purple-300 bg-opacity-20 hover:!bg-purple-200 !border-0">
          <TransferIconPurple />
        </BorderedIconButton>
      </div>
    </div>
  );
};

export default PortfolioCard;
