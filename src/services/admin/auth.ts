"use client";

import api from "@/config/api";
import { AccessLevelEnum, ModulesEnum } from "@/constants/types";

export const generateMFAForAdminApi = () => {
  return () => api.get(`auth/admin/generate-secret-key`);
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

export const ChangePassowordAdminpi = (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  token: number;
}) => {
  return () => api.post(`auth/admin/change-password`, data);
};

export const createSubAdminApi = (data: {
  username: string;
  first_name: string;
  email: string;
  last_name: string;
  password: string;
  permissions: {
    module: ModulesEnum;
    access_level: AccessLevelEnum;
  }[];
}) => {
  return () => api.post(`auth/create/admin-sub-users`, data);
};
export const getSubAdminsApi = () => {
  return () => api.get(`auth/admin/sub-admin`);
};

export const getSubAdminDetailsApi = (data: { id: number }) => {
  return () => api.get(`auth/admin/detail-sub-admin/${data.id}`);
};
export const updateSubAdminApi = (data: {
  user_id: number | string;
  user_permission: {
    id: number;
    permissions: {
      id: number;
      module: ModulesEnum;
      access_level: AccessLevelEnum;
    };
  }[];
}) => {
  return () => api.post(`auth/admin/update-permission`, data);
};
export const deleteSubAdminApi = (data: {
  username: string;
  child_id: number;
}) => {
  return () => api.post(`auth/admin/delete/sub-user`, data);
};
