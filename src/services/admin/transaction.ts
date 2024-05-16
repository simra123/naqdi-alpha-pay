"use client";

import api from "@/config/api";

export const getAllTransactionsByAdminApi = () => {
  return () => api.get(`auth/get-all-transactions`);
};
