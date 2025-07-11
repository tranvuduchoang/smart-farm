import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const lang = request.cookies.get("i18next")?.value || "en";
  const response = NextResponse.next();
  response.headers.set("x-language", lang);
  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|.*\\..*).*)"],
};
