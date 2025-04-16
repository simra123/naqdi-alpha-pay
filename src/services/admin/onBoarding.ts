"use client";

import api, { formHeader } from "@/config/api";


export const adminFeeSetupApi = (data: {
  merchant_fees: boolean;
  client_fees: boolean;
  userId: number;
}) => {
  return () => api.post(`auth/admin/set-fees`, data);
};
