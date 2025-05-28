"use client";

import api from "@/config/api";

export const getDashboardMerchantsWalletSummaryAdminApi = (params?: {
  limit?: number;
  page?: number;
  all?: boolean;
}) => {
  return () => api.get(`admin-dashboard/merchants-wallet-summary`, { params });
};

export const getDashboardFeeSummaryAdminApi = () => {
  return () => api.get(`admin-dashboard/fee-summary`);
};

export const getDashboardBalancesAdminApi = (params: {
  duration?: string;
  unit?: string;
  userId?: number | string;
  all?: boolean;
}) => {
  return () =>
    api.get(`admin-dashboard/crypto-wallet-graph-fiat-dashboard`, { params });
};

export const getMerchantFinancialSummaryAdminApi = (
  params: {
    userId?: number | string;
  } = {}
) => {
  return () =>
    api.get(`admin-dashboard/merchant-financial-summary`, { params });
};
