/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { getTestFriend, getTestRequest } from "@/tests/test-utils";
import {
  apiGetAllFriends,
  apiInviteFriendViaEmail,
  apiGetUserRequests,
  apiDeleteFriend,
  apiDeleteFriends,
  apiApproveFriendship,
  apiDeclineFriendship,
} from "./friends";
import { UserRequest } from "@/app/helpers/types";
import initTranslations from "@/app/i18n";
import { getApiURL } from "@/app/helpers/utils-server";
import { testServer } from "@/tests/node";
import { http, HttpResponse } from "msw";
import { transformEnumTypeValue } from "@/lib/utils";

const mocks = vi.hoisted(() => ({
  getApiURL: vi
    .fn()
    .mockImplementation(() => Promise.resolve("https://localhost:3001")),
}));

vi.mock("@/app/helpers/utils-server", () => ({
  getApiURL: mocks.getApiURL,
}));

describe("Actions (friends - server)", async () => {
  const API_URL = await getApiURL();
  const testFriend = getTestFriend();
  const pageParams = { params: { locale: "en", id: "123" } };
  const { t } = await initTranslations(pageParams.params.locale);

  describe("apiGetAllFriends", () => {
    const testUrl = `${API_URL}/api/users`;

    it("Successfull", async () => {
      const testAns = [testFriend];
      const testStatus = 200;
      testServer.use(
        http.get(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiGetAllFriends({ headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiInviteFriendViaEmail", () => {
    const testUrl = `${API_URL}/api/users/invite`;

    it("Successfull", async () => {
      const data = {
        userEmail: "my_test_friend@test.test",
        messageText: "Test invitation message",
      };
      const testAns = { message: t("invitationSent") };
      const testStatus = 200;
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiInviteFriendViaEmail({ data, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiGetUserRequests", () => {
    const testRequests = [getTestRequest()];

    describe.each([undefined, ...Object.values(UserRequest)])(
      "Request type %s",
      (type) => {
        const reqType = !type ? "" : transformEnumTypeValue(type);
        const testUrl = `${API_URL}/api/users/requests/${reqType}`;

        it("Successfull", async () => {
          const testAns = {
            requests: !type
              ? testRequests
              : testRequests.filter((r) => r.name === type),
          };

          const testStatus = 200;
          testServer.use(
            http.get(testUrl, async () => {
              return HttpResponse.json(testAns, {
                status: testStatus,
              });
            })
          );
          const res = await apiGetUserRequests({ type, headers: {} });

          expect(typeof res).toBe(typeof new Response());
          expect(res?.status).toBe(testStatus);
          expect(res?.headers?.get("Content-Type")).toBe("application/json");
          expect(await res.json()).toEqual(testAns);
        });
      }
    );
  });

  describe("apiDeleteFriend", () => {
    const testFriend = getTestFriend();
    const friendId = testFriend.id;
    const testUrl = `${API_URL}/api/users/${friendId}/friendship`;

    it("Successfull", async () => {
      const testAns = {
        message: t("userHasBeenDeleted", { userName: testFriend.userName }),
      };
      const testStatus = 200;
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiDeleteFriend({ friendId, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiDeleteFriends", () => {
    const testUrl = `${API_URL}/api/users/few/friendship`;

    it("Successfull", async () => {
      const testFriends = [
        getTestFriend(),
        getTestFriend(),
        getTestFriend(),
      ].map((fr, ix) => {
        const { id, userName, ...restProps } = fr;
        return {
          ...restProps,
          id: `test_friend_${ix}`,
          userName: `Test Friend #${ix}`,
        };
      });
      const friendIds = testFriends.map((fr) => fr.id);
      const testAns = {
        message: t("usersHaveBeenDeleted", {
          users: testFriends.map((el) => el.userName).join(", "),
        }),
      };
      const testStatus = 200;
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiDeleteFriends({ friendIds, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiApproveFriendship", () => {
    const userId = "123456789";
    const testUrl = `${API_URL}/api/users/${userId}/friendship/request`;

    it("Successfull", async () => {
      const testAns = {
        message: t("friendRequestApproved"),
      };
      const testStatus = 200;
      testServer.use(
        http.put(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiApproveFriendship({ userId, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("apiDeclineFriendship", () => {
    const userId = "123456789";
    const testUrl = `${API_URL}/api/users/${userId}/friendship/request`;

    it("Successfull", async () => {
      const testAns = {
        message: t("friendRequestDeclined"),
      };
      const testStatus = 200;
      testServer.use(
        http.delete(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await apiDeclineFriendship({ userId, headers: {} });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });
});
