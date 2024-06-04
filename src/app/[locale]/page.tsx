import { getAllCards } from "@/app/helpers/actions";
import Cards from "@/app/components/Cards/Cards";
import initTranslations from "@/app/i18n";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale);
  const cards = await getAllCards();

  return (
    <>
      <h1>{t("home")}</h1>
      <div className={`baseContainer`}>
        <Cards cards={cards} />
      </div>
    </>
  );
}
