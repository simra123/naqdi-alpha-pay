import React from "react";
import Cookies from "js-cookie";
import { notFound, useRouter } from "next/navigation";
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

const findFirstNonNoneAccessLevel = (permission: Permissions) => {
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

let ModuleRoutes = {
  [ModulesEnum.payment]: "/payments",
  [ModulesEnum.integration]: "settings/integrations",
  [ModulesEnum.transaction]: "/transactions",
  [ModulesEnum.user]: "/settings/users",
  [ModulesEnum.wallet]: "/",
  [ModulesEnum.withdrawal]: "/withdrawals",
};

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
        let availableModule = findFirstNonNoneAccessLevel(permissions);
 
        if (availableModule) {
          return router.push(ModuleRoutes[availableModule.module]);
        } else {
          return router.push("/settings/account");
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
