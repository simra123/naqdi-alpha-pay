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

export const getAllWalletsListByAdminApi = () => {
  return () => api.get(`wallet/wallet-list`);
};

export const getTotalPortfolioValueApi = () => {
  return () => api.get(`dashboard/total-portfolio-amount`);
};

export const getProfitPercentageApi = () => {
  return () => api.get(`dashboard/profit-percentage`);
};

export const getPortfolioActivityChartApi = ({
  duration,
}: {
  duration?: string;
}) => {
  return () =>
    api.get(`/dashboard/portfolio-activity`, { params: { duration } });
};
