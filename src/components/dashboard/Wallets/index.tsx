import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import PortfolioCard from "@/components/common/PortfolioCard";
import {
  blockchain_standards,
  blockchain_units,
  unitName,
} from "@/constants/blockchains";
import { Role } from "@/constants/roles";
import { AccessLevelEnum, balanceType, ModulesEnum } from "@/constants/types";
import { getLocalStorageValue } from "@/utils/cookies";
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

type BlockchainBalance = {
  unit: string | null;
  standard: string | null;
  is_token: boolean;
  isToken: boolean;
  blockchain: string;
  blockchainName: string;
  network: string;
  historyData?: any[];
  total_available_amount: string;
  amount: string;
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
  const user = getLocalStorageValue("user");
  let cryptoWallets = walletsArray?.filter(
    (asset) => asset?.type !== balanceType.fiat
  );

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

  const getWalletData = (asset: BlockchainBalance) => {
    let isToken = asset?.is_token || asset?.isToken;
    let blockchainName = asset?.blockchainName || asset?.blockchain;
    let unit = isToken
      ? asset.unit
      : blockchain_units[blockchainName]?.toUpperCase();

    let standard = isToken ? asset?.standard : blockchain_standards[unit];
    let coinName = unitName[unit?.toLowerCase()];
    let currencyHistoryData = asset?.historyData?.map(
      (item) => item?.rate_open
    );

    let amount = asset?.total_available_amount || asset?.amount;

    return {
      isToken,
      unit,
      standard,
      coinName,
      amount,
      currencyHistoryData,
      blockchainName,
    };
  };

  return (
    <>
      <h3
        className="mb-2 font-nunito text-p120 2xl:text-h4"
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
          {cryptoWallets?.length > 0 ? (
            cryptoWallets?.map((asset) => {
              const {
                coinName,
                isToken,
                standard,
                unit,
                amount,
                currencyHistoryData,
              } = getWalletData(asset);

              return (
                <PortfolioCard
                  isAdmin={user?.role == Role.ADMIN}
                  Balance={+amount}
                  IconSrc={`/currencies/${coinName?.toLowerCase()}.png`}
                  ChartLineData={currencyHistoryData}
                  CurrencyName={coinName || unit}
                  isWalletHasFullAccess={isWalletHasFullAccess}
                  isPaymentHasFullAccess={isPaymenttHasFullAccess}
                  isWithdrawalHasFullAccess={isWithdrawalHasFullAccess}
                  CurrencyTicker={isToken ? `${unit} (${standard})` : unit}
                  onClick={() =>
                    onWalletClick && onWalletClick(unit?.toUpperCase())
                  }
                  onRecieve={() =>
                    onReceive(unit?.toLowerCase(), asset?.standard)
                  }
                  onSend={() => onWithdraw(unit?.toLowerCase())}
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
