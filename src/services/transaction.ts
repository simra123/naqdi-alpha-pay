"use client";

import api from "@/config/api";

export const getAllTransactionsApi = (status: string) => {
  return () => api.get(`wallet/transaction`, { params: { status: status } });
};
