import { NextRequest } from "next/server";
import { apiCreateCard } from "@/app/actions/server/cards";
import { sendMessage } from "@/app/helpers/utils-common";

export async function POST(req: NextRequest) {
  const { card } = await req.json();

  try {
    return await apiCreateCard({
      card,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: `faild to create card` }, 500);
  }
}
