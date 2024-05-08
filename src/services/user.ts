"use client";

import api from "@/config/api";

export const userDetailsApi = () => {
  return () => api.get(`auth/userDetails`);
};

