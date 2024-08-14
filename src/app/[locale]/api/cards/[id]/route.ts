import { NextRequest } from "next/server";
import {
  apiGetCard,
  apiUpdateCard,
  apiRemoveCard,
} from "@/app/actions/server/cards";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

// get card by id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    return await apiGetCard({
      cardId: id,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: `faild to get card with id: ${id}` }, 500);
  }
}

// update card by id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { card } = await req.json();

  try {
    return await apiUpdateCard({
      card,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: `faild to update card with id: ${id}` }, 500);
  }
}

// delete card by id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    return await apiRemoveCard({
      cardId: id,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: `faild to delete card with id: ${id}` }, 500);
  }
}
