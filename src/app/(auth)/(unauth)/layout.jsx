"use client";

import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const layout = ({ children }) => {
  const { isAuthenticated, loaded } = useAuth();
  const router = useRouter();

  if (!loaded) {
    return "...Loading";
  }
  if (isAuthenticated) {
    return router.push("/main/home");
  }
  return children;
};

export default layout;
