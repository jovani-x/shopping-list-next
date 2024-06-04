"use client";

import menuStyles from "@/app/components/Menu/menu.module.scss";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LANGUAGES } from "@/app/i18n";
import { useTranslation } from "react-i18next";
import i18nConfig from "@/i18nConfig";
import { changeLanguage } from "@/app/helpers/actions";

const LanguageMenu = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const changeLang = async (code: string) => {
    const newLocale = code;
    await changeLanguage(newLocale);
    if (
      currentLocale === i18nConfig.defaultLocale /* &&
      !i18nConfig.prefixDefault*/
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  const langMenuItems = LANGUAGES.map(({ code, label }) => {
    return (
      <li key={code}>
        <Link
          href={`/${code}`}
          title={label}
          className={code === i18n.language ? menuStyles.active : ""}
          onClick={(e) => {
            e.preventDefault();
            changeLang(code);
          }}
        >
          {code}
        </Link>
      </li>
    );
  });

  return <ul className={menuStyles.lang}>{langMenuItems}</ul>;
};

export default LanguageMenu;
