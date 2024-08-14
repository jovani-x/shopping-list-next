import { NextRequest } from "next/server";
import { apiGetUserRequests } from "@/app/actions/server/friends";
import { sendMessage } from "@/app/helpers/utils-common";
import { getEnumTypeEntityByValue } from "@/lib/utils";
import { UserRequest } from "@/app/helpers/types";

export const dynamic = "force-dynamic";

// get all requests by type
export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;
  const entity = getEnumTypeEntityByValue({
    EnumType: UserRequest,
    targetValue: type,
    withTransform: true,
  });

  try {
    return await apiGetUserRequests({
      type: entity?.value,
      headers: req.headers,
    });
  } catch (err) {
    return sendMessage({ message: "faild to get friend requests" }, 500);
  }
}
