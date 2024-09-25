import type { Metadata } from "next";
import { inter } from "@/app/assets/fonts/fonts";
import "@/app/assets/styles/globals.scss";
import initTranslations, { defaultNamespace } from "@/app/i18n";
import ProvideMenuContext from "@/app/components/ProvideMenuContext/ProvideMenuContext";
import TranslationsProvider from "@/app/components/TranslationsProvider/TranslationsProvider";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import Menu from "@/app/components/Menu/Menu";
import ProvideCardsFilterContext from "@/app/components/ProvideCardsFilterContext/ProvideCardsFilterContext";
import ProvideUserContext from "@/app/components/ProvideUserContext/ProvideUserContext";
import { getCurrentUser, getAuthToken } from "@/app/helpers/auth";
import { Suspense } from "react";
import Loading from "./loading";
import { ErrorBoundary } from "react-error-boundary";
import YCenteredBlock from "@/app/components/YCenteredBlock/YCenteredBlock";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shopping List App",
  description: "A shopping list as is",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const i18nNamespaces = [defaultNamespace];
  const { resources, t } = await initTranslations(locale, i18nNamespaces);
  const user = await getCurrentUser(await getAuthToken());

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          <ProvideUserContext value={{ userName: user?.userName || "" }}>
            <ProvideMenuContext opts={{ isMenuVisible: false }}>
              <Header />
              <Menu />
            </ProvideMenuContext>
            <main className="contentLayout">
              <ProvideCardsFilterContext
                value={{ filterState: { unfinished: true, done: true } }}
              >
                <ErrorBoundary
                  fallback={
                    <YCenteredBlock>
                      <h1 className="text-center">
                        {t("sorrySomethingWentWrongTryAgain")}
                      </h1>
                    </YCenteredBlock>
                  }
                >
                  <Suspense fallback={<Loading />}>{children}</Suspense>
                </ErrorBoundary>
              </ProvideCardsFilterContext>
            </main>
            <Footer />
          </ProvideUserContext>
        </TranslationsProvider>
      </body>
    </html>
  );
}
