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
  return () => api.post(`admin/transaction/fee-withdraw`, data);
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
  return () =>
    api.patch(
      `admin/transaction/withdraw/${data.withdraw_id}/reject`,
      {},
      { params: { rejection_reason: data.reason } }
    );
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

export const externalWithdrawalApproveAdminApi = (
  id: number,
  data: {
    hash: string;
    sender_address: string;
    internal_note?: string;
  }
) => {
  return () =>
    api.post(`admin/transaction/withdraw/${id}/approve-external`, data);
};

export const getWithdrawalWalletsApi = (
  data: { withdraw_id: number },
  { page, limit }: { page: number; limit: number }
) => {
  return () =>
    api.post(`wallet/wallet-list`, data, { params: { page, limit } });
};
