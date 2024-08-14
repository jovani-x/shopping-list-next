import { NextRequest } from "next/server";
import { apiDeleteFriend } from "@/app/actions/server/friends";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    return await apiDeleteFriend({
      friendId: id,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage(
      { message: `faild to delete friend with id: ${id}` },
      500
    );
  }
}
