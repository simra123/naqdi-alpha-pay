"use client";

import api from "@/config/api";

export const createPaymentDepositApi = (data: {
  unit: string;
  standard?: string;
  amount: number;
  customer_email: "muhammad.u@gateso.com";
  customer_name: "Usman";
  send_email?: boolean;
  customer_phone_number: string;
}) => {
  return () => api.post(`transaction/deposit`, data);
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
