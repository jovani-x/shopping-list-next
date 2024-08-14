import { NextRequest } from "next/server";
import { createUser } from "@/app/actions/server/auth";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { user } = await req.json();

  try {
    return await createUser({
      user,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to register" }, 500);
  }
}
