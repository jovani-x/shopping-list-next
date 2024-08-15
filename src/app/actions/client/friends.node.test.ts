/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { getTestFriend, getTestRequest } from "@/tests/test-utils";
import {
  getAllFriends,
  inviteFriendViaEmail,
  getUserRequests,
  deleteFriend,
  deleteFriends,
  approveFriendship,
  declineFriendship,
} from "./friends";
import { UserRequest } from "@/app/helpers/types";
import { testServer } from "@/tests/node";
import { http, HttpResponse } from "msw";

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

describe("Actions (friends)", async () => {
  const BASE_URL = await mocks.getBaseURL();

  describe("getAllFriends", () => {
    const testUrl = `${BASE_URL}/api/friends`;
    const friends = [getTestFriend()];

    it("Successfull", async () => {
      testServer.use(
        http.get(testUrl, async () => {
          return HttpResponse.json(friends, {
            status: 200,
          });
        })
      );
      const res = await getAllFriends();
      expect(res).toEqual(friends);
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
      const res = await getAllFriends();
      expect(res).toBe(null);
    });
  });

  describe("inviteFriendViaEmail", () => {
    const testUrl = `${BASE_URL}/api/friends/invite`;

    it("Successful", async () => {
      const formData = new FormData();
      formData.append("email", "test@test.test");
      formData.append("message", "Hello, be my test-friend.");
      const testMsg = "Test message";
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
      const res = await inviteFriendViaEmail(formData);
      expect(res?.message).toBe(testMsg);
    });

    it("Faild", async () => {
      const errorMsg = "Failed to invite friend.";
      const formData = new FormData();
      formData.append("email", "");
      formData.append("message", "Hello, be my test-friend.");
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(
            {
              message: errorMsg,
            },
            { status: 500 }
          );
        })
      );
      const res = await inviteFriendViaEmail(formData);
      expect(res?.message).toBe(errorMsg);
    });
  });

  describe("getUserRequests", () => {
    const testUrl = `${BASE_URL}/api/friends/requests`;
    const requests = [getTestRequest()];

    it("Successful (all)", async () => {
      testServer.use(
        http.get(testUrl, async () => {
          return HttpResponse.json({ requests }, { status: 200 });
        })
      );
      const res = await getUserRequests({});
      expect(res).toEqual(requests);
    });

    for (const key in UserRequest) {
      const type = key as keyof typeof UserRequest;
      const value = UserRequest[type];

      it(`Successful (${key})`, async () => {
        const typeRequests = requests.filter((el) => el.name === value);
        testServer.use(
          http.get(`${testUrl}/${key}`, async () => {
            return HttpResponse.json(
              { requests: typeRequests },
              { status: 200 }
            );
          })
        );
        const res = await getUserRequests({ type: key as UserRequest });
        expect(res).toEqual(typeRequests);
      });
    }

    it("Faild", async () => {
      testServer.use(
        http.get(testUrl, async () => {
          return HttpResponse.json(null, { status: 500 });
        })
      );
      const res = await getUserRequests({});
      expect(res).toBe(null);
    });
  });

  describe("deleteFriend (single)", () => {
    const friendId = "123456789";
    const testUrl = `${BASE_URL}/api/friends/${friendId}`;
    const testMsg = "Test message";

    it("Successful", async () => {
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json({ message: testMsg }, { status: 200 });
        })
      );
      const res = await deleteFriend({ friendId });
      expect(res?.message).toBe(testMsg);
      expect(mocks.refreshPagesCache).toBeCalled();
    });

    it("Faild", async () => {
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(null, { status: 500 });
        })
      );
      const res = await deleteFriend({ friendId });
      expect(res).toBe(null);
    });
  });

  describe("deleteFriends (a few)", () => {
    const friendIds = ["123456789", "987654321"];
    const testUrl = `${BASE_URL}/api/friends`;
    const testMsg = "Test message";

    it("Successful", async () => {
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json({ message: testMsg }, { status: 200 });
        })
      );
      const res = await deleteFriends({ friendIds });
      expect(res?.message).toBe(testMsg);
      expect(mocks.refreshPagesCache).toBeCalled();
    });

    it("Faild", async () => {
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(null, { status: 500 });
        })
      );
      const res = await deleteFriends({ friendIds });
      expect(res).toBe(null);
    });
  });

  describe("approveFriendship", () => {
    const userId = "123456789";
    const testUrl = `${BASE_URL}/api/friends/${userId}/become-friend`;
    const testMsg = "Test message";

    it("Successful", async () => {
      testServer.use(
        http.put(testUrl, async () => {
          return HttpResponse.json({ message: testMsg }, { status: 200 });
        })
      );
      const res = await approveFriendship({ userId });
      expect(res?.message).toBe(testMsg);
      expect(mocks.refreshPagesCache).toBeCalled();
    });

    it("Faild", async () => {
      testServer.use(
        http.put(testUrl, async () => {
          return HttpResponse.json(null, { status: 500 });
        })
      );
      const res = await approveFriendship({ userId });
      expect(res).toBe(null);
    });
  });

  describe("declineFriendship", () => {
    const userId = "123456789";
    const testUrl = `${BASE_URL}/api/friends/${userId}/become-friend`;
    const testMsg = "Test message";

    it("Successful", async () => {
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json({ message: testMsg }, { status: 200 });
        })
      );
      const res = await declineFriendship({ userId });
      expect(res?.message).toBe(testMsg);
      expect(mocks.refreshPagesCache).toBeCalled();
    });

    it("Faild", async () => {
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(null, { status: 500 });
        })
      );
      const res = await declineFriendship({ userId });
      expect(res).toBe(null);
    });
  });
});
