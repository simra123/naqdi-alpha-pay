"use client";

import api from "@/config/api";

export const getAdminSupportedCryptoApi = () => {
  return () => api.get(`admin/company-wallet/supported-crypto`);
};

export const getAdminFiatBalanceApi = () => {
  return () => api.get(`admin/company-wallet/balance`);
};

export const getAllAdminWalletBalancesApi = () => {
  return () => api.get(`wallet/admin/balance`);
};

export const getAllWalletsListByAdminApi = () => {
  return () => api.get(`wallet/wallet-list`);
};
