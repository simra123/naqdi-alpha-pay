// pages/Balances.tsx
import { BalanceRow } from "./BalanceRow";

interface BalanceProps {
  balances: any[];
  error: string | boolean | null;
  loading: boolean;
}

const Balances = ({ balances, error, loading }: BalanceProps) => {
  return (
    <>
    <h4 className="mb-4 font-semibold text-[25px]">Crypto Wallets</h4>
    <div className="relative bg-white rounded-md overflow-auto">
      <div className="bg-table-header z-50 top-0 sticky grid grid-cols-[1fr_1fr_1fr_40px] mr-2 px-4 py-1 font-semibold text-caption text-purple-500">
        <div></div>
        <div className="">Portal Balance</div>
        <div className="">Vaultody Balance</div>
        <div className="text-right">Sync</div>
      </div>
      {balances?.map((item) => (
          <BalanceRow key={item.token} item={item} />
        ))}
    </div>
        </>
  );
};

export default Balances;
