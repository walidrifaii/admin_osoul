import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (
    pathname === "/" &&
    (searchParams.has("username") || searchParams.has("password"))
  ) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.search = "";
    return NextResponse.redirect(cleanUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
