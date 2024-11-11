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
