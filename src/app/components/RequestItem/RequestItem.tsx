"use client";

import { ButtonSimple } from "@/app/components/Button/Button";
import { IRequest } from "@/app/helpers/types";
import requestStyles from "./requestItem.module.scss";

const RequestItem = ({
  request,
  approveFun,
  declineFun,
}: {
  request: IRequest;
  approveFun: (...args: any) => Promise<any>;
  declineFun: (...args: any) => Promise<any>;
}) => {
  return (
    <div className={requestStyles.item}>
      <div className={requestStyles.head}>
        <p>{request.from.userName}</p>
        <ButtonSimple
          onClick={() => {
            approveFun({ userId: request.from.id });
          }}
        >
          {"✅"}
        </ButtonSimple>
        <ButtonSimple
          onClick={() => {
            declineFun({ userId: request.from.id });
          }}
        >
          {"❌"}
        </ButtonSimple>
      </div>
      {request?.text && <q>{request.text}</q>}
    </div>
  );
};

export default RequestItem;
