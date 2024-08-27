"use client";

import LoadingScreen from "@/components/common/LoadingScreen";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const layout = ({ children }) => {
  const { isAuthenticated, loaded } = useAuth();
  const router = useRouter();

  if (!loaded) {
    return <LoadingScreen/>
  }
  if (isAuthenticated) {
    return router.push("/");
  }
  return children;
};

export default layout;
