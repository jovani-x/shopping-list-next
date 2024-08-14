/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/middleware";
import { i18nRouter } from "next-i18n-router";
import i18nConfig from "@/i18nConfig";

const mocks = vi.hoisted(() => ({
  testAuthTokenName: "auth-token",
  getAuthTokenName: vi.fn().mockImplementation(() => mocks.testAuthTokenName),
  i18nRouter: vi.fn(),
}));

vi.mock("next-i18n-router", () => ({
  i18nRouter: mocks.i18nRouter,
}));

vi.mock("@/i18nConfig", () => ({
  default: {},
}));

vi.mock("@/app/helpers/auth", () => ({
  getAuthTokenName: mocks.getAuthTokenName,
}));

describe("Middleware", () => {
  it("Invalid accessToken (protected page)", async () => {
    const request = {
      cookies: {
        get: vi.fn().mockReturnValue(undefined),
      },
      nextUrl: {
        pathname: "/protected-page",
      },
      url: "https://localhost:3000/protected-page",
    } as unknown as NextRequest;

    const response = await middleware(request);

    // https://nextjs.org/docs/app/building-your-application/routing/redirecting
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      "https://localhost:3000/login"
    );
  });

  it("Valid accessToken (protected page)", async () => {
    const validTokenStr = "valid-token";
    const request = {
      cookies: {
        get: vi.fn().mockReturnValue({ value: validTokenStr }),
      },
      nextUrl: {
        pathname: "/protected-page",
      },
      url: "https://localhost:3000/protected-page",
    } as unknown as NextRequest;
    const mockResponse = NextResponse.next();
    mocks.i18nRouter.mockReturnValue(mockResponse);
    const response = await middleware(request);

    expect(i18nRouter).toHaveBeenCalledWith(request, i18nConfig);
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#using-cookies
    expect(response.cookies.get(mocks.testAuthTokenName)).toEqual({
      name: mocks.testAuthTokenName,
      value: validTokenStr,
      path: "/",
    });
  });

  it("Unprotected page", async () => {
    const request = {
      cookies: {
        get: vi.fn().mockReturnValue(undefined),
      },
      nextUrl: {
        pathname: "/login",
      },
      url: "https://localhost:3000/login",
    } as unknown as NextRequest;
    const mockResponse = NextResponse.next();
    mocks.i18nRouter.mockReturnValue(mockResponse);
    const response = await middleware(request);

    expect(i18nRouter).toHaveBeenCalledWith(request, i18nConfig);
    expect(response).toBe(mockResponse);
  });
});
