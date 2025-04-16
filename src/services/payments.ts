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

export const getClientPaymentsListApi = (
  data?: {},
  params?: { limit: number; page: number }
) => {
  return () => api.post(`v1/payment-list`, data, { params });
};

export const getPaymentDetailsApi = (id: number) => {
  return () => api.get(`v1/client/payments/${id}`);
};
