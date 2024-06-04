import initTranslations from "@/app/i18n";
import ForgetPasswordForm from "@/app/components/ForgetPasswordForm/ForgetPasswordForm";

export default async function ForgetPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale);

  return (
    <div className="baseContainer mt-auto mb-auto">
      <h1>{t("forgetPassword")}</h1>
      <ForgetPasswordForm />
    </div>
  );
}
