import React from "react";
import Cookies from "js-cookie";
import { notFound } from "next/navigation";
import { AccessLevelEnum, ModulesEnum } from "@/constants/types";
import useLocalStorage from "@/hooks/useLocalStorage";

type Permission = {
  id: number;
  module: ModulesEnum;
  access_level: AccessLevelEnum;
};

type Permissions = {
  id: number;
  permission: Permission;
}[];

type WithPermissionProps = {};

// Helper function to determine if the access level meets the required level
const hasSufficientAccess = (
  userAccessLevel: AccessLevelEnum,
  requiredAccessLevel: AccessLevelEnum
) => {
  if (userAccessLevel === AccessLevelEnum.full) return true;
  return userAccessLevel === requiredAccessLevel;
};

const PermissionAccess = (
  WrappedComponent: any,
  requiredModule: ModulesEnum,
  requiredAccessLevel: AccessLevelEnum
) => {
  console.log("permission access hoc running");
  return (props: WithPermissionProps) => {
    // Get permissions from cookies and parse them
    const user = useLocalStorage("user");
    let permissions: Permissions = user?.permissions;

    // Find the specific module permission
    const modulePermission = permissions.find(
      (perm) => perm.permission.module === requiredModule
    );

    if (!modulePermission) {
      // Module not found in permissions, render NotFound
      return notFound();
    }

    const { access_level } = modulePermission.permission;

    // Check if the user has sufficient access level
    const hasAccess = hasSufficientAccess(access_level, requiredAccessLevel);
    console.log({
      requiredAccessLevel,
      requiredModule,
      modulePermission,
      access_level,
      permissions,
      hasAccess,
    });

    // If access is denied, render NotFound
    if (!hasAccess) {
      if (requiredAccessLevel == AccessLevelEnum.read) {
        return notFound();
      }
      return <></>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default PermissionAccess;
