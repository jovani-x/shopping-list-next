"use client";

import { EditingStatusType } from "@/app/helpers/types";
import { ICard } from "@/app/components/Card/Card";
import { updateCard } from "@/app/actions/client/cards";
import { ButtonComponentsType } from "@/app/components/Button/Button";
import ButtonBack from "@/app/components/ButtonBack/ButtonBack";

const CardStatusSetter = ({
  status,
  card,
  children,
}: {
  status: EditingStatusType;
  card: ICard;
  children: React.ReactNode;
}) => {
  return (
    <ButtonBack
      btnComponentName={ButtonComponentsType.SIMPLE}
      callback={async () => await updateCard({ ...card, status })}
    >
      {children}
    </ButtonBack>
  );
};

export default CardStatusSetter;
