// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./constants/roles";

const adminRoutes = ["/kyc", "/users"];
const NOT_FOUND_URL = "/not-found";
const ONBOARDING_URL = "/onboarding";
const SUPPORT_URL = "/support";

const isAdminRoute = (pathname: string) =>
  adminRoutes.some((route) => pathname.startsWith(route));

const shouldRedirectToOnboarding = (user: any, pathname: string) =>
  (!user?.userDetails || !user.userDetails.fees) &&
  !pathname.startsWith(SUPPORT_URL);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userCookie = req.cookies.get("user");

  console.log("Middleware is running for ", pathname);

  let user = null;

  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value);
    } catch (e) {
      console.error("Invalid localUser cookie");
    }

    // Handling Redirection In case user tries to access an admin only route
    if (isAdminRoute(pathname) && user?.role !== Role.ADMIN) {
      return NextResponse.rewrite(new URL(NOT_FOUND_URL, req.url));
    }

    // Redirection for user only - depending on the Onboarding Status
    if (user?.role === Role.USER) {
      if (pathname.startsWith(ONBOARDING_URL)) {
        if (user.userDetails?.fees) {
          return NextResponse.rewrite(new URL(NOT_FOUND_URL, req.url));
        }
      } else if (shouldRedirectToOnboarding(user, pathname)) {
        return NextResponse.redirect(new URL(ONBOARDING_URL, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
