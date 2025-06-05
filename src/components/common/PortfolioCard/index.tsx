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
  isWalletHasFullAccess: boolean;
  isPaymentHasFullAccess: boolean;
  isWithdrawalHasFullAccess: boolean;
  onSend?: () => void;
  onRecieve?: () => void;
  onTransfer?: () => void;
  onClick?: () => void;
  isAdmin?: boolean;
};

const PortfolioCard = ({
  Balance,
  ChartLineData,
  CurrencyName,
  CurrencyTicker,
  IconSrc,
  isWalletHasFullAccess,
  isPaymentHasFullAccess,
  isWithdrawalHasFullAccess,
  onRecieve,
  onSend,
  onTransfer,
  onClick,
  isAdmin,
}: PortfolioProps) => {
  return (
    <div
      className="flex justify-between items-center gap-5 3.75xl:gap-8 px-3 3.75xl:px-5 py-[10px] border border-purple-10 rounded-[28px] w-full min-w-max"
      onClick={onClick}
    >
      <div className="flex flex-auto justify-between items-center gap-3">
        <div className="flex items-center gap-2 w-[115px] md:w-[200px] 3.75xl:w-[220px]">
          <Image
            src={IconSrc}
            alt="Currency"
            height={63}
            width={63}
            className="rounded-full w-[35px] md:w-[50px] 2xl:w-[55px] 3.75xl:w-[63px] h-[35px] md:h-[50px] 2xl:h-[55px] 3.75xl:h-[63px]"
          />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <h5 className="overflow-hidden font-semibold md:text-button 2xl:text-p120 3.75xl:text-h4 3xl:text-p122 text-base text-ellipsis leading-[28px]">
              {CurrencyName}
            </h5>
            <span>{CurrencyTicker}</span>
          </div>
        </div>
        {!isAdmin && (
          <div className="hidden xxs:block chart-data">
            <SimpleLineChart
              dataPoints={ChartLineData}
              className="w-[60px] xs:w-[80px] 2.5xl:w-[120px] 3.75xl:w-[150px]"
            />
          </div>
        )}

        <div className="flex flex-col w-[100px] md:w-[130px] text-end balance">
          <span className="text-subtitle">Total Balance</span>
          <span className="overflow-hidden font-semibold md:text-button 2xl:text-p120 3.75xl:text-h4 3xl:text-p122 text-base text-ellipsis">
            {Balance}
          </span>
        </div>
      </div>

      {!isAdmin && (
        <div
          className="hidden 2.5xl:flex gap-3 3.75xl:gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="hidden 2.5xl:block">
            <BorderedIconButton
              tooltipId="recieve-card-button"
              className="bg-green-300 bg-opacity-20 !border-0 w-[55px] 3.75xl:w-[75px] h-[55px] 3.75xl:h-[75px]"
              disabled={!isPaymentHasFullAccess}
              tooltip={
                "You don't have sufficient permissions to initate a deposit."
              }
              hoveredClasses={`hover:!bg-green-200 active:!bg-green-300`}
              onClick={isPaymentHasFullAccess && onRecieve}
            >
              <ReciveIconGreen />
            </BorderedIconButton>
          </div>
          <div className="hidden 3xl:block">
            <BorderedIconButton
              tooltipId="send-card-button"
              disabled={!isWithdrawalHasFullAccess}
              tooltip={
                "You don't have sufficient permissions to initate a withdrawal."
              }
              className="bg-red-300 bg-opacity-20 !border-0 w-[55px] 3.75xl:w-[75px] h-[55px] 3.75xl:h-[75px]"
              hoveredClasses={`hover:!bg-red-200 active:!bg-red-300`}
              onClick={isWithdrawalHasFullAccess && onSend}
            >
              <SendIconRed />
            </BorderedIconButton>
          </div>
          <div className="hidden 3.5xl:block">
            <BorderedIconButton
              tooltipId="transfer-card-button"
              disabled={!isWalletHasFullAccess}
              className="bg-purple-300 bg-opacity-20 !border-0 w-[55px] 3.75xl:w-[75px] h-[55px] 3.75xl:h-[75px]"
              tooltip={
                "You don't have sufficient permissions to initate a transfer."
              }
              hoveredClasses={`hover:!bg-purple-200 active:!bg-purple-300`}
              onClick={isWalletHasFullAccess && onTransfer}
            >
              <TransferIconPurple />
            </BorderedIconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioCard;
