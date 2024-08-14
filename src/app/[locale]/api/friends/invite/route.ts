import { NextRequest } from "next/server";
import { apiInviteFriendViaEmail } from "@/app/actions/server/friends";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    return await apiInviteFriendViaEmail({
      data,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to invite friend" }, 500);
  }
}
