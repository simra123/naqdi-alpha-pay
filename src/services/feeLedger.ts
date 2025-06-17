"use client";

import api from "@/config/api";

export const getUserLedgerListApi = (
  data?: {},
  params?: { limit: number; page: number }
) => {
  return () => api.post(`ledger-fee/list`, data, { params });
};
