"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
    setLoaded(true);
  }, []);

  const logOut = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loaded, logOut };
};

export default useAuth;
