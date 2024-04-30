"use client";

import api from "@/config/api";

export const createDepoistAddressApi = (data: {
  network: string;
  blockchain: string;
}) => {
  return () => api.post(`wallet/deposit/address`, data);
};

export const getAllWalletBalancesApi = () => {
  return () => api.get(`wallet/balance`);
};
