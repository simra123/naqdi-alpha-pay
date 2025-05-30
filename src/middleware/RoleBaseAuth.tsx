import React from "react";
import { notFound, useRouter } from "next/navigation";
import { getLocalStorageValue } from "@/utils/cookies";

export const withAuth = (Component: any, allowedRoles: string[]) => {
  const AuthComponent = () => {
    const router = useRouter();
    const user: any = getLocalStorageValue("user");

    if (!user) {
      return router.replace("/login");
    }

    if (!allowedRoles.includes(user.role)) {
      return notFound();
    }

    return <Component />;
  };

  return AuthComponent;
};
