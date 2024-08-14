import { NextRequest } from "next/server";
import {
  apiGetAllFriends,
  apiDeleteFriends,
} from "@/app/actions/server/friends";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

// get all friends
export async function GET(req: NextRequest) {
  try {
    return await apiGetAllFriends({
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to get friends" }, 500);
  }
}

// delete a few friends(not all)
export async function DELETE(req: NextRequest) {
  const { friendIds } = await req.json();

  if (!friendIds?.length) {
    // delete all ?? - no sense
    return sendMessage({ message: "faild to delete friends" }, 500);
  }

  try {
    return await apiDeleteFriends({
      friendIds,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to delete friends" }, 500);
  }
}
