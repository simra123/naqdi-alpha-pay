import React, { useEffect, useState } from "react";

const useLocalStorage = (key?: any, value?: any) => {
  const [data, setData] = useState({});
  const setLocalStorage = () => {
    window.localStorage?.setItem(key, JSON.stringify(value));
  };

  const getLocalStorage = () => {
    setData(JSON.parse(window.localStorage?.getItem(key)));
  };
  useEffect(() => {
    getLocalStorage();
  }, [key]);

  return data;
};

export default useLocalStorage;
