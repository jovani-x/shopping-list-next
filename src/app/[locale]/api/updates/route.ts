import { NextRequest, NextResponse } from "next/server";
import { setRequestCurrentLang } from "@/app/helpers/actions";
import { getApiURL, getAuthCookie } from "@/app/helpers/utils";

export const dynamic = "force-dynamic";

const sendMessage = (data: any) =>
  new NextResponse(`data: ${JSON.stringify(data)}\n\n`, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-transform",
    },
  });

export async function GET(req: NextRequest) {
  const API_URL = await getApiURL();
  const abortCtrl = new AbortController();
  const { signal } = abortCtrl;

  try {
    const res = await fetch(`${API_URL}/api/updates-stream`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
      },
      signal,
    });

    if (!res?.body) {
      return sendMessage("no response body");
    }

    const reader = res.body?.getReader();

    if (!reader) {
      return sendMessage("no reader");
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

    req.signal.onabort = () => {
      abortCtrl.abort();
    };

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    if (signal.aborted) {
      return sendMessage("request was closed");
    }

    return sendMessage("faild to fetch data");
  }
}
