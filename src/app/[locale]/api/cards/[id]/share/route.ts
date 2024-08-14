import { NextRequest } from "next/server";
import { apiShareCard, apiStopSharingCard } from "@/app/actions/server/cards";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

// share card by id
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId, role } = await req.json();

  try {
    return await apiShareCard({
      data: {
        cardId: id,
        userId,
        role,
      },
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: `faild to share card with id: ${id}` }, 500);
  }
}

// stop sharing card by id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId, role } = await req.json();

  try {
    return await apiStopSharingCard({
      data: {
        cardId: id,
        userId,
        role,
      },
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage(
      { message: `faild to stop sharing card with id: ${id}` },
      500
    );
  }
}
