"use client";

import api from "@/config/api";

export const generateApiKeyApi = (data: { name: string }) => {
  return () => api.post(`auth/generate_secret_key`, data);
};

export const revokeKeyApi = (data: {
  secretKeyId: number | string;
  revoke: boolean;
}) => {
  return () => api.post(`auth/revoke-secret-key`, data);
};

export const listApiKeysApi = () => {
  return () => api.get(`v1/secret-key-list`);
};

export const addWebhookURLAPI = (data: { url: string }) => {
  return () => api.post(`auth/add/webhook`, data);
};
