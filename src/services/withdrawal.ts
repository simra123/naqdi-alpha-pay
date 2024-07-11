"use client";

import api from "@/config/api";
import { Withdrawal_Type } from "@/constants/roles";

export const createWithdrawalApi = (data: {
  blockchain: string;
  amount: string | number;
  recipient_address: string;
  notes?: string;
  standard?: string;
}) => {
  return () => api.post(`wallet/withdrawal`, data);
};

export const getAdminWithdrawalsListApi = () => {
  return () => api.get(`wallet/withdrawals`);
};

export const getUserWithdrawalsListApi = () => {
  return () => api.get(`wallet/user-withdrawals`);
};

export const getWithdrawalDetilsApi = (data: { withdraw_id: number }) => {
  return () => api.post(`wallet/withdrawal-details`, data);
};

export const withdrawalRejectAdminApi = (data: { withdraw_id: number }) => {
  return () => api.post(`wallet/reject-withdraw`, data);
};

export const withdrawalApproveAdminApi = (data: {
  withdraw_id: number;
  sender_address?: string;
  withdrawal_mode: Withdrawal_Type;
  txhash?: string;
}) => {
  return () => api.post(`wallet/crypto-withdrawals`, data);
};
