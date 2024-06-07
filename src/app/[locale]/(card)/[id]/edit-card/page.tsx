"use server";

import initTranslations from "@/app/i18n";
import CardForm from "@/app/components/CardForm/CardForm";
import ButtonBack from "@/app/components/ButtonBack/ButtonBack";
import { ButtonComponentsType } from "@/app/components/Button/Button";
import { getCard, updateCard } from "@/app/helpers/actions";
import { UserRole } from "@/app/helpers/types";
import YCenteredBlock from "@/app/components/YCenteredBlock/YCenteredBlock";
import Link from "next/link";
import authFormStyles from "@/app/assets/styles/authForm.module.scss";

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

  if (card.userRole !== UserRole.owner) {
    return (
      <YCenteredBlock>
        <h1>{t("unauthorizedRequest")}</h1>
        {renderedBtn}
      </YCenteredBlock>
    );
  }

  const renderedBtnBack = (
    <ButtonBack
      btnComponentName={ButtonComponentsType.SIMPLE}
      children={`< ${t("back")}`}
    />
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
