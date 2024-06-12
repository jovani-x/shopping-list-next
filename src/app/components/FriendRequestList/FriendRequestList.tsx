"use server";

import RequestList from "@/app/components/RequestList/RequestList";
import { approveFriendship, declineFriendship } from "@/app/helpers/actions";
import { IRequest } from "@/app/helpers/types";

const FriendRequestList = ({ requests }: { requests: IRequest[] }) => {
  return (
    <RequestList
      requests={requests}
      approveFun={approveFriendship}
      declineFun={declineFriendship}
    />
  );
};

export default FriendRequestList;
