import Cookies from "js-cookie";

export const updateMfaInCookie = (newMfaValue) => {
  // Get the current userDetails cookie
  let user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  if (user) {
    user.userDetails.mfa = newMfaValue;
    Cookies.set("user", JSON.stringify(user));
  }
};

export const updatedOnboardingCookies = (userDetails: {}) => {
  // Get the current userDetails cookie
  let user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  if (user) {
    user.userDetails = userDetails;
    Cookies.set("user", JSON.stringify(user));
  }
};

export const debounce = (func: Function, delay: number) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
