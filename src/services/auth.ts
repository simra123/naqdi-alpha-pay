"use client";

import api from "@/config/api";

export const loginApi = (data) => {
  return () => api.post(`auth/login`, data);
};

export const registerApi = (data) => {
  return () => api.post(`auth/register`, data);
};

export const verifyApi = (data: { userId: number }) => {
  return () => api.post(`auth/verify`, data);
};

export const generateMFAForAdminApi = () => {
  return () => api.get(`auth/admin/generate-secret-key`);
};

export const verifyMFAForUserApi = (
  data: { token: string },
  accessToken?: string
) => {
  if (accessToken) {
    return () =>
      api.post(`auth/verify-otp`, data, {
        headers: { Authorization: `bearer ${accessToken}` },
      });
  }
  return () => api.post(`auth/verify-otp`, data);
};

export const verifyMFAForAdminApi = (
  data: { token: string },
  accessToken?: string
) => {
  if (accessToken) {
    return () =>
      api.post(`auth/admin/verify-otp`, data, {
        headers: { Authorization: `bearer ${accessToken}` },
      });
  }
  return () => api.post(`auth/admin/verify-otp`, data);
};

export const recoverPasswordApi = (data) => {
  return () => api.post(`auth/forgot-password`, data);
};

export const resendEmailApi = (data: { email: string }) => {
  return () => api.post(`auth/resend-verification-email`, data);
};

export const ChangePassowordApi = (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  token: number;
}) => {
  return () => api.post(`auth/change-password`, data);
};

export const ChangePassowordAdminpi = (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  token: number;
}) => {
  return () => api.post(`auth/admin/change-password`, data);
};

export const updatePasswordApi = (data) => {
  return () => api.post(`auth/reset-password`, data);
};
