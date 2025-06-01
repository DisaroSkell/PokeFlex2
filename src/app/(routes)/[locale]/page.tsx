import Link from "next/link";

import { i18nSupportedLanguages } from "@/i18nConfig";

import initTranslations from "@/src/i18n";

import TranslationsProvider from "@/src/app/_components/providers/translationsProvider";

import "./page.css";

const i18nNamespaces = ["home", "common"];

export async function generateStaticParams() {
    return i18nSupportedLanguages.map((i18nLang) => ({locale: i18nLang}));
}

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
                <div className="quizPresentation">
                    <div className="pokeCard flexQuizPresentation">
                        <h2>{t("common:quiz")}</h2>
                        <p>{t("flex-explain")}</p>
                        <Link className="navLink" href={`/${locale}/quiz`}>{t("go-quiz")}</Link>
                    </div>
                    <div className="pokeCard chainQuizPresentation">
                        <h2>{t("common:quiz2")}</h2>
                        <p>{t("chain-explain")}</p>
                        <Link className="navLink" href={`/${locale}/quiz2`}>{t("go-quiz")}</Link>
                    </div>
                </div>
            </div>
        </TranslationsProvider>
    );
}
