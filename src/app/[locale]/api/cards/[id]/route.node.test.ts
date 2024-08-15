/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { GET, PUT, DELETE } from "./route";
import { NextRequest } from "next/server";
import { getTestCard } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  apiGetCard: vi.fn(),
  apiUpdateCard: vi.fn(),
  apiRemoveCard: vi.fn(),
  getCardResult: {
    normal: {
      status: 200,
      message: "Test get card message",
    },
    faildFetch: {
      status: 500,
      message: `faild to get card with id: 123456789`,
    },
  },
  updateCardResult: {
    normal: {
      status: 200,
      message: "Test update card message",
    },
    faildFetch: {
      status: 500,
      message: `faild to update card with id: 123456789`,
    },
  },
  deleteCardResult: {
    normal: {
      status: 200,
      message: "Test delete card message",
    },
    faildFetch: {
      status: 500,
      message: `faild to delete card with id: 123456789`,
    },
  },
}));

vi.mock("@/app/actions/server/cards", () => ({
  apiGetCard: mocks.apiGetCard,
  apiUpdateCard: mocks.apiUpdateCard,
  apiRemoveCard: mocks.apiRemoveCard,
}));

const cardId = "123456789";
const BASE_URL = "https:/localhost:3000";
const reqUrl = `${BASE_URL}/api/cards/${cardId}`;
const { name, notes, products, isDone } = getTestCard();
const card = { name, notes, products, isDone };
const params = { params: { id: cardId } };

describe("API cards (single GET by id)", () => {
  it("Successfull work", async () => {
    mocks.apiGetCard.mockImplementationOnce(() => {
      return Response.json(
        { card: card },
        { status: mocks.getCardResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "GET",
    });
    const { status } = mocks.getCardResult.normal;
    const res = await GET(req, params);
    const rData = await res.json();
    expect(rData?.card).toEqual(card);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiGetCard.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "GET",
    });
    const { status, message } = mocks.getCardResult.faildFetch;
    const res = await GET(req, params);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});

describe("API cards (single PUT by id)", () => {
  it("Successfull work", async () => {
    mocks.apiUpdateCard.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.updateCardResult.normal.message },
        { status: mocks.updateCardResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card }),
    });
    const { status, message } = mocks.updateCardResult.normal;
    const res = await PUT(req, params);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiUpdateCard.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card }),
    });
    const { status, message } = mocks.updateCardResult.faildFetch;
    const res = await PUT(req, params);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});

describe("API cards (single DELETE by id)", () => {
  it("Successfull work", async () => {
    mocks.apiRemoveCard.mockImplementationOnce(() => {
      return Response.json(
        { message: mocks.deleteCardResult.normal.message },
        { status: mocks.deleteCardResult.normal.status }
      );
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card }),
    });
    const { status, message } = mocks.deleteCardResult.normal;
    const res = await DELETE(req, params);
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    mocks.apiRemoveCard.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const req = new NextRequest(reqUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card }),
    });
    const { status, message } = mocks.deleteCardResult.faildFetch;
    const res = await DELETE(req, params);
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
