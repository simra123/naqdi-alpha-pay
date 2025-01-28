"use client";

import api from "@/config/api";

export const createPaymentDepositApi = (data: {
  requested_currency: string;
  requested_amount: string;
  payment_currency: string;
  payment_currency_standard: string;
  passthrough: string;
  notes?: string;
  customer_email: string;
  customer_name: string;
  customer_phone_number?: string;
  email_notification?: boolean;
}) => {
  return () => api.post(`v1/create-manual-payment`, data);
};

export const getAllPaymentsApi = () => {
  return () => api.get(`v1/client/payments`);
};

export const getAllPaymentsByAdminApi = () => {
  return () => api.get(`v1/admin/payments-by-admin`);
};

export const getPaymentDetailsApi = (id: number) => {
  return () => api.get(`v1/client/payments/${id}`);
};

export const getPaymentDetailsByAdminApi = (id: number) => {
  return () => api.get(`v1/admin/payments/${id}`);
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
