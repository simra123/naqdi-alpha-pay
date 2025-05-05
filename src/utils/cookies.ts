import { AccessLevelEnum, ModulesEnum } from "@/constants/types";
import Cookies from "js-cookie";

export const updateMfaInCookie = (newMfaValue) => {
  // Get the current userDetails cookie
  let user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  if (user) {
    if (user?.userDetails) {
      user.userDetails.mfa = newMfaValue;
      Cookies.set("user", JSON.stringify(user));
    } else {
      user.userDetails = { mfa: newMfaValue };
      Cookies.set("user", JSON.stringify(user));
    }
  }
};

export const updatedOnboardingCookies = (userDetails: {}) => {
  // Get the current userDetails cookie
  let user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  if (user) {
    user.userDetails = userDetails;
    Cookies.set("user", JSON.stringify(user));
  }
};

export const debounce = (func: Function, delay: number) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const getPermission = (moduleName: ModulesEnum) => {
  const userCookie = Cookies.get("user");

  if (!userCookie) return null;

  try {
    const currentUser = JSON.parse(userCookie);
    const permissionObj = currentUser?.permissions?.find(
      (perm) => perm?.permission?.module === moduleName
    );
    return permissionObj?.permission || null;
  } catch (err) {
    console.error("Failed to parse user cookie", err);
    return null;
  }
};

export const hasMinAccess = (
  moduleName: ModulesEnum,
  minAccess: AccessLevelEnum
): boolean => {
  // I have added this line to make sure no one passess --none-- as minAccessLevel
  if (minAccess === AccessLevelEnum.none) {
    console.warn(
      "hasMinAccess() was called with 'none' as minimum access. This is likely unintended."
    );
    return false;
  }

  const permission = getPermission(moduleName);

  if (!permission || !permission.access_level) return false;

  const accessLevel = permission.access_level as AccessLevelEnum;

  const accessHierarchy: Record<AccessLevelEnum, number> = {
    [AccessLevelEnum.none]: 0,
    [AccessLevelEnum.read]: 1,
    [AccessLevelEnum.full]: 2,
  };

  return accessHierarchy[accessLevel] >= accessHierarchy[minAccess];
};
