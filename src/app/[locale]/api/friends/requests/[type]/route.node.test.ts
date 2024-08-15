/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";
import { getTestRequest } from "@/tests/test-utils";
import { UserRequest } from "@/app/helpers/types";

const mocks = vi.hoisted(() => ({
  apiGetUserRequests: vi.fn(),
  getRequestsResult: {
    normal: {
      status: 200,
    },
    faildFetch: {
      status: 500,
      message: "faild to get friend requests",
    },
  },
}));

vi.mock("@/app/actions/server/friends", () => ({
  apiGetUserRequests: mocks.apiGetUserRequests,
}));

const testType = UserRequest.becomeFriend;
const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/friends/requests/${testType}`;
const requests = [getTestRequest()];
const params = { params: { type: testType } };

describe("API friends requests by type (GET a few)", () => {
  it("Successfull work", async () => {
    mocks.apiGetUserRequests.mockImplementationOnce(() => {
      return Response.json(
        { requests: requests },
        { status: mocks.getRequestsResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "GET",
    });
    const { status } = mocks.getRequestsResult.normal;
    const res = await GET(req, params);
    const rData = await res.json();
    expect(rData?.requests).toEqual(requests);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiGetUserRequests.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "GET",
    });
    const { status, message } = mocks.getRequestsResult.faildFetch;
    const res = await GET(req, params);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
