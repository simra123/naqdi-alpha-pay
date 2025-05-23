"use client";

import api from "@/config/api";

export const getMyFinancialSummaryApi = () => {
  return () => api.get(`merchant-dashboard/financial-summary`);
};
