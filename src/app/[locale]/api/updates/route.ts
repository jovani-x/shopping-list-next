import { NextRequest, NextResponse } from "next/server";
import { setRequestCurrentLang } from "@/app/helpers/actions";
import { getApiURL, getAuthCookie } from "@/app/helpers/utils";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const API_URL = await getApiURL();
  const res = await fetch(`${API_URL}/api/updates-stream`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      Cookie: `${await getAuthCookie()}${await setRequestCurrentLang()}`,
    },
  });
  const reader = res.body?.getReader();

  if (!reader) {
    return new NextResponse("message: no reader\n\n", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-transform",
      },
    });
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
  });

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
