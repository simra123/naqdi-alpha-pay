"use client";

import api from "@/config/api";

export const getUsersListApi = (status) => {
  return () => api.get(`auth/userDetails/list`, { params: { status } });
};

export const getUserDetailsApi = (data) => {
  console.log(data);
  return () => api.post(`auth/getUserByAdmin`, data);
};

export const updateUserFeeApi = (data) => {
  return () => api.post(`auth/admin/add/fees`, data);
};

export const updateKYCStatusApi = (data) => {
  return () => api.post(`auth/admin/kyc`, data);
};
