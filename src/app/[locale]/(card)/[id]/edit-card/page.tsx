import initTranslations from "@/app/i18n";
import CardForm from "@/app/components/CardForm/CardForm";
import { getCard, updateCard } from "@/app/actions/client/cards";
import { UserRole, CardEditingStatus } from "@/app/helpers/types";
import YCenteredBlock from "@/app/components/YCenteredBlock/YCenteredBlock";
import Link from "next/link";
import authFormStyles from "@/app/assets/styles/authForm.module.scss";
import { getCurrentUser, getAuthToken } from "@/app/helpers/auth";
import EditingStatus from "@/app/components/EditingStatus/EditingStatus";
import CardStatusSetter from "@/app/components/CardStatusSetter/CardStatusSetter";

export default async function EditCardPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const { t } = await initTranslations(locale);
  const cardId = id;
  const card = await getCard(cardId);

  const renderedBtn = (
    <p className={authFormStyles.linkHolder}>
      <Link href="/">{t("backToHome")}</Link>
    </p>
  );

  if (!card) {
    return (
      <YCenteredBlock>
        <h1>{t("cardWithIdDoesnotExist", { id: cardId })}</h1>
        {renderedBtn}
      </YCenteredBlock>
    );
  }

  const isOwner = card.userRole === UserRole.owner;

  if (!isOwner) {
    return (
      <YCenteredBlock>
        <h1>{t("unauthorizedRequest")}</h1>
        {renderedBtn}
      </YCenteredBlock>
    );
  }

  const user = await getCurrentUser(await getAuthToken());
  const userName = user?.userName ?? "";
  const isSameUser =
    !!card.status.userName && card.status.userName === userName;
  const inProcess = card.status?.value === CardEditingStatus.IN_PROCESS;
  const isBeingEdited = card.status.value === CardEditingStatus.EDITING;

  if (inProcess || (isBeingEdited && !isSameUser)) {
    return (
      <YCenteredBlock>
        <EditingStatus status={card.status} />
        {renderedBtn}
      </YCenteredBlock>
    );
  }

  const renderedBtnBack = (
    <CardStatusSetter
      card={card}
      status={{
        value: CardEditingStatus.FREE,
        userName: "",
      }}
    >{`< ${t("back")}`}</CardStatusSetter>
  );

  return (
    <>
      <div className="baseContainer">
        {renderedBtnBack}
        <CardForm mutationFunc={updateCard} card={card} />
      </div>
      <div className="baseContainer mt-auto">{renderedBtnBack}</div>
    </>
  );
}
