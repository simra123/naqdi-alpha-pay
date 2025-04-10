import React from "react";
import Cookies from "js-cookie";
import { notFound, useRouter,redirect } from "next/navigation";
import {
  AccessLevelEnum,
  ModuleRoutes,
  ModulesEnum,
  Permissions,
} from "@/constants/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import LoadingScreen from "@/components/common/LoadingScreen";

type WithPermissionProps = {};

// Helper function to determine if the access level meets the required level
const hasSufficientAccess = (
  userAccessLevel: AccessLevelEnum,
  requiredAccessLevel: AccessLevelEnum
) => {
  if (userAccessLevel === AccessLevelEnum.full) return true;
  return userAccessLevel === requiredAccessLevel;
};

const findFirstAccessableModule = (permission: Permissions) => {
  if (permission && permission?.length) {
    const item = permission.find(
      (item) => item.permission.access_level !== "none"
    );
    return item ? item?.permission : null;
  }
};

interface IPermissionConfig {
  redirectOnNoAccess?: boolean;
}

const PermissionAccess = (
  WrappedComponent: (props: any) => React.JSX.Element,
  requiredModule: ModulesEnum,
  requiredAccessLevel: AccessLevelEnum,
  config?: IPermissionConfig
) => {
  return (props: WithPermissionProps): any => {
    // Get permissions from cookies and parse them


    let router = useRouter();
    const user = useLocalStorage("user");

    if (user && user?.permissions) {
      let permissions: Permissions = user?.permissions;

      const redirectOnNoAccess = config?.redirectOnNoAccess;

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

      if (redirectOnNoAccess && !hasAccess) {
        // Redirect based on permission available
        let availableModule = findFirstAccessableModule(permissions);

        const isPathAvailable = !!ModuleRoutes[availableModule.module];

        if (availableModule && isPathAvailable) {
          return redirect(ModuleRoutes[availableModule.module]);
        } else {
          return redirect("/settings/account");
        }
      }

      // If access is denied, render NotFound
      if (!hasAccess) {
        if (requiredAccessLevel == AccessLevelEnum.read) {
          return notFound();
        }
        return <></>;
      }

      return <WrappedComponent {...props} />;
    }
  };
};

export default PermissionAccess;
