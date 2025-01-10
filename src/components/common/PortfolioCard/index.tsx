import {
  ReciveIconGreen,
  SendIconRed,
  TransferIconPurple,
} from "@/assets/Svgs";
import React from "react";
import { BorderedIconButton } from "../IconButton";
import SimpleLineChart from "@/components/SimpleLineChart";

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
    <div
      className="border border-purple-10 px-5 py-[10px] min-w-max w-full flex items-center rounded-[28px] gap-8 justify-between"
      onClick={onClick}
    >
      <div className="flex items-center justify-between flex-auto">
        <div className="flex items-center gap-2 w-[220px]">
          <img
            src={IconSrc}
            alt="Currency"
            className="w-[63px] h-[63px] rounded-full"
          />
          <div className="text-ellipsis overflow-hidden">
            <h5 className="text-h4 font-semibold leading-[28px] text-ellipsis overflow-hidden">
              {CurrencyName}
            </h5>
            <span>{CurrencyTicker}</span>
          </div>
        </div>
        <div className="chart-data">
          <SimpleLineChart dataPoints={ChartLineData} />
        </div>

        <div className="balance flex flex-col text-end w-[130px]">
          <span className="text-subtitle">Available Balance</span>
          <span className="text-h4 font-semibold overflow-hidden text-ellipsis">
            {Balance}
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <BorderedIconButton
          className="w-[75px] h-[75px] bg-green-300 active:!bg-green-300 bg-opacity-20 hover:!bg-green-200 !border-0"
          onClick={onRecieve}
        >
          <ReciveIconGreen />
        </BorderedIconButton>
        <BorderedIconButton
          className="w-[75px] h-[75px] bg-red-300 active:!bg-red-300 bg-opacity-20 hover:!bg-red-200 !border-0"
          onClick={onSend}
        >
          <SendIconRed />
        </BorderedIconButton>
        <BorderedIconButton
          className="w-[75px] h-[75px] bg-purple-300 active:!bg-purple-300 bg-opacity-20 hover:!bg-purple-200 !border-0"
          onClick={onTransfer}
        >
          <TransferIconPurple />
        </BorderedIconButton>
      </div>
    </div>
  );
};

export default PortfolioCard;
