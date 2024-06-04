import RegisterForm from "@/app/components/RegisterForm/RegisterForm";
import ButtonBack from "@/app/components/ButtonBack/ButtonBack";
import { ButtonComponentsType } from "@/app/components/Button/Button";
import initTranslations from "@/app/i18n";

export default async function RegisterPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale);

  return (
    <div className="baseContainer mt-auto mb-auto">
      <ButtonBack
        btnComponentName={ButtonComponentsType.SIMPLE}
        children={`< ${t("back")}`}
      />
      <h1>{t("createAccount")}</h1>
      <RegisterForm />
    </div>
  );
}
