// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./constants/roles";

const adminRoutes = ["/kyc", "/merchants", "/wallets", "/news-signup"];
const wihtoutFeeUserRoutes = ["/onboarding", "/support"];
const nonFunctionalRoutes = ["/payouts", "/wallets"];

const NOT_FOUND_URL = "/not-found";

const isAdminRoute = (pathname: string) =>
  adminRoutes.some((route) => pathname.startsWith(route));

const isNonFunctionalRoute = (pathname: string) =>
  nonFunctionalRoutes.some((route) => pathname.startsWith(route));

const isWithOutFeeRoute = (pathname: string) =>
  wihtoutFeeUserRoutes.some((route) => pathname.startsWith(route));

const hasFee = (user) => user?.company && user?.company?.fee;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isNonFunctionalRoute(pathname)) {
    return NextResponse.rewrite(new URL(NOT_FOUND_URL, req.url));
  }

  const userCookie = req.cookies.get("user");

  let user = null;

  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value);
    } catch (e) {}

    // Blocking user only routes for admin
    if (user?.role == Role.ADMIN) {
      if (isWithOutFeeRoute(pathname)) {
        return NextResponse.rewrite(new URL(NOT_FOUND_URL, req.url));
      }
    }

    // Handling Subuser scenarios as they have differnt onboarding process\

    if (user?.role == Role.USER && user?.parentUser) {
      if (user?.userDetails?.mfa && pathname == "/onboarding") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // Redirection for user only - depending on the Onboarding Status

    if (user?.role == Role.USER) {
      if (isAdminRoute(pathname)) {
        return NextResponse.rewrite(new URL(NOT_FOUND_URL, req.url));
      }

      // Checking if is a onboarding route and dont have fee also if is not onboarding route but has fees then letting the user pass
      if (
        (!isWithOutFeeRoute(pathname) && hasFee(user)) ||
        (isWithOutFeeRoute(pathname) && !hasFee(user))
      ) {
        return NextResponse.next();
      }

      // Checking if is not a onboarding route and dont have fee also if is a onboarding route but has fees then blocking the user
      if (!isWithOutFeeRoute(pathname) && !hasFee(user)) {
        if (pathname == "/") {
          return NextResponse.redirect(new URL("/onboarding", req.url));
        }
        return NextResponse.rewrite(new URL(NOT_FOUND_URL, req.url));
      }

      if (
        isWithOutFeeRoute(pathname) &&
        hasFee(user) &&
        !pathname.includes("/support")
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/((?!.*\\.).*)"],
// };

export const config = {
  matcher: [
    // Match everything except paths with file extensions and email-verification-required
    "/((?!email-verification-required)(?!login)(?!.*\\.).*)",
  ],
};
