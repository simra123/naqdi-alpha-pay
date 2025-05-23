"use client";

import api from "@/config/api";

export const getAllTransactionsApi = (
  data?: {},
  params?: { limit: number; page: number }
) => {
  return () => api.post(`transaction/transaction-list`, data, { params });
};

export const getTransactionDetailsByUserApi = (data: { id: number }) => {
  return () => api.get(`transaction/${data.id}/details`);
};

export const getTransactionRequestDetailsByUserApi = (data: { id: number }) => {
  return () => api.get(`transaction/request-details/${data.id}`);
};

export const getRecentTransactionsApi = () => {
  return () => api.get(`wallet/recent-transactions`);
};
