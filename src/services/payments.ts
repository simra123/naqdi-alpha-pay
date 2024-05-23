"use client";

import api from "@/config/api";

export const getAllPaymentsApi = () => {
  return () => api.get(`v1/client/payments`);
};

export const getPaymentDetailsApi = (id: number) => {
  return () => api.get(`v1/client/payments/${id}`);
};
