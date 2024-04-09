"use client";

import api from "@/config/api";

export const ProfileSetupApi = (data) => {
  return () => api.post(`auth/user/address/add`, data);
};

export const PhoneSetupApi = (data) => {
  return () => api.post(`auth/user/add/phone`, data);
};

export const MfaSetupApi = (data) => {
  return () => api.post(`auth/verify-otp`, data);
};

export const generateMFACodeApi = () => {
  return () => api.get(`auth/generate-secret-key`);
};
