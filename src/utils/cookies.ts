import Cookies from "js-cookie";

export const updateMfaInCookie = (newMfaValue) => {
  // Get the current userDetails cookie
  let user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  if (user) {
    user.userDetails.mfa = newMfaValue;
    Cookies.set("user", JSON.stringify(user));
  }
};
