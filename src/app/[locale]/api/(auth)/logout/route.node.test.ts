/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  signout: vi.fn(),
  logoutResult: {
    normal: {
      status: 200,
      message: "Test logout message",
    },
    faildFetch: {
      status: 500,
      message: "faild to logout",
    },
  },
}));

vi.mock("@/app/actions/server/auth", () => ({
  signout: mocks.signout,
}));

const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/logout`;

describe("API logout", () => {
  it("Successfull work", async () => {
    mocks.signout.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.logoutResult.normal.message },
        { status: mocks.logoutResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const { status, message } = mocks.logoutResult.normal;
    const res = await POST(req);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.signout.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const { status, message } = mocks.logoutResult.faildFetch;
    const res = await POST(req);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
