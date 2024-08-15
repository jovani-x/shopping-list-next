/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { getTestCard } from "@/tests/test-utils";
import {
  apiGetAllCards,
  apiGetCard,
  apiCreateCard,
  apiUpdateCard,
  apiRemoveCard,
  apiShareCard,
  apiStopSharingCard,
} from "./cards";
import { getApiURL } from "@/app/helpers/utils-server";
import { testServer } from "@/tests/node";
import { http, HttpResponse } from "msw";
import { UserRole } from "@/app/helpers/types";

const mocks = vi.hoisted(() => ({
  getApiURL: vi
    .fn()
    .mockImplementation(() => Promise.resolve("https://localhost:3001")),
}));

vi.mock("@/app/helpers/utils-server", () => ({
  getApiURL: mocks.getApiURL,
}));

describe("Actions (cards - server)", async () => {
  const API_URL = await getApiURL();
  const testCard = getTestCard();

  describe("apiGetAllCards", () => {
    const testUrl = `${API_URL}/api/cards`;

    it("Successfull", async () => {
      const testAns = [testCard];
      const testStatus = 200;
      testServer.use(
        http.get(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiGetAllCards({ headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiGetCard", () => {
    const cardId = testCard.id;
    const testUrl = `${API_URL}/api/cards/${cardId}`;

    it("Successfull", async () => {
      const testAns = { ...testCard };
      const testStatus = 200;
      testServer.use(
        http.get(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiGetCard({ cardId, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiCreateCard", () => {
    const testUrl = `${API_URL}/api/cards/new`;

    it("Successfull", async () => {
      const testAns = { card: { ...testCard } };
      const testStatus = 201;
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiCreateCard({ card: { ...testCard }, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiUpdateCard", () => {
    const cardId = testCard.id;
    const testUrl = `${API_URL}/api/cards/${cardId}`;

    it("Successfull", async () => {
      const testAns = { card: { ...testCard } };
      const testStatus = 200;
      testServer.use(
        http.put(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiUpdateCard({ card: { ...testCard }, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiRemoveCard", () => {
    const cardId = testCard.id;
    const testUrl = `${API_URL}/api/cards/${cardId}`;

    it("Successfull", async () => {
      const testAns = { card: { ...testCard } };
      const testStatus = 200;
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiRemoveCard({ cardId, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiShareCard", () => {
    const cardId = testCard.id;
    const testUrl = `${API_URL}/api/cards/${cardId}/share`;

    it("Successfull", async () => {
      const userId = "123456789_test_user_id";
      const data = {
        cardId,
        userId,
        role: UserRole.buyer,
      };
      const testAns = { cardId };
      const testStatus = 201;
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiShareCard({ data, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiStopSharingCard", () => {
    const cardId = testCard.id;
    const testUrl = `${API_URL}/api/cards/${cardId}/share`;

    it("Successfull", async () => {
      const userId = "123456789_test_user_id";
      const data = {
        cardId,
        userId,
        role: UserRole.buyer,
      };
      const testAns = { cardId };
      const testStatus = 200;
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiStopSharingCard({ data, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });
});
