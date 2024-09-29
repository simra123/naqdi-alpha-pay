"use client";

import api, { formHeader } from "@/config/api";

export const createPrivateTicketApi = (data: FormData) => {
  return () => api.post(`ticket`, data, formHeader);
};

export const createPublicTicketApi = (data: FormData) => {
  return () => api.post(`ticket/create`, data, formHeader);
};

export const TicketsListApi = () => {
  return () => api.get(`ticket`);
};
