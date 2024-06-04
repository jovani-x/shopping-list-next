import initTranslations from "@/app/i18n";
import LoginForm from "@/app/components/LoginForm/LoginForm";

export default async function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale);

  return (
    <div className="baseContainer mt-auto mb-auto">
      <h1>{t("login")}</h1>
      <LoginForm />
    </div>
  );
}
