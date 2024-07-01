"use client";

import { EditingStatusType } from "@/app/helpers/types";
import { ICard } from "@/app/components/Card/Card";
import { updateCard } from "@/app/helpers/actions";
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
      children={children}
      callback={async () => await updateCard({ ...card, status })}
    />
  );
};

export default CardStatusSetter;
