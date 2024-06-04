import initTranslations from "@/app/i18n";
import { getCard } from "@/app/helpers/actions";
import Card from "@/app/components/Card/Card";
import { notFound } from "next/navigation";

export default async function CardPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const { t } = await initTranslations(locale);
  const cardId = id;
  const card = await getCard(cardId);

  if (!card) {
    return notFound();
  }

  return (
    <>
      <h1>{`${t("card")}: ${card.name}`}</h1>
      <div className="baseContainer">
        <Card card={card} />
      </div>
    </>
  );
}
