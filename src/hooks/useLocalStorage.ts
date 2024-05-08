import React, { useEffect, useState } from "react";

const useLocalStorage = (key?: any, value?: any) => {
  const getLocalStorage = () => {
    return (
      window.localStorage?.getItem(key) &&
      JSON.parse(window.localStorage?.getItem(key))
    );
  };

  return getLocalStorage();
};

export default useLocalStorage;
