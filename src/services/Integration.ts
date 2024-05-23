"use client";

import api from "@/config/api";

export const generateApiKeyApi = () => {
  return () => api.get(`auth/generate_secret_key`);
};

export const listApiKeysApi = () => {
  return () => api.get(`v1/secret-key-list`);
};

export const addWebhookURLAPI = (data: { url: string }) => {
  return () => api.post(`auth/add/webhook`,data);
};
