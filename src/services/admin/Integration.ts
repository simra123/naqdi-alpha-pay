"use client";

import api from "@/config/api";

export const resendWebhookAPI = (data: {
  payment_id: number;
  transaction_id: number;
}) => {
  return () => api.post(`/v1/admin/resend/client-webhook`, data);
};
