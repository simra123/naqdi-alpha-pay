// components/BalanceRow.tsx
import { useState } from "react";
import { LiaSyncAltSolid } from "react-icons/lia";
import clsx from "clsx";
import { getWalletData } from "@/utils/dataFormatters";
import AmountFormat from "../AmountFormat";

interface BalanceRowProps {
  item: any;
}

export const BalanceRow: React.FC<BalanceRowProps> = ({ item }) => {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000)); // mock
    setLoading(false);
  };

  const {
    amount,
    blockchainName,
    coinName,
    currencyHistoryData,
    isToken,
    standard,
    unit,
  } = getWalletData(item);

  return (
    <div className="items-center gap-x-3 grid grid-cols-[1fr_1fr_1fr_40px] mr-2 px-4 py-[14.5px] border-b">
      <div className="flex items-center gap-2 pr-3">
        <img
          className="rounded-full w-[40px] h-[40px]"
          src={`/currencies/${coinName?.toLowerCase()}.png`}
        />
        <span className="font-semibold capitalize">
          {isToken ? unit : blockchainName}
        </span>
      </div>
      <div className="pr-3 overflow-hidden font-semibold text-ellipsis">
        <AmountFormat amount={amount} type="crypto" />
      </div>
      <div className="pr-3 overflow-hidden font-semibold text-ellipsis">
        <AmountFormat amount={amount} type="crypto" />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSync}
          disabled={loading}
          className={clsx(
            "bg-purple-gradient p-[6px] rounded-full text-white transition",
            loading ? "animate-spin" : "hover:brightness-90"
          )}
        >
          <LiaSyncAltSolid size={23} />
        </button>
      </div>
    </div>
  );
};
