import Cookies from "js-cookie";

const useLocalStorage = (key: string): any => {
  const raw = Cookies.get(key);

  try {
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Invalid JSON in cookie:", key, raw);
    return null;
  }
};

export default useLocalStorage;
