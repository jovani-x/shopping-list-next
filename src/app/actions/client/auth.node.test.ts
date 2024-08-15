/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { getTestUser } from "@/tests/test-utils";
import { login, logout, registerUser, forgetPassword } from "./auth";
import { getBaseURL } from "@/app/helpers/utils-common";
import { testServer } from "@/tests/node";
import { http, HttpResponse } from "msw";

const mocks = vi.hoisted(() => ({
  tokenName: "test_token_name",
  getAuthTokenName: vi.fn().mockImplementation(() => mocks.tokenName),
  getAuthCookie: vi.fn().mockImplementation(() => ""),
  getAuthCookieFull: vi
    .fn()
    .mockImplementation(() => "test_cookie=lorem_ipsum"),
  setAuthCookie: vi.fn(),
  getCurrentLangCookie: vi.fn().mockImplementation(() => ""),
  getBaseURL: vi.fn().mockImplementation(() => {
    // it should've been 'https://localhost:3000'
    // but test server for both API has 'https://localhost:3001'
    return Promise.resolve("https://localhost:3001");
  }),
  refreshPagesCache: vi.fn(),
  cookieDelete: vi.fn(),
  cookies: vi.fn().mockImplementation(() => ({
    delete: mocks.cookieDelete,
  })),
}));

vi.mock("next/headers", () => ({
  cookies: mocks.cookies,
}));

vi.mock("@/app/helpers/auth", () => ({
  getAuthTokenName: mocks.getAuthTokenName,
  getAuthCookie: mocks.getAuthCookie,
  getAuthCookieFull: mocks.getAuthCookieFull,
  setAuthCookie: mocks.setAuthCookie,
}));

vi.mock("@/app/helpers/language", () => ({
  getCurrentLangCookie: mocks.getCurrentLangCookie,
}));

vi.mock("@/app/helpers/utils-common", () => ({
  getBaseURL: mocks.getBaseURL,
  refreshPagesCache: mocks.refreshPagesCache,
}));

describe("Actions (auth - client)", async () => {
  const BASE_URL = await getBaseURL();
  const user = getTestUser();

  describe("login", async () => {
    const testUrl = `${BASE_URL}/api/login`;

    it("Successfull", async () => {
      const testUser = { user: { userName: user.userName } };
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(testUser, {
            status: 200,
          });
        })
      );
      const formData = new FormData();
      formData.append("userName", "test user");
      formData.append("password", "12345");
      const res = await login(formData);
      expect(res).toEqual(testUser);
      expect(mocks.getAuthCookieFull).toBeCalled();
      expect(mocks.setAuthCookie).toBeCalled();
    });

    it("Faild (wrong data)", async () => {
      const testMsg = "Missing fields. Failed to authenticate.";
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
      const formData = new FormData();
      formData.append("userName", "");
      formData.append("password", "");
      const res = await login(formData);
      expect(res?.message).toBe(testMsg);
    });
  });

  describe("logout", async () => {
    const testUrl = `${BASE_URL}/api/logout`;

    it("Successfull", async () => {
      const testMsg = `Test logout message`;
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

      const res = await logout();
      expect(res?.message).toBe(testMsg);
      expect(mocks.cookieDelete).toBeCalledWith(mocks.tokenName);
    });

    it("Faild", async () => {
      const testMsg = "Test Error";
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
      const res = await logout();
      expect(res?.message).toBe(testMsg);
    });

    it("Faild (error)", async () => {
      const testMsg = "Test Error";
      testServer.use(
        http.post(testUrl, async () => {
          throw new Error(testMsg);
        })
      );
      const res = await logout();
      expect(res?.message).toBe(testMsg);
      expect(mocks.cookieDelete).toBeCalledWith(mocks.tokenName);
    });
  });

  describe("registerUser", async () => {
    const testUrl = `${BASE_URL}/api/register`;
    const testUserName = "test user";

    it("Successfull", async () => {
      const testMsg = `Test logout message`;
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(
            {
              userName: testUserName,
              message: testMsg,
            },
            {
              status: 201,
            }
          );
        })
      );

      const formDate = new FormData();
      formDate.append("userName", testUserName);
      formDate.append("email", "test@test.test");
      formDate.append("password", "12345");
      formDate.append("confirmPassword", "12345");
      const res = await registerUser(formDate);
      expect(res?.userName).toBe(testUserName);
      expect(res?.message).toBe(testMsg);
    });

    it("Faild", async () => {
      const testMsg = "Test Error";
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
      const formDate = new FormData();
      formDate.append("userName", testUserName);
      formDate.append("email", "test@test.test");
      formDate.append("password", "12345");
      formDate.append("confirmPassword", "12345");
      const res = await registerUser(formDate);
      expect(res?.message).toBe(testMsg);
    });

    it("Faild (wrong data)", async () => {
      const errorMsg =
        "Failed to register.\nUSERNAME: Required\nEMAIL: Required\nPASSWORD: Required\nCONFIRMPASSWORD: String must contain at least 5 character(s)";
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(null, { status: 500 });
        })
      );
      const formDate = new FormData();
      formDate.append("confirmPassword", "1234");
      const res = await registerUser(formDate);
      expect(res?.message).toBe(errorMsg);
    });
  });

  describe("forgetPassword", async () => {
    const testUrl = `${BASE_URL}/api/forget-password`;
    const testEmail = "test@test.test";

    it("Successfull", async () => {
      const testMsg = `Test forgetPassword message`;
      testServer.use(
        http.post(testUrl, async () => {
          return HttpResponse.json(
            {
              message: testMsg,
            },
            {
              status: 201,
            }
          );
        })
      );

      const formDate = new FormData();
      formDate.append("email", testEmail);
      const res = await forgetPassword(formDate);
      expect(res?.message).toBe(testMsg);
    });

    it("Faild", async () => {
      const testMsg = `Failed to renew access.`;
      const wrongEmail = "test.test";

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
      const formDate = new FormData();
      formDate.append("email", wrongEmail);
      const res = await forgetPassword(formDate);
      expect(res?.message).toBe(testMsg);
    });
  });
});
