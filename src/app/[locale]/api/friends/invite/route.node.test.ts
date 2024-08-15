/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  apiInviteFriendViaEmail: vi.fn(),
  inviteResult: {
    normal: {
      status: 200,
      message: "Test invite message",
    },
    faildFetch: {
      status: 500,
      message: "faild to invite friend",
    },
  },
}));

vi.mock("@/app/actions/server/friends", () => ({
  apiInviteFriendViaEmail: mocks.apiInviteFriendViaEmail,
}));

const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/friends/invite`;
const data = {
  userEmail: "test_email@test.test",
  messageText: "Test message",
};

describe("API friends (invite friend)", () => {
  it("Successfull work", async () => {
    mocks.apiInviteFriendViaEmail.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.inviteResult.normal.message },
        { status: mocks.inviteResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    const { status, message } = mocks.inviteResult.normal;
    const res = await POST(req);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiInviteFriendViaEmail.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    const { status, message } = mocks.inviteResult.faildFetch;
    const res = await POST(req);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
