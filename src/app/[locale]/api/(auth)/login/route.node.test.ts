/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  authenticate: vi.fn(),
  loginResult: {
    normal: {
      status: 200,
      message: "Test login message",
    },
    faildFetch: {
      status: 500,
      message: "faild to login",
    },
  },
}));

vi.mock("@/app/actions/server/auth", () => ({
  authenticate: mocks.authenticate,
}));

const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/login`;
const data = { userName: "Test user", password: "123456" };

describe("API login", () => {
  it("Successfull work", async () => {
    mocks.authenticate.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.loginResult.normal.message },
        { status: mocks.loginResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const { status, message } = mocks.loginResult.normal;
    const res = await POST(req);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.authenticate.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const { status, message } = mocks.loginResult.faildFetch;
    const res = await POST(req);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
