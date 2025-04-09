"use client";

import api from "@/config/api";



export const getUserLedgerListApi = (
  data?: {},
  params?: { limit: number; page: number }
) => {
  return () => api.post(`withdrawal/list`, data, { params });
};

export const getAdminLedgerListApi = (
  data?: {},
  params?: { limit: number; page: number }
) => {
  return () => api.post(`withdrawal/list`, data, { params });
};