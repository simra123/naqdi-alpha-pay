export enum STANDARD {
  BITCOIN = "Omni-layer",
  ETHEREUM = "ERC-20",
  TRON = "TRC-20",
}

export const blockchains = [
  // { label: "Bitcoin", value: "bitcoin" },
  { label: "Ethereum", value: "ethereum" },
  { label: "Tron", value: "tron" },
  { label: "USDT", value: "USDT" },
  { label: "USDC", value: "USDC" },
];

export const unitName = {
  btc: "Bitcoin",
  eth: "Ethereum",
  trx: "Tron",
  usdt: "Tether",
  usdc: "USDC",
};

export const standardBlockchain = {
  [STANDARD.TRON]: "tron",
  [STANDARD.ETHEREUM]: "ethereum",
};

export const tickerByStandard = {
  [STANDARD.TRON]: "trx",
  [STANDARD.ETHEREUM]: "eth",
  [STANDARD.BITCOIN]: "btc",
};

export const blockchain_standards = {
  // bitcoin: "Omni-layer",
  // Btc: "Omni-layer",
  // BTC: "Omni-layer",
  ethereum: STANDARD.ETHEREUM,
  Eth: STANDARD.ETHEREUM,
  ETH: STANDARD.ETHEREUM,
  tron: STANDARD.TRON,
  Tron: STANDARD.TRON,
  TRON: STANDARD.TRON,
  TRX: STANDARD.TRON,
};

export const production_networks = {
  // bitcoin: [{ label: "Mainnet", value: "mainnet" }],

  ethereum: [{ label: "Mainnet", value: "mainnet" }],
  tron: [{ label: "Mainnet", value: "mainnet" }],
  usdt: [
    // {
    //   label: "Bitcoin(Omni Layer)",
    //   value: "Bitcoin",
    //   standard: STANDARD.BITCOIN,
    // },

    {
      label: "Ethereum(ERC-20)",
      value: "ethereum",
      standard: STANDARD.ETHEREUM,
    },

    { label: "Tron(TRC-20)", value: `tron`, standard: STANDARD.TRON },
  ],
  usdc: [{ label: "Ethereum", value: "ethereum", standard: STANDARD.ETHEREUM }],
  // Btc: [{ label: "Bitcoin", value: "Bitcoin" }],

  eth: [{ label: "Ethereum", value: "ethereum" }],
  trx: [{ label: "Tron", value: "tron" }],
};

export const testnet_networks = {
  // bitcoin: [{ label: "Bitcoin", value: "Bitcoin" }],
  ethereum: [{ label: "Ethereum", value: "ethereum" }],
  tron: [{ label: "Tron", value: "tron" }],
  usdt: [
    // {
    //   label: "BTC (Testnet)",
    //   value: "Bitcoin",
    //   standard: STANDARD.BITCOIN,
    // },
    {
      label: "Sepolia (ERC-20)",
      value: "ethereum",
      standard: STANDARD.ETHEREUM,
    },

    {
      label: "Nile (TRC-20)",
      value: `tron`,
      standard: STANDARD.TRON,
    },
  ],
  usdc: [
    {
      label: "Sepolia (ERC-20)",
      value: "ethereum",
      standard: STANDARD.ETHEREUM,
    },
  ],
  // Btc: [{ label: "Bitcoin", value: "Bitcoin" }],

  eth: [{ label: "Ethereum", value: "ethereum" }],
  trx: [{ label: "Tron", value: "tron" }],
};

export const blockchain_units = {
  ethereum: "Eth",
  tron: "Trx",
  bitcoin: "Btc",
  usdt: "USDT",
  usdc: "USDC",
};

export const networks_available = {
  // bitcoin: false,
  // BTC: false,
  // Btc: false,
  ethereum: false,
  ETH: false,
  Eth: false,
  tron: false,
  Tron: false,
  TRON: false,
  USDT: true,
  USDC: true,
};
