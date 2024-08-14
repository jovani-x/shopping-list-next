"use server";

import { cookies } from "next/headers";
import { defaultLocale } from "@/app/i18n";

export const changeLanguage = async (curLocale: string) => {
  cookies().set("NEXT_LOCALE", curLocale);
};

export const getCurrentLocale = async (): Promise<string> => {
  const lang = cookies().get("NEXT_LOCALE")?.value || defaultLocale;
  return lang;
};

export const getCurrentLangCookie = async (): Promise<string> => {
  const lang = cookies().get("NEXT_LOCALE")?.value || defaultLocale;
  return `NEXT_LOCALE=${lang}; Secure; HttpOnly; SameSite=None;`;
};
