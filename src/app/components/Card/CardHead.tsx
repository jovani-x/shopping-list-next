"use client";

import { useState } from "react";
import { UserRole, CardEditingStatus } from "@/app/helpers/types";
import { useTranslation } from "react-i18next";
import { useUserContext } from "@/app/components/ProvideUserContext/ProvideUserContext";
import { useCardContext } from "./CardContextProvider";
import { ButtonSimple } from "@/app/components/Button/Button";
import Share from "@/app/components/Share/Share";
import Confirmation from "@/app/components/Confirmation/Confirmation";

const CardHeadContent = () => {
  const { t } = useTranslation();
  const {
    card,
    isChanged,
    isDone,
    shareAction,
    editAction,
    shoppingAction,
    saveAction,
    deleteAction,
  } = useCardContext();
  const [isTooltipShown, setIsTooltipShown] = useState(false);

  const user = useUserContext();
  const userName = user?.userName ?? "";
  const inProcess = card.status?.value === CardEditingStatus.IN_PROCESS;
  const isSameUser =
    !!card.status?.userName && card.status.userName === userName;

  const isFreeForActions =
    card.status?.value === CardEditingStatus.FREE ||
    card.status?.value === undefined;
  const isBeingEdited = card.status?.value === CardEditingStatus.EDITING;
  const isOwner = card.userRole === UserRole.owner;
  const isShareAllowed = isOwner;
  const isEditAllowed =
    isOwner && (isFreeForActions || (isBeingEdited && isSameUser));
  const isShoppingAllowed =
    !isDone && (isFreeForActions || (inProcess && isSameUser));
  const isSaveAllowed = isChanged && inProcess && isSameUser;
  const isDeleteAllowed = isOwner && isFreeForActions;

  return (
    <>
      <h2>{card.name}</h2>
      {isShareAllowed && <Share onClick={shareAction} />}
      {isEditAllowed && <ButtonSimple onClick={editAction}>📝</ButtonSimple>}
      {isShoppingAllowed && (
        <ButtonSimple onClick={shoppingAction}>{"🛒"}</ButtonSimple>
      )}
      {isSaveAllowed && (
        <ButtonSimple onClick={saveAction}>{"💾"}</ButtonSimple>
      )}
      {isDeleteAllowed && (
        <ButtonSimple onClick={() => setIsTooltipShown(!isTooltipShown)}>
          {"❌"}
        </ButtonSimple>
      )}
      {isDeleteAllowed && isTooltipShown && (
        <Confirmation
          extraClassname={"mt-1 me-11 py-2 px-3 rounded-md text-red-600"}
          text={t("deleteTheCard?")}
          yesText={t("yes")}
          noText={t("no")}
          yesFunc={async () => {
            await deleteAction();
            setIsTooltipShown(false);
          }}
          noFunc={() => setIsTooltipShown(false)}
        />
      )}
    </>
  );
};

export default CardHeadContent;
