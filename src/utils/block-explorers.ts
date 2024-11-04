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
      return env == "production"
        ? `${tronExplorerBaseURL}/address/${address}`
        : `${nileExplorerBaseURL}/address/${address}`;
    }
    if (type == "hash") {
      return env == "production"
        ? `${tronExplorerBaseURL}/transaction/${hash}`
        : `${nileExplorerBaseURL}/transaction/${hash}`;
    }
  }

  if (blockchain == "ethereum") {
    if (type == "address") {
      return env == "production"
        ? `${ethereumExplorerBaseURL}/address/${address}`
        : `${sepoliaExplorerBaseURL}/address/${address}`;
    }

    if (type == "hash") {
      return env == "production"
        ? `${ethereumExplorerBaseURL}/tx/${hash}`
        : `${sepoliaExplorerBaseURL}/tx/${hash}`;
    }
  }
  return null;
};
