import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env";

const protectedRoutes = ["home/*", "c/*"];
const unprotectedRoutes = ["sign-in", "sign-up"];

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (route.endsWith("/*")) {
      const routeBase = route.slice(0, -2); // Remove "/*"
      return pathname.startsWith(`/${routeBase}`);
    }
    // Handle exact matches
    return pathname === `/${route}` || pathname.startsWith(`/${route}/`);
  });
}

async function checkAuthentication(request: NextRequest): Promise<boolean> {
  try {
    // Get cookies from the request in middleware context
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(`${env.API_URL}/api/v1/auth/check-auth`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data?.detail?.logged_in === true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isProtectedRoute = matchesRoute(pathname, protectedRoutes);
  const isUnprotectedRoute = matchesRoute(pathname, unprotectedRoutes);

  const isAuthenticated = await checkAuthentication(request);

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (isUnprotectedRoute) {
    if (isAuthenticated) {
      const redirectUrl = request.nextUrl.searchParams.get("redirect");
      if (redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
