"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = window?.localStorage?.getItem("token");
    setIsAuthenticated(!!token);
    setLoaded(true);
  }, []);

  return { isAuthenticated, loaded };
};

export default useAuth;
