import {
  ReciveIconGreen,
  SendIconRed,
  TransferIconPurple,
} from "@/assets/Svgs";
import React from "react";
import { BorderedIconButton } from "../IconButton";
import SimpleLineChart from "@/components/SimpleLineChart";
import Image from "next/image";

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
      className="border border-purple-10 px-3 3.75xl:px-5 py-[10px] min-w-max w-full flex items-center rounded-[28px] gap-5 3.75xl:gap-8 justify-between"
      onClick={onClick}
    >
      <div className="flex items-center justify-between flex-auto">
        <div className="flex items-center gap-2 w-[115px] md:w-[170px] 3.5xl:w-[180px] 3.75xl:w-[220px]">
          <Image
            src={IconSrc}
            alt="Currency"
            height={63}
            width={63}
            className="w-[35px] h-[35px] md:w-[50px] md:h-[50px] 2xl:w-[55px] 2xl:h-[55px] 3.75xl:w-[63px] 3.75xl:h-[63px] rounded-full"
          />
          <div className="text-ellipsis overflow-hidden">
            <h5 className="text-base md:text-button 2xl:text-p120 3xl:text-p122 3.75xl:text-h4 font-semibold leading-[28px] text-ellipsis overflow-hidden">
              {CurrencyName}
            </h5>
            <span>{CurrencyTicker}</span>
          </div>
        </div>
        <div className="chart-data hidden xxs:block">
          <SimpleLineChart
            dataPoints={ChartLineData}
            className="3.75xl:w-[150px] 2.5xl:w-[120px] w-[60px] xs:w-[80px]"
          />
        </div>

        <div className="balance flex flex-col text-end w-[100px] md:w-[130px]">
          <span className="text-subtitle">Available Balance</span>
          <span className="text-base md:text-button 2xl:text-p120 3xl:text-p122 3.75xl:text-h4 font-semibold overflow-hidden text-ellipsis">
            {Balance}
          </span>
        </div>
      </div>

      <div
        className="gap-3 3.75xl:gap-6 2.5xl:flex hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hidden 2.5xl:block">
          <BorderedIconButton
            className="w-[55px] h-[55px] 3.75xl:w-[75px] 3.75xl:h-[75px] bg-green-300 active:!bg-green-300 bg-opacity-20 hover:!bg-green-200 !border-0"
            onClick={onRecieve}
          >
            <ReciveIconGreen />
          </BorderedIconButton>
        </div>
        <div className="hidden 3xl:block">
          <BorderedIconButton
            className="w-[55px] h-[55px] 3.75xl:w-[75px] 3.75xl:h-[75px] bg-red-300 active:!bg-red-300 bg-opacity-20 hover:!bg-red-200 !border-0"
            onClick={onSend}
          >
            <SendIconRed />
          </BorderedIconButton>
        </div>
        <div className="hidden 3.5xl:block">
          <BorderedIconButton
            className="w-[55px] h-[55px] 3.75xl:w-[75px] 3.75xl:h-[75px] bg-purple-300 active:!bg-purple-300 bg-opacity-20 hover:!bg-purple-200 !border-0"
            onClick={onTransfer}
          >
            <TransferIconPurple />
          </BorderedIconButton>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
