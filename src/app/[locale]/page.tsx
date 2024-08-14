import { getAllCards } from "@/app/actions/client/cards";
import Cards from "@/app/components/Cards/Cards";
import Button from "@/app/components/Button/Button";
import initTranslations from "@/app/i18n";
import authStyles from "@/app/assets/styles/authForm.module.scss";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale);
  const cards = await getAllCards();

  return (
    <>
      <div className={`baseContainer`}>
        <h1>{t("home")}</h1>
        <Cards cardsProps={cards} />
        <div className={authStyles.btnHolder}>
          <Button href="/create-card">{t("createCard")}</Button>
        </div>
      </div>
    </>
  );
}
