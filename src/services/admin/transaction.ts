"use client";

import api from "@/config/api";

export const getAllTransactionsByAdminApi = () => {
  return () => api.get(`auth/get-all-transactions`);
};

export const getTransactionDetailsByAdminApi = (data: { id: number }) => {
  return () => api.post(`auth/get-transaction-by-admin`, data);
};
