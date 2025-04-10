"use client";

import api from "@/config/api";



export const getUserLedgerListApi = (
  data?: {},
  params?: { limit: number; page: number }
) => {
  return () => api.post(`fee-ledger/list`, data, { params });
};

export const getAdminLedgerListApi = () => {
  return () => api.get(`admin/fee-ledger`);
};