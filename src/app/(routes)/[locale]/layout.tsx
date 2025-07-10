import initTranslations from "@/src/i18n";

import Footer from "../../_components/footer/component";
import Header from "../../_components/header/component";
import { HTMLLangHandler } from "../../_components/htmlLangHandler/component";
import StoreProvider from "../../_components/providers/storeProvider";
import TranslationsProvider from "../../_components/providers/translationsProvider";
import TutorialModal from "../../_components/tutorialModal/component";

import "../globals.css";

const i18nNamespaces = ["common"];

export default async function DefaultLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const { resources } = await initTranslations(params.locale, i18nNamespaces);

  return (
    <>
      <StoreProvider>
        <TranslationsProvider locale={params.locale} namespaces={i18nNamespaces} resources={resources}>
          <HTMLLangHandler locale={params.locale} />
          <div className="header">
            <Header locale={params.locale} />
          </div>
          <TutorialModal />
          <div className="mainContent">
              {children}
          </div>
          <div className="footer">
            <Footer locale={params.locale} />
          </div>
        </TranslationsProvider>
      </StoreProvider>
    </>
  );
}
