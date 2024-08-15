/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { DELETE } from "./route";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  apiDeleteFriend: vi.fn(),
  deleteFriendResult: {
    normal: {
      status: 200,
      message: "Test delete friend message",
    },
    faildFetch: {
      status: 500,
      message: `faild to delete friend with id: 123456789`,
    },
  },
}));

vi.mock("@/app/actions/server/friends", () => ({
  apiDeleteFriend: mocks.apiDeleteFriend,
}));

const friendId = "123456789";
const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/friends/${friendId}`;
const params = { params: { id: friendId } };

describe("API friends (single DELETE by id)", () => {
  it("Successfull work", async () => {
    mocks.apiDeleteFriend.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.deleteFriendResult.normal.message },
        { status: mocks.deleteFriendResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
    });
    const { status, message } = mocks.deleteFriendResult.normal;
    const res = await DELETE(req, params);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiDeleteFriend.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
    });
    const { status, message } = mocks.deleteFriendResult.faildFetch;
    const res = await DELETE(req, params);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
