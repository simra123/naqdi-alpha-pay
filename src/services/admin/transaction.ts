"use client";

import api from "@/config/api";

export const getAllTransactionsByAdminApi = (params: {
  limit: number;
  page: number;
  all?: true;
}) => {
  return () => api.get(`admin/transaction/transaction`, { params });
};

export const getLatestTransactionsByAdminApi = (params: {
  page?: number;
  limit?: number;
}) => {
  return () => api.get(`admin-dashboard/latest-transactions`, { params });
};

export const getTransactionDetailsByAdminApi = (data: { id: number }) => {
  return () => api.get(`admin/transaction/${data.id}/details`);
};

export const getTransactionRequestDetailsByAdminApi = (data: {
  id: number;
}) => {
  return () => api.get(`admin/transaction/request-details/${data.id}`);
};

export const getMerchantTransactionByIdApi = (data: {
  merchant_id: number;
}) => {
  return () => api.get(`/admin-merchant/${data.merchant_id}/transactions`);
};


export const getAdminExchangeRateUSDToCryptoApi = (params: {
  unit: string;
  blockchain: string;
  amount: number;
}) => {
  return () => api.get(`admin/transaction/withdrawal/exchange-rate`, { params });
};