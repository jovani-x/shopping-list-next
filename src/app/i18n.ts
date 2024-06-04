import { createInstance, i18n, Resource, t } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import i18nConfig from "@/i18nConfig";

export const defaultNamespace = "common";

export const defaultLocale = i18nConfig.defaultLocale;

export default async function initTranslations(
  locale: string,
  namespaces?: string[],
  i18nInstance?: i18n,
  resources?: Resource
) {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend((language: string, namespace: string) => {
        if (!namespace || namespace === defaultNamespace) {
          return import(`@/locales/${language}.json`);
        } else {
          return import(`@/locales/${language}/${namespace}.json`);
        }
      })
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: defaultNamespace,
    fallbackNS: defaultNamespace,
    ns: namespaces || [defaultNamespace],
    preload: resources ? [] : i18nConfig.locales,
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}

export const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Polski", code: "pl" },
];
