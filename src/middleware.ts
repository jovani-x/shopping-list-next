import { NextResponse, NextRequest } from "next/server";
import { i18nRouter } from "next-i18n-router";
import i18nConfig from "@/i18nConfig";
import { getAuthTokenName } from "@/app/helpers/auth";

export async function middleware(request: NextRequest) {
  const tokenName = await getAuthTokenName();
  const accessToken = request.cookies.get(tokenName)?.value || "";

  if (!accessToken && isProtectedPage(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = i18nRouter(request, i18nConfig);

  if (accessToken.length) {
    response.cookies.set(tokenName, accessToken);
  } else {
    response.cookies.delete(tokenName);
  }

  return response;
}

function isProtectedPage(pathname: string) {
  const unprotectedList = [
    "/login",
    "/register",
    "/forget-password",
    // "/api/login",
    // "/api/register",
    // "/api/forget-password",
  ];
  let isUnprotected = false;
  unprotectedList.map((r) => {
    isUnprotected ||= pathname.includes(r);
  });
  return !isUnprotected;
}

export const config = {
  // matcher: "/((?!api|static|.*\\..*|_next).*)",
  matcher: "/((?!static|.*\\..*|_next).*)",
};
