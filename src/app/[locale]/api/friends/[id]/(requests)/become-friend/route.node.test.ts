/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { PUT, DELETE } from "./route";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  apiApproveFriendship: vi.fn(),
  apiDeclineFriendship: vi.fn(),
  approveResult: {
    normal: {
      status: 200,
      message: "Test approve friendship message",
    },
    faildFetch: {
      status: 500,
      message: `faild to approve friendship`,
    },
  },
  declineResult: {
    normal: {
      status: 200,
      message: "Test decline friendship message",
    },
    faildFetch: {
      status: 500,
      message: `faild to decline friendship`,
    },
  },
}));

vi.mock("@/app/actions/server/friends", () => ({
  apiApproveFriendship: mocks.apiApproveFriendship,
  apiDeclineFriendship: mocks.apiDeclineFriendship,
}));

const friendId = "123456789";
const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/friends/${friendId}/become-friend`;
const params = { params: { id: friendId } };

describe("API friends (approve friendship)", () => {
  it("Successfull work", async () => {
    mocks.apiApproveFriendship.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.approveResult.normal.message },
        { status: mocks.approveResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "PUT",
    });
    const { status, message } = mocks.approveResult.normal;
    const res = await PUT(req, params);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiApproveFriendship.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "PUT",
    });
    const { status, message } = mocks.approveResult.faildFetch;
    const res = await PUT(req, params);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});

describe("API cards (decline friendship)", () => {
  it("Successfull work", async () => {
    mocks.apiDeclineFriendship.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.declineResult.normal.message },
        { status: mocks.declineResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
    });
    const { status, message } = mocks.declineResult.normal;
    const res = await DELETE(req, params);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiDeclineFriendship.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
    });
    const { status, message } = mocks.declineResult.faildFetch;
    const res = await DELETE(req, params);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
