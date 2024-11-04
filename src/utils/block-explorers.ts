import {
  ethereumExplorerBaseURL,
  nileExplorerBaseURL,
  sepoliaExplorerBaseURL,
  tronExplorerBaseURL,
} from "@/constants/block-explorers";

export const showExplorerDetailsByChain = ({
  env,
  blockchain,
  type,
  address,
  hash,
}: {
  env: string;
  blockchain: string;
  type: "address" | "hash";
  address?: string;
  hash?: string;
}) => {
  blockchain = blockchain?.toLowerCase();
  if (blockchain == "tron") {
    if (type == "address") {
      return env == "development"
        ? `${nileExplorerBaseURL}/address/${address}`
        : `${tronExplorerBaseURL}/address/${address}`;
    }
    if (type == "hash") {
      return env == "development"
        ? `${nileExplorerBaseURL}/transaction/${hash}`
        : `${tronExplorerBaseURL}/transaction/${hash}`;
    }
  }

  if (blockchain == "ethereum") {
    if (type == "address") {
      return env == "development"
        ? `${sepoliaExplorerBaseURL}/address/${address}`
        : `${ethereumExplorerBaseURL}/address/${address}`;
    }
    if (type == "hash") {
      return env == "development"
        ? `${sepoliaExplorerBaseURL}/tx/${hash}`
        : `${ethereumExplorerBaseURL}/tx/${hash}`;
    }
  }
  return null;
};
