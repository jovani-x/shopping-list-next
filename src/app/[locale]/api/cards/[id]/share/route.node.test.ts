/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { POST, DELETE } from "./route";
import { NextRequest } from "next/server";
import { getTestFriend } from "@/tests/test-utils";
import { UserRole } from "@/app/helpers/types";

const mocks = vi.hoisted(() => ({
  apiShareCard: vi.fn(),
  apiStopSharingCard: vi.fn(),
  sharingResult: {
    normal: {
      status: 200,
      message: "Test share card message",
    },
    faildFetch: {
      status: 500,
      message: `faild to share card with id: 123456789`,
    },
  },
  stopSharingResult: {
    normal: {
      status: 200,
      message: "Test stop sharing card message",
    },
    faildFetch: {
      status: 500,
      message: `faild to stop sharing card with id: 123456789`,
    },
  },
}));

vi.mock("@/app/actions/server/cards", () => ({
  apiShareCard: mocks.apiShareCard,
  apiStopSharingCard: mocks.apiStopSharingCard,
}));

const cardId = "123456789";
const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/cards/${cardId}`;
const params = { params: { id: cardId } };
const { id } = getTestFriend();
const data = { userId: id, role: UserRole.buyer };

describe("API cards sharing (single POST by id)", () => {
  it("Successfull work", async () => {
    mocks.apiShareCard.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.sharingResult.normal.message },
        { status: mocks.sharingResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });
    const { status, message } = mocks.sharingResult.normal;
    const res = await POST(req, params);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiShareCard.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });
    const { status, message } = mocks.sharingResult.faildFetch;
    const res = await POST(req, params);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});

describe("API cards stop sharing (single DELETE by id)", () => {
  it("Successfull work", async () => {
    mocks.apiStopSharingCard.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.stopSharingResult.normal.message },
        { status: mocks.stopSharingResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });
    const { status, message } = mocks.stopSharingResult.normal;
    const res = await DELETE(req, params);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiStopSharingCard.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });
    const { status, message } = mocks.stopSharingResult.faildFetch;
    const res = await DELETE(req, params);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
