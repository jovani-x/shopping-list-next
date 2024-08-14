import { NextRequest } from "next/server";
import { restoreAccess } from "@/app/actions/server/auth";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    return await restoreAccess({
      email,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to restore access" }, 500);
  }
}
