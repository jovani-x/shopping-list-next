/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { GET, DELETE } from "./route";
import { NextRequest } from "next/server";
import { getTestFriend } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  apiGetAllFriends: vi.fn(),
  apiDeleteFriends: vi.fn(),
  getFriendsResult: {
    normal: {
      status: 200,
    },
    faildFetch: {
      status: 500,
      message: "faild to get friends",
    },
  },
  deleteFriendsResult: {
    normal: {
      status: 200,
      message: "Test delete friends message",
    },
    faildFetch: {
      status: 500,
      message: "faild to delete friends",
    },
  },
}));

vi.mock("@/app/actions/server/friends", () => ({
  apiGetAllFriends: mocks.apiGetAllFriends,
  apiDeleteFriends: mocks.apiDeleteFriends,
}));

const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/friends`;
const friends = [getTestFriend()];

describe("API friends (GET a few)", () => {
  it("Successfull work", async () => {
    mocks.apiGetAllFriends.mockImplementationOnce(() => {
      return Response.json(
        { friends: friends },
        { status: mocks.getFriendsResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "GET",
    });
    const { status } = mocks.getFriendsResult.normal;
    const res = await GET(req);
    const rData = await res.json();
    expect(rData?.friends).toEqual(friends);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiGetAllFriends.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "GET",
    });
    const { status, message } = mocks.getFriendsResult.faildFetch;
    const res = await GET(req);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});

describe("API friends (DELETE a few)", () => {
  it("Successfull work", async () => {
    mocks.apiDeleteFriends.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.deleteFriendsResult.normal.message },
        { status: mocks.deleteFriendsResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendIds: ["1", "21", "123456789"] }),
    });
    const { status, message } = mocks.deleteFriendsResult.normal;
    const res = await DELETE(req);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiDeleteFriends.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendIds: ["1", "21", "123456789"] }),
    });
    const { status, message } = mocks.deleteFriendsResult.faildFetch;
    const res = await DELETE(req);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch (no ids)", async () => {
    mocks.apiDeleteFriends.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendIds: [] }),
    });
    const { status, message } = mocks.deleteFriendsResult.faildFetch;
    const res = await DELETE(req);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
