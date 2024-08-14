import Link from "next/link";
import authFormStyles from "@/app/assets/styles/authForm.module.scss";
import initTranslations from "@/app/i18n";
import { getCurrentLocale } from "@/app/helpers/language";
import YCenteredBlock from "@/app/components/YCenteredBlock/YCenteredBlock";

export default async function NotFoundPage() {
  const locale = await getCurrentLocale();
  const { t } = await initTranslations(locale);

  return (
    <YCenteredBlock>
      <h1>
        <strong>404</strong> - {t("pageNotFound")}
      </h1>
      <p className={authFormStyles.linkHolder}>
        <Link href="/">{t("backToHome")}</Link>
      </p>
    </YCenteredBlock>
  );
}
