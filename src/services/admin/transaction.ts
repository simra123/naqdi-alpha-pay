"use client";

import api from "@/config/api";

export const getAllTransactionsByAdminApi = () => {
  return () => api.get(`wallet/all-transactions-by-admin`);
};

export const getLatestTransactionsByAdminApi = (params: {
  page?: number;
  limit?: number;
}) => {
  return () => api.get(`/admin-wallet/latest-transactions`, { params });
};

export const getTransactionDetailsByAdminApi = (data: { id: number }) => {
  return () => api.post(`auth/get-transaction-by-admin`, data);
};

export const getPaymentTransactionDetailsByAdminApi = (data: {
  id: number;
}) => {
  return () => api.get(`v1/admin/payment_transaction/${data?.id}`);
};

export const getWithdrawalTransactionDetailsByAdminApi = (data: {
  transaction_id: number;
}) => {
  return () => api.post(`wallet/withdrawtransaction-details`, data);
};

export const getMerchantTransactionByIdApi = (data: {
  merchant_id: number;
}) => {
  return () => api.get(`/admin-merchant/${data.merchant_id}/transactions`);
};
