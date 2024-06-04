import initTranslations from "@/app/i18n";
import CardForm from "@/app/components/CardForm/CardForm";
import { ButtonComponentsType } from "@/app/components/Button/Button";
import ButtonBack from "@/app/components/ButtonBack/ButtonBack";
import { createCard } from "@/app/helpers/actions";

export default async function CreateCardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale);

  return (
    <>
      <div className="baseContainer">
        <ButtonBack
          btnComponentName={ButtonComponentsType.SIMPLE}
          children={`< ${t("back")}`}
        />
        <CardForm mutationFunc={createCard} />
      </div>
    </>
  );
}
