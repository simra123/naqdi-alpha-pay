import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import PortfolioCard from "@/components/common/PortfolioCard";
import { unitName } from "@/constants/blockchains";
import { Role } from "@/constants/roles";
import { AccessLevelEnum, balanceType, ModulesEnum } from "@/constants/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { hasMinAccess } from "@/utils/cookies";
import React from "react";

type Props = {
  walletsArray: any[];
  heading?: string;
  error?: boolean | string;
  loading?: boolean;
  onWalletClick?: (currencyTicker: string) => void;
  onReceive?: (blockchain: string, standard: string) => void;
  onWithdraw?: (currencyTicker: string) => void;
  onHeadingClick?: () => void;
};

const Wallets = ({
  walletsArray,
  onWalletClick,
  error,
  loading,
  heading,
  onHeadingClick,
  onReceive,
  onWithdraw,
}: Props) => {
  const user = useLocalStorage("user");

  const isWalletHasFullAccess = hasMinAccess(
    ModulesEnum.wallet,
    AccessLevelEnum.full
  );

  const isPaymenttHasFullAccess = hasMinAccess(
    ModulesEnum.payment,
    AccessLevelEnum.full
  );

  const isWithdrawalHasFullAccess = hasMinAccess(
    ModulesEnum.withdrawal,
    AccessLevelEnum.full
  );
  return (
    <>
      <h3
        className="mb-2 font-nunito text-p120 2xl:text-h4 cursor-pointer"
        onClick={onHeadingClick}
      >
        {heading}
      </h3>

      <div
        className={`flex flex-col flex-1 gap-[14px] pr-4 ${
          user?.role == Role.ADMIN ? "3.75xl:w-[500px]" : ""
        } overflow-y-auto portfolio-body`}
      >
        <LoadingApi loading={loading}>
          {walletsArray?.length > 0 ? (
            walletsArray?.filter((asset) => asset?.type !== balanceType.fiat)?.map((asset) => {
              let unit = asset?.unit;
              let tokenName = `${unit} ${
                asset?.standard ? `(${asset?.standard})` : ""
              }`;
              let coinName = unitName[unit?.toLowerCase()] || "Unknown";
              let currencyTicker = asset?.standard == "coin" ? unit : tokenName;
              let currencyHistoryData = asset?.historyData?.map(
                (item) => item?.rate_open
              );
              let depoistBlockchain = asset?.standard
                ? unit
                : coinName?.toLowerCase();
              return (
                <PortfolioCard
                  isAdmin={user?.role == Role.ADMIN}
                  Balance={asset?.totalAmount || asset?.amount}
                  IconSrc={`/currencies/${coinName?.toLowerCase()}.png`}
                  ChartLineData={currencyHistoryData}
                  CurrencyName={coinName}
                  isWalletHasFullAccess={isWalletHasFullAccess}
                  isPaymentHasFullAccess={isPaymenttHasFullAccess}
                  isWithdrawalHasFullAccess={isWithdrawalHasFullAccess}
                  CurrencyTicker={currencyTicker}
                  onClick={() => onWalletClick(unit?.toUpperCase())}
                  onRecieve={() =>
                    onReceive(depoistBlockchain, asset?.standard)
                  }
                  onSend={() => onWithdraw(currencyTicker)}
                  onTransfer={() => {}}
                />
              );
            })
          ) : !error ? (
            "No Assets Found. Deposit Assets to see them here."
          ) : (
            <></>
          )}
        </LoadingApi>
        <ErrorApiText error={error} />
      </div>
    </>
  );
};

export default Wallets;
