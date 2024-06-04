"use server";

import initTranslations from "@/app/i18n";
import CardForm from "@/app/components/CardForm/CardForm";
import ButtonBack from "@/app/components/ButtonBack/ButtonBack";
import { ButtonComponentsType } from "@/app/components/Button/Button";
import { getCard, updateCard } from "@/app/helpers/actions";

export default async function EditCardPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const { t } = await initTranslations(locale);
  const cardId = id;
  const card = await getCard(cardId);
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
