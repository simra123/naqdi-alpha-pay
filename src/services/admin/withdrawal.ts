"use client";

import api from "@/config/api";

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

export const getAdminWithdrawalsListApi = (params: {
  limit: number;
  page: number;
  all?: boolean;
}) => {
  return () => api.get(`admin/transaction/withdrawals`, { params });
};

export const withdrawalRejectAdminApi = (data: {
  withdraw_id: number;
  reason: string;
}) => {
  return () => api.post(`wallet/reject-withdraw`, data);
};

export const withdrawalApproveAdminApi = (data: {
  withdraw_id: number;
  wallets?: string[];
}) => {
  return () =>
    api.patch(`admin/transaction/withdraw/${data.withdraw_id}/approve`, {
      wallets: data.wallets,
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
