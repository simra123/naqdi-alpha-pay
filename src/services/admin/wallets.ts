"use client";

import api from "@/config/api";



export const getAllWalletAssetsByAdminApi = () => {
  return () => api.get(`wallet/wallet-assets`);
};
