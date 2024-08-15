/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { getTestCard } from "@/tests/test-utils";
import {
  getAllCards,
  getCard,
  createCard,
  updateCard,
  removeCard,
  addToUser,
  removeFromUser,
} from "./cards";
import { testServer } from "@/tests/node";
import { http, HttpResponse } from "msw";
import { UserRole } from "@/app/helpers/types";
import { ICard } from "@/app/components/Card/Card";

const mocks = vi.hoisted(() => ({
  getAuthCookie: vi.fn().mockImplementation(() => ""),
  getCurrentLangCookie: vi.fn().mockImplementation(() => ""),
  getBaseURL: vi.fn().mockImplementation(() => {
    // it should've been 'https://localhost:3000'
    // but test server for both API has 'https://localhost:3001'
    return Promise.resolve("https://localhost:3001");
  }),
  refreshPagesCache: vi.fn(),
}));

vi.mock("@/app/helpers/auth", () => ({
  getAuthCookie: mocks.getAuthCookie,
}));

vi.mock("@/app/helpers/language", () => ({
  getCurrentLangCookie: mocks.getCurrentLangCookie,
}));

vi.mock("@/app/helpers/utils-common", () => ({
  getBaseURL: mocks.getBaseURL,
  refreshPagesCache: mocks.refreshPagesCache,
}));

describe("Actions (cards)", async () => {
  const BASE_URL = await mocks.getBaseURL();

  describe("getAllCards", () => {
    const testUrl = `${BASE_URL}/api/cards`;
    const cards = [getTestCard()];

    it("Successfull", async () => {
      testServer.use(
        http.get(testUrl, async () => {
          return HttpResponse.json(cards, {
            status: 200,
          });
        })
      );
      const res = await getAllCards();
      expect(res).toEqual(cards);
    });

    it("Faild", async () => {
      testServer.use(
        http.get(testUrl, async () => {
          return HttpResponse.json(
            {
              message: "Test Error",
            },
            { status: 500 }
          );
        })
      );
      const res = await getAllCards();
      expect(res).toBe(null);
    });
  });

  describe("getCard", () => {
    const cardId = "123456789";
    const testUrl = `${BASE_URL}/api/cards/${cardId}`;
    const card = getTestCard();

    it("Successfull", async () => {
      testServer.use(
        http.get(testUrl, async () => {
          return HttpResponse.json(
            { card },
            {
              status: 200,
            }
          );
        })
      );
      const res = await getCard(cardId);
      expect(res).toEqual(card);
    });

    it("Faild", async () => {
      testServer.use(
        http.get(testUrl, async () => {
          return HttpResponse.json(
            {
              message: "Test Error",
            },
            { status: 500 }
          );
        })
      );
      const res = await getCard(cardId);
      expect(res).toBe(null);
    });
  });

  describe("createCard", () => {
    const testUrl = `${BASE_URL}/api/cards/create-card`;
    const card = getTestCard();
    const testMsg = `Test card #${card.id} has been created`;

    it("Successful", async () => {
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(
            { message: testMsg },
            {
              status: 200,
            }
          );
        })
      );
      const res = await createCard(card);
      expect(res?.message).toBe(testMsg);
    });

    it("Faild", async () => {
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(
            {
              message: "Test Error",
            },
            { status: 500 }
          );
        })
      );
      const res = await createCard(card);
      expect(res).toBe(null);
    });

    it("Faild (wrong data)", async () => {
      const testMsg = "Failed to createCard.";
      const { id, name, ...cardObj } = card;
      const wrondData = { ...cardObj };
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(
            {
              message: testMsg,
            },
            { status: 500 }
          );
        })
      );
      const res = await createCard(wrondData as ICard);
      expect(res?.message).toBe(testMsg);
    });
  });

  describe("updateCard", () => {
    const cardId = "123456789";
    const testUrl = `${BASE_URL}/api/cards/${cardId}`;
    const card = { ...getTestCard(), id: cardId };
    const testMsg = `Test card #${card.id} has been updated`;

    it("Successful", async () => {
      testServer.use(
        http.put(testUrl, async () => {
          return HttpResponse.json(
            { message: testMsg },
            {
              status: 200,
            }
          );
        })
      );
      const res = await updateCard(card);
      expect(res?.message).toBe(testMsg);
    });

    it("Faild", async () => {
      testServer.use(
        http.put(testUrl, async () => {
          return HttpResponse.json(
            {
              message: "Test Error",
            },
            { status: 500 }
          );
        })
      );
      const res = await updateCard(card);
      expect(res).toBe(null);
    });

    it("Faild (wrong data)", async () => {
      const testMsg = "Failed to updateCard.";
      const { id, name, isDone, ...cardObj } = card;
      const wrondData = { ...cardObj };
      testServer.use(
        http.put(testUrl, async () => {
          return HttpResponse.json(
            {
              message: testMsg,
            },
            { status: 500 }
          );
        })
      );
      const res = await updateCard(wrondData as ICard);
      expect(res?.message).toBe(testMsg);
    });
  });

  describe("removeCard", () => {
    const cardId = "123456789";
    const testUrl = `${BASE_URL}/api/cards/${cardId}`;
    const card = { ...getTestCard(), id: cardId };

    it("Successful", async () => {
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(
            { card },
            {
              status: 200,
            }
          );
        })
      );
      const res = await removeCard(cardId);
      expect(res?.card).toEqual(card);
    });

    it("Faild", async () => {
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(
            {
              message: "Test Error",
            },
            { status: 500 }
          );
        })
      );
      const res = await removeCard(cardId);
      expect(res).toBe(null);
      expect(mocks.refreshPagesCache).toBeCalled();
    });
  });

  describe("addToUser", () => {
    const cardId = "123456789";
    const testUrl = `${BASE_URL}/api/cards/${cardId}/share`;
    const testMsg = `Test card #${cardId} has been shared`;
    const userId = "12345";
    const data = { cardId, userId, role: UserRole.buyer };

    it("Successful", async () => {
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(
            { message: testMsg },
            {
              status: 200,
            }
          );
        })
      );
      const res = await addToUser(data);
      expect(res?.message).toBe(testMsg);
    });

    it("Faild", async () => {
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(
            {
              message: "Test Error",
            },
            { status: 500 }
          );
        })
      );
      const res = await addToUser(data);
      expect(res).toBe(null);
    });
  });

  describe("removeFromUser", () => {
    const cardId = "123456789";
    const testUrl = `${BASE_URL}/api/cards/${cardId}/share`;
    const testMsg = `Test card #${cardId} has been stopped sharing`;
    const userId = "12345";
    const data = { cardId, userId, role: UserRole.buyer };

    it("Successful", async () => {
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(
            { message: testMsg },
            {
              status: 200,
            }
          );
        })
      );
      const res = await removeFromUser(data);
      expect(res?.message).toBe(testMsg);
    });

    it("Faild", async () => {
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(
            {
              message: "Test Error",
            },
            { status: 500 }
          );
        })
      );
      const res = await removeFromUser(data);
      expect(res).toBe(null);
    });
  });
});
