/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  restoreAccess: vi.fn(),
  forgetPasswordResult: {
    normal: {
      status: 200,
      message: "Test forget password message",
    },
    faildFetch: {
      status: 500,
      message: "faild to restore access",
    },
  },
}));

vi.mock("@/app/actions/server/auth", () => ({
  restoreAccess: mocks.restoreAccess,
}));

const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/forget-password`;
const email = "test@test.test";

describe("API forget password", () => {
  it("Successfull work", async () => {
    mocks.restoreAccess.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.forgetPasswordResult.normal.message },
        { status: mocks.forgetPasswordResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const { status, message } = mocks.forgetPasswordResult.normal;
    const res = await POST(req);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.restoreAccess.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const { status, message } = mocks.forgetPasswordResult.faildFetch;
    const res = await POST(req);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
