/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";
import { testServer } from "@/tests/node";
import {
  updatesStreamResults,
  updatesStreamHandler,
  serverErrorHandler,
  faildFetchHandler,
  noResponseHandler,
  noReaderHandler,
} from "@/tests/handlers";

const mocks = vi.hoisted(() => ({
  getApiURL: vi.fn().mockImplementation(() => "https://localhost:3001"),
  getAuthCookie: vi.fn(),
  getCurrentLangCookie: vi.fn(),
}));

vi.mock("@/app/helpers/utils-server", () => ({
  getApiURL: mocks.getApiURL,
}));

vi.mock("@/app/helpers/auth", () => ({
  getAuthCookie: mocks.getAuthCookie,
}));

vi.mock("@/app/helpers/language", () => ({
  getCurrentLangCookie: mocks.getCurrentLangCookie,
}));

describe("API updates", () => {
  const BASE_URL = "https:/localhost:3000";
  const reqUrl = `${BASE_URL}/api/updates`;

  it("Successfull work", async () => {
    testServer.use(updatesStreamHandler());
    const req = new NextRequest(reqUrl);
    const res = await GET(req);
    const { status, message } = updatesStreamResults.normal;

    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
    expect(res.headers.get("Cache-Control")).toBe("no-cache");
    expect(res.headers.get("Connection")).toBe("keep-alive");
    const rData = await res.json();
    expect(rData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Faild fetch", async () => {
    testServer.use(faildFetchHandler());
    const req = new NextRequest(reqUrl);
    const res = await GET(req);
    const { status, message } = updatesStreamResults.faildFetch;
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Server Error", async () => {
    testServer.use(serverErrorHandler());
    const req = new NextRequest(reqUrl);
    const res = await GET(req);
    const { status, message } = updatesStreamResults.serverError;
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("No response body", async () => {
    testServer.use(noResponseHandler());
    const req = new NextRequest(reqUrl);
    const res = await GET(req);
    const { status, message } = updatesStreamResults.faildFetch;
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("No reader", async () => {
    testServer.use(noReaderHandler());
    const req = new NextRequest(reqUrl);
    const res = await GET(req);
    const { status, message } = updatesStreamResults.faildFetch;
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });

  it("Aborted request", async () => {
    testServer.use(updatesStreamHandler());
    const abortCtrl = new AbortController();
    const req = new NextRequest(reqUrl, { signal: abortCtrl.signal });
    setTimeout(() => {
      abortCtrl.abort();
    }, 150);
    const res = await GET(req);
    const { status, message } = updatesStreamResults.aborted;
    const resData = await res.json();
    expect(resData?.message).toBe(message);
    expect(res.status).toBe(status);
  });
});
