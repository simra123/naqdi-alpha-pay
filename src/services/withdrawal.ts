"use client";

import api from "@/config/api";
import { Withdrawal_Type } from "@/constants/roles";

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

export const getAdminWithdrawalsListApi = () => {
  return () => api.get(`wallet/withdrawals`);
};

export const getUserWithdrawalsListApi = () => {
  return () => api.get(`wallet/user-withdrawals`);
};

export const getWithdrawalDetilsApi = (data: { withdraw_id: number }) => {
  return () => api.post(`wallet/withdrawal-details`, data);
};

export const withdrawalRejectAdminApi = (data: { withdraw_id: number,reason:string }) => {
  return () => api.post(`wallet/reject-withdraw`, data);
};

export const withdrawalApproveAdminApi = (data: {
  withdraw_id: number;
  withdrawal_mode: Withdrawal_Type;
  addresses?: string[];
}) => {
  return () => api.post(`wallet/approve-withdraw`, data);
};

export const getWithdrawalWalletsApi = (data: { withdraw_id: number }) => {
  return () => api.post(`wallet/wallet-list`, data);
};
