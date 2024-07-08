"use client";

import api from "@/config/api";

export const createWithdrawalApi = (data: {
  blockchain: string;
  amount: string | number;
  recipient_address: string;
  notes?: string;
  standard?: string;
}) => {
  return () => api.post(`wallet/withdrawal`, data);
};

export const getWithdrawalsListApi = () => {
  return () => api.get(`wallet/withdrawals`);
};

export const getWithdrawalDetilsApi = (data: { withdraw_id: number }) => {
  return () => api.post(`wallet/withdrawal-details`, data);
};
