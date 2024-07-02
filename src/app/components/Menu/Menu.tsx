"use client";

import Button from "@/app/components/Button/Button";
import menuStyles from "./menu.module.scss";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MenuContext } from "@/app/components/ProvideMenuContext/ProvideMenuContext";
import { useUserContext } from "@/app/components/ProvideUserContext/ProvideUserContext";
import FadeInOut from "@/app/components/FadeInOut/FadeInOut";
import LanguageMenu from "@/app/components/LanguageMenu/LanguageMenu";
import { logout } from "@/app/helpers/actions";
import { getErrorMessage } from "@/lib/utils";

const Menu = () => {
  const { isMenuVisible, setIsMenuVisible } = useContext(MenuContext);
  const user = useUserContext();
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMenuVisible(false);
  }, [pathname, setIsMenuVisible]);

  const logoutHandle = async () => {
    try {
      const res = await logout();
    } catch (err) {
      console.log(getErrorMessage(err));
    } finally {
      setIsMenuVisible && setIsMenuVisible(false);
      router.push("/login");
    }
  };

  const unloggedMenu = (
    <>
      <li>
        <Link href="/login">{t("login")}</Link>
      </li>
      <li>
        <Link href="/register">{t("createAccount")}</Link>
      </li>
      <li>
        <Link href="/forget-password">{t("forgetPassword")}</Link>
      </li>
    </>
  );

  const loggedMenu = (
    <>
      <li>
        <Link href="/">{t("home")}</Link>
      </li>
      <li>
        <Link href="/create-card">{t("createCard")}</Link>
      </li>
      <li>
        <Link href="/friends">{t("yourFriends")}</Link>
      </li>
      <li>
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            logoutHandle();
          }}
        >
          {t("logout")}
        </Link>
      </li>
    </>
  );

  const renderedMenu = (
    <FadeInOut
      isShown={isMenuVisible}
      duration={500}
      classNames="fixed inset-0 z-50"
    >
      <nav className={menuStyles.menu}>
        <ul>
          {!user?.userName && unloggedMenu}
          {!!user?.userName && loggedMenu}
          <li>
            <LanguageMenu />
          </li>
        </ul>
        <Button onClick={() => setIsMenuVisible && setIsMenuVisible(false)}>
          {t("closeMenu")}
        </Button>
      </nav>
    </FadeInOut>
  );

  return <>{renderedMenu}</>;
};

export default Menu;
