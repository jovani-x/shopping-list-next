"use client";

import headerStyles from "./header.module.scss";
import Button, { ButtonSimple } from "@/app/components/Button/Button";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { MenuContext } from "@/app/components/ProvideMenuContext/ProvideMenuContext";
import { useUserContext } from "@/app/components/ProvideUserContext/ProvideUserContext";

const Header = () => {
  const user = useUserContext();
  const str = user?.userName ? `, ${user?.userName}` : "";
  const { i18n, t } = useTranslation();
  const langStr = i18n.language;
  const { setIsMenuVisible } = useContext(MenuContext);

  return (
    <header className={headerStyles.navbar}>
      <strong className={headerStyles.title}>{`${t("welcome")}${str}`}</strong>
      <ButtonSimple
        onClick={() => setIsMenuVisible(true)}
        children={langStr}
        extraClassname={headerStyles.langButton}
      />
      <Button onClick={() => setIsMenuVisible(true)} children={t("menu")} />
    </header>
  );
};

export default Header;
