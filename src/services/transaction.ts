"use client";

import api from "@/config/api";

export const getAllTransactionsApi = (status: string) => {
  return () => api.get(`wallet/transaction`, { params: { status: status } });
};

export const getTransactionDetailsByUserApi = (data: { id: number }) => {
  return () => api.post(`auth/get-transaction-by-user`, data);
};

export const getPaymentTransactionDetailsByUserApi = (data: { id: number }) => {
  return () => api.get(`v1/client/payment_transaction/${data?.id}`);
};

export const getWithdrawalTransactionDetailsByUserApi = (data: {
  transaction_id: number;
}) => {
  return () => api.post(`wallet/withdrawtransaction-details`, data);
};
