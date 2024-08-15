/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import { getTestUser } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  createUser: vi.fn(),
  registerResult: {
    normal: {
      status: 200,
      message: "Test register message",
    },
    faildFetch: {
      status: 500,
      message: "faild to register",
    },
  },
}));

vi.mock("@/app/actions/server/auth", () => ({
  createUser: mocks.createUser,
}));

const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/register`;
const { userName, email } = getTestUser();
const password = "123456";
const user = { userName, email, password, confirmPassword: password };

describe("API register", () => {
  it("Successfull work", async () => {
    mocks.createUser.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.registerResult.normal.message },
        { status: mocks.registerResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const { status, message } = mocks.registerResult.normal;
    const res = await POST(req);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.createUser.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const { status, message } = mocks.registerResult.faildFetch;
    const res = await POST(req);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
