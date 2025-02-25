"use client";

import api from "@/config/api";

export const getNewsSignedUpUsersByAdminApi = () => {
  return () => api.get(`newsletter`);
};
