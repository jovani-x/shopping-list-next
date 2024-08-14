import { NextRequest } from "next/server";
import { apiGetUserRequests } from "@/app/actions/server/friends";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

// get all requests
export async function GET(req: NextRequest) {
  try {
    return await apiGetUserRequests({
      type: undefined,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to get friend requests" }, 500);
  }
}
