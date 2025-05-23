"use client";

import api from "@/config/api";

export const getAllPaymentsByAdminApi = (params: {
  limit: number;
  page: number;
  all?: true;
}) => {
  return () => api.get(`admin/transaction/payments`, { params });
};


export const addFeeStaticWalletAdminApi = (data: {
  wallet_address: string;
}) => {
  return () => api.post(`wallet/admin/add/network-fees`, data);
};

export const addFeeVirtualWalletAdminApi = (data: {
  wallet_Address: string;
  requested_currency: string;
  requested_amount: string;
  payment_currency?: string;
  passthrough: string;
}) => {
  return () => api.post(`v1/admin/add/network-fees`, data);
};
