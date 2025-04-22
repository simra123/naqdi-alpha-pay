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

export const createAdminWithdrawalApi = (data: {
  blockchain: string;
  amount: string | number;
  recipient_address: string;
  notes?: string;
  standard?: string;
  token: string;
}) => {
  return () => api.post(`wallet/fee-withdrawal`, data);
};

export const getAdminWithdrawalsListApi = () => {
  return () => api.get(`wallet/withdrawals`);
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

export const withdrawalRejectAdminApi = (data: {
  withdraw_id: number;
  reason: string;
}) => {
  return () => api.post(`wallet/reject-withdraw`, data);
};

export const withdrawalApproveAdminApi = (data: {
  withdraw_id: number;
  addresses?: string[];
}) => {
  return () =>
    api.post(`wallet/withdraw-approval`, {
      withdraw_id: data.withdraw_id,
      addresses: data.addresses,
    });
};

export const externalWithdrawalApproveAdminApi = (data: {
  withdraw_id: number;
  transaction_hash: string;
  sender_address: string;
  internal_note?: string;
}) => {
  return () => api.post(`/wallet/external-withdraw`, data);
};

export const getWithdrawalWalletsApi = (
  data: { withdraw_id: number },
  { page, limit }: { page: number; limit: number }
) => {
  return () =>
    api.post(`wallet/wallet-list`, data, { params: { page, limit } });
};
