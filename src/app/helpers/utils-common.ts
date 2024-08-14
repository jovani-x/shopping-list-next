"use server";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const getBaseURL = async () => process.env.NEXT_PUBLIC_URL;

export const refreshPagesCache = (pathNames: string[]) => {
  const origin = headers().get("origin");
  pathNames.map((pathname) => revalidatePath(`${origin}${pathname}`));
};

export const sendMessage = (data: any, status?: number) => {
  return NextResponse.json(data, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-transform",
    },
    status: status,
  });
};

// fix 'fetch failed UND_ERR_REQ_CONTENT_LENGTH_MISMATCH'
export const fixFetchHeaders = (headers: Headers) => {
  headers.delete("content-length");
};
