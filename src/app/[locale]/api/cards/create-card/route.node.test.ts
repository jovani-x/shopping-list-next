/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import { getTestCard } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  apiCreateCard: vi.fn(),
  createResult: {
    normal: {
      status: 200,
      message: "Test create card message",
    },
    faildFetch: {
      status: 500,
      message: "faild to create card",
    },
  },
}));

vi.mock("@/app/actions/server/cards", () => ({
  apiCreateCard: mocks.apiCreateCard,
}));

const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/cards/create-card`;
const { name, notes, products, isDone } = getTestCard();
const card = { name, notes, products, isDone };

describe("API register", () => {
  it("Successfull work", async () => {
    mocks.apiCreateCard.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.createResult.normal.message },
        { status: mocks.createResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    });
    const { status, message } = mocks.createResult.normal;
    const res = await POST(req);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiCreateCard.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    });
    const { status, message } = mocks.createResult.faildFetch;
    const res = await POST(req);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
