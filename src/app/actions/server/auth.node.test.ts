/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { getTestUser } from "@/tests/test-utils";
import { authenticate, signout, createUser, restoreAccess } from "./auth";
import initTranslations from "@/app/i18n";
import { getApiURL } from "@/app/helpers/utils-server";
import { testServer } from "@/tests/node";
import { http, HttpResponse } from "msw";

const mocks = vi.hoisted(() => ({
  getApiURL: vi
    .fn()
    .mockImplementation(() => Promise.resolve("https://localhost:3001")),
}));

vi.mock("@/app/helpers/utils-server", () => ({
  getApiURL: mocks.getApiURL,
}));

describe("Actions (auth - server)", async () => {
  const API_URL = await getApiURL();
  const user = getTestUser();
  const pageParams = { params: { locale: "en", id: "123" } };
  const { t } = await initTranslations(pageParams.params.locale);

  describe("authenticate", async () => {
    const testUrl = `${API_URL}/api/auth/login`;

    it("Successfull", async () => {
      const testAns = { userName: user.userName };
      const testStatus = 200;
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await authenticate({
        userName: "test user",
        password: "12345",
        headers: {},
      });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("signout", async () => {
    const testUrl = `${API_URL}/api/auth/logout`;

    it("Successfull", async () => {
      const testAns = {
        message: t("userHasBeenSignedOut", { userName: user?.userName }),
      };
      const testStatus = 200;
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await signout({
        headers: {},
      });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("createUser", async () => {
    const testUrl = `${API_URL}/api/auth/register`;

    it("Successfull", async () => {
      const testAns = {
        userName: user.userName,
        message: t("userHasBeenRegistered", { userName: user.userName }),
      };
      const testStatus = 201;
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await createUser({
        user: {
          userName: "test user",
          email: "test@test.test",
          password: "12345",
          confirmPassword: "12345",
        },
        headers: {},
      });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });

  describe("restoreAccess", async () => {
    const testUrl = `${API_URL}/api/auth/forget`;

    it("Successfull", async () => {
      const testEmail = "test@test.test";
      const testAns = {
        message: `${t("furtherInstructionsHaveBeenSentToEmailAddress", {
          email: testEmail,
        })}.`,
      };
      const testStatus = 200;
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(testAns, {
            status: testStatus,
          });
        })
      );
      const res = await restoreAccess({
        email: testEmail,
        headers: {},
      });

      expect(typeof res).toBe(typeof new Response());
      expect(res?.status).toBe(testStatus);
      expect(res?.headers?.get("Content-Type")).toBe("application/json");
      expect(await res.json()).toEqual(testAns);
    });
  });
});
