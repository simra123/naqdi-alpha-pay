import { formatAmount } from "@/components/common/AmountFormat/utils";
import ErrorApiText from "@/components/common/ErrorApiText";
import React, { memo } from "react";
import CountUp from "react-countup";

type Props = {
  adminBalances: {
    fiatAmount: { fee: number; merchant: number; wallet: number };
  };
  error: any;
};

const AdminWallet = ({ adminBalances, error }: Props) => {
  return (
    <div className="flex flex-col bg-purple-gradient mb-4 px-[15px] pt-[19px] pb-4 rounded-[20px]">
      <h4 className="font-nunito font-light text-caption text-white text-center">
        Wallet
      </h4>

      <h3 className="overflow-hidden font-nunito font-bold text-[20px] text-white 2.5xl:text-[22px] text-center text-ellipsis">
        $
        <CountUp
          end={adminBalances?.fiatAmount?.wallet}
          separator=","
          decimal="."
          decimals={3}
          formattingFn={(n) =>
            formatAmount({ amount: n, type: "fiat" }).fixedRaw
          }
        />
      </h3>

      <div className="flex justify-around bg-[#7D5197] my-[16px] h-[1px]" />

      <div className="flex justify-around items-center gap-3">
        <div>
          <h4 className="font-nunito font-light text-caption text-white text-center">
            Merchant Balance
          </h4>

          <h3 className="overflow-hidden font-nunito font-bold text-[20px] text-white 2.5xl:text-[22px] text-center text-ellipsis">
            $
            <CountUp
              end={adminBalances?.fiatAmount?.merchant}
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
          <h4 className="font-nunito font-light text-caption text-white text-center">
            Fee Balance
          </h4>

          <h3 className="overflow-hidden font-nunito font-bold text-[20px] text-white 2.5xl:text-[22px] text-center text-ellipsis">
            $
            <CountUp
              end={adminBalances?.fiatAmount?.fee}
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
      <ErrorApiText error={error} />
    </div>
  );
};

export default memo(AdminWallet);
