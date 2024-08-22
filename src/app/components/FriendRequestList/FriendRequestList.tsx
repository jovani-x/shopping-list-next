"use client";

import {
  approveFriendship,
  declineFriendship,
} from "@/app/actions/client/friends";
import { IRequest } from "@/app/helpers/types";
import { useTranslation } from "react-i18next";
import RequestItem from "@/app/components/RequestItem/RequestItem";
import { useStreamListener } from "@/app/helpers/listener";

const FriendRequestList = ({ requests }: { requests: IRequest[] }) => {
  const { t } = useTranslation();
  const reqData = useStreamListener({
    dataProps: requests,
    dataName: "requests",
    eventName: "usersupdate",
  }) as IRequest[];

  const renderedList =
    !reqData || !reqData?.length ? (
      <p>{t("noOne")}</p>
    ) : (
      reqData.map((req) => (
        <RequestItem
          key={req.id}
          request={req}
          approveFun={approveFriendship}
          declineFun={declineFriendship}
        />
      ))
    );

  return <>{renderedList}</>;
};

export default FriendRequestList;
