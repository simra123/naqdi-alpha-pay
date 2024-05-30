"use client";

import api from "@/config/api";

export const getAllTransactionsApi = (status: string) => {
  return () => api.get(`wallet/transaction`, { params: { status: status } });
};

export const getTransactionDetailsByUserApi = (data: { id: number }) => {
  return () => api.post(`auth/get-transaction-by-user`, data);
};
