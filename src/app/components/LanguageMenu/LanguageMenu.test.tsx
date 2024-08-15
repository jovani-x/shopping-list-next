/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import LanguageMenu from "./LanguageMenu";
import menuStyles from "@/app/components/Menu/menu.module.scss";
import TranslationsProvider from "@/app/components/TranslationsProvider/TranslationsProvider";
import initTranslations, { defaultNamespace } from "@/app/i18n";
import { LANGUAGES } from "@/app/i18n";
import i18nConfig from "@/i18nConfig";

const mocks = vi.hoisted(() => ({
  handleRefresh: vi.fn(),
  handlePush: vi.fn(),
  pathStr: "/current-path",
  changeLanguage: vi.fn(),
}));

vi.mock("@/app/helpers/language", () => ({
  changeLanguage: mocks.changeLanguage,
}));

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: mocks.handlePush,
      refresh: mocks.handleRefresh,
      prefetch: vi.fn(),
    };
  },
  usePathname() {
    return mocks.pathStr;
  },
}));

describe.each(LANGUAGES)("LanguageMenu (locale %s)", ({ code, label }) => {
  it("Rendered", async () => {
    const locale = code;
    const i18nNamespaces = [defaultNamespace];
    const { resources } = await initTranslations(locale, i18nNamespaces);

    const { getByText } = render(
      <TranslationsProvider
        namespaces={i18nNamespaces}
        locale={locale}
        resources={resources}
      >
        <LanguageMenu />
      </TranslationsProvider>
    );

    LANGUAGES.forEach(({ code }) => {
      const el = getByText(code);
      expect(el).toBeInTheDocument();
      if (code === locale) {
        expect(el).toHaveClass(menuStyles.active);
      }
    });
  });

  it("Change language", async () => {
    const user = userEvent.setup();
    const locale = code;
    const i18nNamespaces = [defaultNamespace];
    const { resources } = await initTranslations(locale, i18nNamespaces);

    const { getByText } = render(
      <TranslationsProvider
        namespaces={i18nNamespaces}
        locale={locale}
        resources={resources}
      >
        <LanguageMenu />
      </TranslationsProvider>
    );

    for (const lng of LANGUAGES) {
      const { code } = lng;

      if (code !== locale) {
        const el = getByText(code);
        await user.click(el);
        const expectedPath =
          code !== i18nConfig.defaultLocale
            ? `/${code}${mocks.pathStr}`
            : mocks.pathStr;
        expect(mocks.handlePush).toBeCalledWith(expectedPath);
        expect(mocks.handleRefresh).toBeCalled();
      }
    }
  });
});
