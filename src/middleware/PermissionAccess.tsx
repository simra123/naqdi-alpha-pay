import React from "react";
import Cookies from "js-cookie";
import { notFound } from "next/navigation";

type Permission = {
  module: string;
  access_level: "none" | "read_only" | "full_access";
};

type Permissions = {
  id: number;
  permission: Permission;
}[];

type WithPermissionProps = {
 
};

const PermissionAccess = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
  requiredModule: string,
  requiredAccessLevel: "none" | "read_only" | "full_access"
) => {
  return (props: T & WithPermissionProps) => {
    // Get permissions from cookies and parse them
    const permissionsString = Cookies.get("permissions");
    let permissions: Permissions = [];

    if (permissionsString) {
      try {
        permissions = JSON.parse(permissionsString);
      } catch (error) {
        console.error("Failed to parse permissions from cookies:", error);
      }
    }

    // Find the specific module permission
    const modulePermission = permissions.find(
      (perm) => perm.permission.module === requiredModule
    );

    if (!modulePermission) {
      // Module not found in permissions, render NotFound
      return notFound();
    }

    const { access_level } = modulePermission.permission;

    // Check access level
    const hasAccess = requiredAccessLevel === access_level 

    // If access is denied, render NotFound
    if (!hasAccess) {
      return notFound();
    }

    return <WrappedComponent {...props} />;
  };
};

export default PermissionAccess;
