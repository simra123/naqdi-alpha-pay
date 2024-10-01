// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./constants/roles";

const adminRoutes = ["/kyc", "/users"];
const wihtoutFeeUserRoutes = ["/onboarding", "/support"];

const NOT_FOUND_URL = "/not-found";

const isAdminRoute = (pathname: string) =>
  adminRoutes.some((route) => pathname.startsWith(route));

const isWithOutFeeRoute = (pathname: string) =>
  wihtoutFeeUserRoutes.some((route) => pathname.startsWith(route));

const hasFee = (user) => user?.userDetails && user?.userDetails?.fees;

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

    // Blocking user only routes for admin
    if (user?.role == Role.ADMIN) {
      if (isWithOutFeeRoute(pathname)) {
        return NextResponse.rewrite(new URL(NOT_FOUND_URL, req.url));
      }
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
      if (
        (!isWithOutFeeRoute(pathname) && !hasFee(user)) ||
        (isWithOutFeeRoute(pathname) && hasFee(user) && pathname != "/support")
      ) {
        return NextResponse.rewrite(new URL(NOT_FOUND_URL, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
