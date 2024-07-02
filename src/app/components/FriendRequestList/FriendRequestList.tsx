"use client";

import { approveFriendship, declineFriendship } from "@/app/helpers/actions";
import { IRequest } from "@/app/helpers/types";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import RequestItem from "@/app/components/RequestItem/RequestItem";
import { initStreamListener } from "@/app/helpers/utils-client";

const FriendRequestList = ({ requests }: { requests: IRequest[] }) => {
  const [reqData, setReqData] = useState(requests);
  const refEvSource = useRef<EventSource | null>(null);
  const { t } = useTranslation();

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

  useEffect(
    () =>
      initStreamListener({
        refEvSource,
        setData: setReqData,
        dataName: "requests",
        eventName: "usersupdate",
      }),
    []
  );

  return <>{renderedList}</>;
};

export default FriendRequestList;
