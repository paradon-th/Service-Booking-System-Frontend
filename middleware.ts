import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/constants";
import { ServiceFunction } from "@/lib/auth/service-functions";

const PERMISSION_REQUIRED_ROUTES: { pattern: RegExp; serviceFuncIds: number[] }[] = [
  { pattern: /^\/overview$/, serviceFuncIds: [ServiceFunction.Overview] },
  { pattern: /^\/tag\/(configuration|relation-configuration)/, serviceFuncIds: [ServiceFunction.Tag, ServiceFunction.TagGroup] },
  { pattern: /^\/data\/(editor|relation-editor)/, serviceFuncIds: [ServiceFunction.Data, ServiceFunction.DataRelation] },
  { pattern: /^\/scheduling\//, serviceFuncIds: [ServiceFunction.Scheduler] },
  { pattern: /^\/event\//, serviceFuncIds: [ServiceFunction.Event] },
  { pattern: /^\/interface\//, serviceFuncIds: [ServiceFunction.Interface, ServiceFunction.InterfaceMapping] },
  { pattern: /^\/integration\//, serviceFuncIds: [ServiceFunction.IntegrationProvider, ServiceFunction.IntegrationPublisher] },
  { pattern: /^\/security\/user-management$/, serviceFuncIds: [ServiceFunction.SecurityUser] },
  { pattern: /^\/security\/group-management$/, serviceFuncIds: [ServiceFunction.SecurityGroup] },
  { pattern: /^\/security\/role-permission-management$/, serviceFuncIds: [ServiceFunction.SecurityRole] },
  { pattern: /^\/security\/token-provider-management$/, serviceFuncIds: [ServiceFunction.SecurityToken] },
  {
    pattern: /^\/log\/(application|system|security|error)/,
    serviceFuncIds: [ServiceFunction.LogApplication, ServiceFunction.LogSystem, ServiceFunction.LogSecurity, ServiceFunction.LogError]
  }
];

const PUBLIC_PAGES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/verifycode",
  "/newpassword",
  "/terms-of-service",
  "/privacy-policy"
]);

const PUBLIC_API_PREFIXES = [
  "/api/auth/login",
  "/api/auth/password/request",
  "/api/auth/password/verify",
  "/api/auth/password/reset",
  "/api/auth/register"
];

export function middleware(request: NextRequest) {
  const { pathname: rawPath } = request.nextUrl;
  const pathname = rawPath.endsWith("/") && rawPath !== "/" ? rawPath.slice(0, -1) : rawPath;

  if (pathname.startsWith("/_next/static") || pathname.startsWith("/_next/image") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const isApi = pathname.startsWith("/api");
  const isPublicApi = PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isApi) {
    if (isPublicApi) {
      return NextResponse.next();
    }

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.next();
  }

  const isPublicPage = PUBLIC_PAGES.has(pathname);

  if (isPublicPage) {
    if (token) {
      return NextResponse.redirect(new URL("/overview", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"]
};
