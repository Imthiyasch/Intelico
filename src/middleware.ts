import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/builder"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the route needs protection
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  // Check for Supabase auth cookie
  const supabaseCookie =
    req.cookies.get("sb-access-token")?.value ||
    req.cookies.get("supabase-auth-token")?.value ||
    // Look for any Supabase session cookie
    [...req.cookies.getAll()].find(c => c.name.includes("supabase") || c.name.startsWith("sb-"))?.value;

  if (!supabaseCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("redirected", "true");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/builder/:path*"],
};
