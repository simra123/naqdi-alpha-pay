import React, { useEffect, useState } from "react";

const useLocalStorage = (key, value) => {
  const [data, setData] = useState({});
  const setLocalStorage = () => {
    window.localStorage?.setItem(key, JSON.stringify(value));
  };

  const getLocalStorage = () => {
    setData(JSON.parse(window.localStorage?.getItem(key)));
  };
  useEffect(() => {
    getLocalStorage(key);
  }, [key]);

  return data;
};

export default useLocalStorage;
