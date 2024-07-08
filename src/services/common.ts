"use client";

import api from "@/config/api";

export const generateCSVApi = (dataInArray: object[]) => {
  const data = dataInArray || [{}];
  return () => api.post(`auth/csv`, data);
};

export const getFeesApi = (amount: number | string) => {
  return () => api.post(`wallet/alphaspay-fee`, { amount });
};
