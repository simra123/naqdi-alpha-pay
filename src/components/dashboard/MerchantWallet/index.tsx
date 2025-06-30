import { formatAmount } from "@/components/common/AmountFormat/utils";
import ErrorApiText from "@/components/common/ErrorApiText";
import React, { memo } from "react";
import CountUp from "react-countup";

type Props = {
  balance: { totalUSD: number; totalDeposit: number; totalWithdrawal: number };
  error: any;
};

const MerchantWallet = ({ balance, error }: Props) => {
  return (
    <>
      <div>
        <h4 className="font-nunito font-semibold text-button text-white text-center">
          Wallet
        </h4>
        <h3 className="overflow-hidden font-nunito font-semibold text-[40px] text-white 2.5xl:text-[55px] text-center text-ellipsis leading-[60px]">
          $
          <CountUp
            end={balance.totalUSD}
            separator=","
            decimal="."
            decimals={3}
            formattingFn={(n) =>
              formatAmount({ amount: n, type: "fiat" }).fixedRaw
            }
          />
        </h3>
        <ErrorApiText error={error} />
      </div>

      <div className="flex justify-around py-[36px] border-[#654178] border-y">
        <div>
          <h4 className="font-nunito text-caption text-white xs:text-button text-center">
            Total Deposit
          </h4>
          <h3 className="overflow-hidden font-nunito font-semibold text-[25px] text-white xs:text-[35px] text-center text-ellipsis leading-[40px]">
            $
            <CountUp
              end={balance.totalDeposit}
              separator=","
              decimal="."
              decimals={3}
              formattingFn={(n) =>
                formatAmount({ amount: n, type: "fiat" }).fixedRaw
              }
            />
          </h3>
        </div>
        <div>
          <h4 className="font-nunito text-caption text-white xs:text-button text-center">
            Total Withdrawal
          </h4>
          <h3 className="overflow-hidden font-nunito font-semibold text-[25px] text-white xs:text-[35px] text-center text-ellipsis leading-[40px]">
            $
            <CountUp
              end={balance.totalWithdrawal}
              separator=","
              decimal="."
              decimals={3}
              formattingFn={(n) =>
                formatAmount({ amount: n, type: "fiat" }).fixedRaw
              }
            />
          </h3>
        </div>
      </div>
    </>
  );
};

export default memo(MerchantWallet);
