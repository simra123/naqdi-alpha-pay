"use client";

import api from "@/config/api";



export const getAllWalletAssetsByAdminApi = () => {
  return () => api.get(`wallet/wallet-assets`);
};

export const getAllAdminWalletBalancesApi = () => {
  return () => api.get(`wallet/admin/balance`);
};

export const getAllWalletsListByAdminApi = () => {
  return () => api.get(`wallet/wallet-list`);
};