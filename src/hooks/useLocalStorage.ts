import Cookies from "js-cookie";

const useLocalStorage = (key: string): any => {
  return Cookies.get(key) && JSON.parse(Cookies.get(key));
};

export default useLocalStorage;
