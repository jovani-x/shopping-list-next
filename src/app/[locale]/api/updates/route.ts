import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/app/helpers/utils-common";
import { getCurrentLangCookie } from "@/app/helpers/language";
import { getApiURL } from "@/app/helpers/utils-server";
import { getAuthCookie } from "@/app/helpers/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const API_URL = await getApiURL();
  const abortCtrl = new AbortController();
  const { signal } = abortCtrl;

  req.signal.onabort = async () => {
    await abortCtrl.abort();
    return sendMessage({ message: "request was closed" });
  };

  try {
    const res = await fetch(`${API_URL}/api/updates-stream`, {
      method: "GET",
      cache: "no-cache",
      credentials: "include",
      mode: "cors",
      headers: {
        Cookie: `${await getAuthCookie()}${await getCurrentLangCookie()}`,
      },
      signal,
    });

    if (res.status !== 200) {
      const resData = await res.json();
      return sendMessage(resData, res.status);
    }

    const reader = res?.body?.getReader();

    if (!res?.body || !reader) {
      throw new Error("no response body");
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        return pump();

        async function pump() {
          if (!reader) return;

          const { done, value } = await reader.read();

          if (done) {
            controller.close();
            return;
          }

          controller.enqueue(value);
          return pump();
        }
      },
      cancel() {},
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    if (signal.aborted) {
      return sendMessage({ message: "request was closed" });
    }

    return sendMessage({ message: "faild to fetch data" }, 500);
  }
}
