import { NextRequest } from "next/server";
import { signout } from "@/app/actions/server/auth";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    return await signout({ headers: req.headers });
  } catch (err) {
    return sendMessage({ message: "faild to logout" }, 500);
  }
}
