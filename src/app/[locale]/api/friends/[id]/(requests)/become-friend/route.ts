import { NextRequest } from "next/server";
import {
  apiApproveFriendship,
  apiDeclineFriendship,
} from "@/app/actions/server/friends";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

// approve friendship
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    return await apiApproveFriendship({
      userId: id,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to approve friendship" }, 500);
  }
}

// decline friendship
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    return await apiDeclineFriendship({
      userId: id,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to decline friendship" }, 500);
  }
}
