"use client";

import api from "@/config/api";

export const resendWebhookAPI = (data: { id?: number }) => {
  return () => api.get(`admin/transaction/${data.id}/webhook`);
};
