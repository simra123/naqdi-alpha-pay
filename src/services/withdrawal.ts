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

export const withdrawalRejectAdminApi = (data: {
  withdraw_id: number;
  reason: string;
}) => {
  return () => api.post(`wallet/reject-withdraw`, data);
};

export const withdrawalApproveAdminApi = (data: {
  withdrawal_mode: Withdrawal_Type;
  withdraw_id: number;
  addresses?: string[];
}) => {
  if (data.withdrawal_mode == Withdrawal_Type.AUTOMATIC) {
    return () =>
      api.post(`wallet/auto-withdraw-approval`, {
        withdraw_id: data.withdraw_id,
      });
  }
  return () =>
    api.post(`/wallet/withdraw-approval`, {
      withdraw_id: data.withdraw_id,
      addresses: data.addresses,
    });
};

export const getWithdrawalWalletsApi = (data: { withdraw_id: number }) => {
  return () => api.post(`wallet/wallet-list`, data);
};
