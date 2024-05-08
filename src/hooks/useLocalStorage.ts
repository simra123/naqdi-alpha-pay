import { useEffect, useState } from "react";

const useLocalStorage = (key: string) => {
  const [storedValue, setStoredValue] = useState<any>(() => {
    try {
      const item =
        typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error accessing local storage:", error);
      return null;
    }
  });

  return storedValue;
};

export default useLocalStorage;
