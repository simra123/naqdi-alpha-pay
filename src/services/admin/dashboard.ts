"use client";

import api from "@/config/api";

export const getDashboardMerchantsAdminApi = () => {
  return () => api.get(`admin-dashboard/merchants-wallet-summary`);
};
