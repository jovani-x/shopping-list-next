import Link from "next/link";
import authFormStyles from "@/app/assets/styles/authForm.module.scss";
import initTranslations from "@/app/i18n";

export default async function NotFoundPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale);

  return (
    <div className="text-center self-stretch flex flex-col justify-center row-start-2 row-end-auto">
      <h1>
        <strong>404</strong> - {t("pageNotFound")}
      </h1>
      <p className={authFormStyles.linkHolder}>
        <Link href="/">{t("backToHome")}</Link>
      </p>
    </div>
  );
}
