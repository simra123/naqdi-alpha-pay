"use client";

import api from "@/config/api";

export const getDashboardMerchantsAdminApi = () => {
  return () => api.get(`admin-dashboard/merchants-wallet-summary`);
};

export const getDashboardBalancesAdminApi = (params: {
  duration?: string;
  unit?: string;
  userId?: number | string;
  all?: boolean;
}) => {
  return () => api.get(`admin-dashboard/crypto-wallet-graph`, { params });
};

export const getMerchantFinancialSummaryAdminApi = (
  params: {
    userId?: number | string;
  } = {}
) => {
  return () =>
    api.get(`admin-dashboard/merchant-financial-summary`, { params });
};
