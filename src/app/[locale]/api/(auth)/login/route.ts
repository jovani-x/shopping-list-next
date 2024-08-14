import { NextRequest } from "next/server";
import { authenticate } from "@/app/actions/server/auth";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userName, password } = await req.json();

  try {
    return await authenticate({
      userName,
      password,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to login" }, 500);
  }
}
