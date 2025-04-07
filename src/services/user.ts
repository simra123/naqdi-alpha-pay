"use client";

import api from "@/config/api";

export const userDetailsApi = () => {
  return () => api.get(`auth/userDetails`);
};

export const setClientFeeApi = (data: { amount: number }) => {
  return () => api.post(`auth/user/client-fee`, data);
};

export const getClientFeeApi = () => {
  return () => api.get(`auth/user/client-fee`);
};
