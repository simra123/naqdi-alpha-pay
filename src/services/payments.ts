"use client";

import api from "@/config/api";

export const getAllPaymentsApi = () => {
  return () => api.get(`v1/client/payments`);
};

export const getAllPaymentsByAdminApi = () => {
  return () => api.get(`v1/client/payments-by-admin`);
};

export const getPaymentDetailsApi = (id: number) => {
  return () => api.get(`v1/client/payments/${id}`);
};

export const getPaymentDetailsByAdminApi = (id: number) => {
  return () => api.get(`v1/admin-payments/${id}`);
};
