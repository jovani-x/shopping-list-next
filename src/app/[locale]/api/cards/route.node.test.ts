/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";
import { getTestCard } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  apiGetAllCards: vi.fn(),
  cardsResult: {
    normal: {
      status: 200,
    },
    faildFetch: {
      status: 500,
      message: "faild to fetch data",
    },
  },
}));

vi.mock("@/app/actions/server/cards", () => ({
  apiGetAllCards: mocks.apiGetAllCards,
}));

const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/cards`;
const cards = [getTestCard()];

describe("API cards", () => {
  it("Successfull work", async () => {
    mocks.apiGetAllCards.mockImplementationOnce(() => {
      return Response.json(
        { cards: cards },
        { status: mocks.cardsResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "GET",
    });
    const { status } = mocks.cardsResult.normal;
    const res = await GET(req);
    const rData = await res.json();
    expect(rData?.cards).toEqual(cards);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiGetAllCards.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "GET",
    });
    const { status, message } = mocks.cardsResult.faildFetch;
    const res = await GET(req);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
