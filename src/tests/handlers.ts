import { http, HttpResponse, RequestHandler, delay } from "msw";

const API_URL = "https://localhost:3001";
const extraReqUrl = `${API_URL}/api/updates-stream`;

export const updatesStreamResults = {
  normal: {
    status: 200,
    message: "data chunk",
  },
  faildFetch: {
    status: 500,
    message: "faild to fetch data",
  },
  serverError: {
    status: 500,
    message: "server error",
  },
  aborted: { message: "request was closed", status: 200 },
};

export const updatesStreamHandler = () =>
  http.get(extraReqUrl, async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            JSON.stringify({ message: updatesStreamResults.normal.message })
          )
        );
        controller.close();
      },
    });

    await delay(1000);
    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  });

export const serverErrorHandler = () =>
  http.get(extraReqUrl, () => {
    const { message, status } = updatesStreamResults.serverError;
    return HttpResponse.json({ message }, { status });
  });

export const noResponseHandler = () =>
  http.get(extraReqUrl, () => {
    return new HttpResponse(null);
  });

export const noReaderHandler = () =>
  http.get(extraReqUrl, () => {
    return new HttpResponse(undefined, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  });

export const abortedHandler = () =>
  http.get(extraReqUrl, () => {
    const { status } = updatesStreamResults.aborted;
    return new HttpResponse(
      new ReadableStream({
        async start(controller) {
          await delay(1000);
        },
        cancel() {},
      }),
      {
        status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  });

export const faildFetchHandler = () =>
  http.get(extraReqUrl, () => {
    return HttpResponse.error();
  });

export const handlers: RequestHandler[] = [];
