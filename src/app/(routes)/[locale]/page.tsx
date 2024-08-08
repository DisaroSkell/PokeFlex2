import Link from "next/link";

import initTranslations from "@/src/i18n";

import LanguageSelectors from "@/src/app/_components/languageSelectors/component";
import TranslationsProvider from "@/src/app/_components/providers/translationsProvider";

import "./page.css";

const i18nNamespaces = ["home", "common"];

interface HomePageProps {
    params: { locale: string }
}

export default async function Home({
    params: { locale }
}: HomePageProps) {
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    return (
        <TranslationsProvider locale={locale} namespaces={i18nNamespaces} resources={resources}>
            <div className="mainContainer">
                <h1>{t("welcome")}</h1>
                <Link className="navLink" href="/quiz">{t("go-quiz")}</Link>
            </div>
        </TranslationsProvider>
    );
}
