"use client";

import api from "@/config/api";

export const getAllUsersByAdminApi = () => {
  return () => api.get(`auth/get-all-users`);
};
export const getKYCUsersListApi = (data: { status?: string }) => {
  return () => api.get(`auth/userDetails/list`, { params: { status } });
};

export const getUserDetailsApi = (data: { userId: number }) => {
  return () => api.post(`auth/getUserByAdmin`, data);
};

export const updateUserFeeApi = (data) => {
  return () => api.post(`auth/admin/add/fees`, data);
};

export const updateKYCStatusApi = (data) => {
  return () => api.post(`auth/admin/kyc`, data);
};

export const getAllMerchantTransactionsAndBalanceByAdminApi = (params: {
  companyId: number;
  limit: number;
  page: number;
  all?: boolean;
}) => {
  return () => api.get(`/admin-merchant/balance-transactions`, { params });
};
