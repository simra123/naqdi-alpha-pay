"use client";

import api from "@/config/api";

export const createWithdrawalApi = (data: {
  blockchain: string;
  amount: string | number;
  recipient_address: string;
  notes?: string;
  standard?: string;
  token: string;
}) => {
  return () => api.post(`wallet/withdrawal`, data);
};

export const getWithdrawableCurrenciesListApi = () => {
  return () => api.get(`wallet/withdrawal/balance`);
};

export const getUserWithdrawalsListApi = (
  data?: {},
  params?: { limit: number; page: number }
) => {
  return () => api.post(`withdrawal/list`, data, { params });
};

export const getWithdrawalDetilsApi = (data: { withdraw_id: number }) => {
  return () => api.post(`wallet/withdrawal-details`, data);
};
