import momentTZ from "moment-timezone";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import AmountFormat from "@/components/common/AmountFormat";
import Chip from "@/components/common/Chip";
import { capitalize } from "@/utils/dataFormatters";

// Reusable enhancer
export function applyColumnEnhancements(columns: any[]) {
  return columns.map((column) => {
    const name = column.listColumnsMeta.name;

    if (["wallet.address", "recipient_address"].includes(name)) {
      return {
        ...column,
        copyable: true,
        link: (row: any) => {
          return showExplorerDetailsByChain({
            env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
            blockchain:
              row?.wallet?.blockchain || row?.contract_address?.blockchain_name,
            type: "address",
            address: row?.wallet?.address || row?.[name],
          });
        },
      };
    }

    if (["sender_address", "receiver_address"].includes(name)) {
      return {
        ...column,
        copyable: true,
        link: (row: any) => {
          return showExplorerDetailsByChain({
            env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
            blockchain:
              row?.transaction_request?.contract_address?.blockchain_name,
            type: "address",
            address: row?.[name],
          });
        },
      };
    }

    if (["hash"].includes(name)) {
      return {
        ...column,
        copyable: true,
        link: (row: any) => {
          return showExplorerDetailsByChain({
            env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
            blockchain:
              row?.transaction_request?.contract_address?.blockchain_name,
            type: "hash",
            address: row?.hash,
          });
        },
      };
    }

    if (["created_at", "updated_at"].includes(name)) {
      return {
        ...column,
        dataValidator: (value: string) => {
          const currentTimeZone = momentTZ.tz.guess();
          const date = momentTZ(value)
            .tz(currentTimeZone)
            .format("DD-MM-YYYY.hh:mm A");
          const [day, time] = date.split(".");
          return (
            <div className="flex flex-col gap-1">
              <span className="text-caption">{day}</span>
              <span className="text-custom-title-gray text-subtitle">
                {time}
              </span>
            </div>
          );
        },
      };
    }

    if (["initial_amount", "net_amount", "paid_amount", "fee"].includes(name)) {
      return {
        ...column,
        dataValidator: (value: string) => (
          <AmountFormat amount={value} type="crypto" />
        ),
      };
    }

    if (
      [
        "contract_address.blockchain_name",
        "transaction_request.contract_address.blockchain_name",
      ].includes(name)
    ) {
      return {
        ...column,
        dataValidator: (value: string) => capitalize(value),
      };
    }

    if (
      [
        "fiat_initial_amount",
        "fiat_net_amount",
        "fiat_fee",
        "transaction_request.fiat_paid_amount",
        "transaction_request.fiat_paid_fee",
      ].includes(name)
    ) {
      return {
        ...column,
        dataValidator: (value: string) => (
          <AmountFormat amount={value} type="fiat" />
        ),
      };
    }

    if (name === "status") {
      return {
        ...column,
        dataValidator: (value: string) => <Chip status={value} />,
      };
    }

    if (
      ["transaction_request.fee_value"].includes(column.listColumnsMeta.name)
    ) {
      return {
        ...column,
        dataValidator: (value: string) => {
          return `${value} %`;
        },
      };
    }

    return column;
  });
}
