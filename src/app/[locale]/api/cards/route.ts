import { NextRequest } from "next/server";
import { apiGetAllCards } from "@/app/actions/server/cards";
import { sendMessage } from "@/app/helpers/utils-common";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    return await apiGetAllCards({
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to fetch data" }, 500);
  }
}
