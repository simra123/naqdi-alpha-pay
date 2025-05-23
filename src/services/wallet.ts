"use client";

import api from "@/config/api";

export const createDepoistAddressApi = (data: {
  blockchain: string;
  standard?: string;
}) => {
  return () => api.post(`wallet/deposit/address`, data);
};

export const getAllWalletBalancesApi = () => {
  return () => api.get(`wallet/balance`);
};

export const getTotalPortfolioValueApi = () => {
  return () => api.get(`dashboard/total-portfolio-amount`);
};

export const getProfitPercentageApi = () => {
  return () => api.get(`dashboard/profit-percentage`);
};

export const getPortfolioActivityChartApi = ({
  duration,
  unit,
}: {
  duration: string;
  unit: string;
}) => {
  return () =>
    api.get(`/dashboard/portfolio-activity`, { params: { duration, unit } });
};

export const getMerchantSupportedCryptoApi = () => {
  return () => api.get(`merchant/company-wallet/supported-crypto`);
};


export const getMerchantFiatBalanceApi = () => {
  return () => api.get(`merchant/company-wallet/balance`);
};
