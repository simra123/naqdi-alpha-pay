export enum STANDARD {
  BITCOIN = "Omni-layer",
  ETHEREUM = "ERC-20",
  TRON = "TRC-20",
}

export const blockchains = [
  { label: "Bitcoin", value: "bitcoin" },
  { label: "Ethereum", value: "ethereum" },
  { label: "Tron", value: "tron" },
  { label: "USDT", value: "USDT" },
  { label: "USDC", value: "USDC" },
];

export const networks = {
  bitcoin: [
    { label: "Mainnet", value: "mainnet" },
    { label: "Testnet", value: "testnet" },
  ],

  ethereum: [
    { label: "Mainnet", value: "mainnet" },
    { label: "Sepolia", value: "sepolia" },
  ],
  tron: [
    { label: "Mainnet", value: "mainnet" },
    { label: "Nile", value: "nile" },
  ],
  USDT: [
    {
      label: "Bitcoin(Omni Layer)",
      value: "mainnet(btc)",
      standard: STANDARD.BITCOIN,
    },
    {
      label: "Testnet(BTC)(Omni Layer)",
      value: "testnet",
      standard: STANDARD.BITCOIN,
    },
    {
      label: "Ethereum(ERC-20)",
      value: "mainnet(eth)",
      standard: STANDARD.ETHEREUM,
    },
    {
      label: "Sepolia(ETH)(ERC-20)",
      value: "sepolia",
      standard: STANDARD.ETHEREUM,
    },
    { label: "Tron(TRC-20)", value: `mainnet(tron)`, standard: STANDARD.TRON },
    {
      label: "Nile(Tron)(TRC-20)",
      value: `nile(tron)`,
      standard: STANDARD.TRON,
    },
  ],
  USDC: [
    { label: "Ethereum", value: "mainnet(eth)", standard: STANDARD.ETHEREUM },
    { label: "Sepolia(ETH)", value: "sepolia", standard: STANDARD.ETHEREUM },
  ],
};
