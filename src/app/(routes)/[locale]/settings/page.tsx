import initTranslations from "@/src/i18n";

import { i18nSupportedLanguages } from "@/i18nConfig";

import TranslationsProvider from "@/src/app/_components/providers/translationsProvider";
import LanguageSelectors from "@/src/app/_components/languageSelectors/component";
import GenerationSelector from "@/src/app/_components/generationSelector/component";
import AutoValidateToggle from "@/src/app/_components/autoValidateToggle/component";

import "./settings.css";

const i18nNamespaces = ["settings", "common"];

export async function generateStaticParams() {
    return i18nSupportedLanguages.map((i18nLang) => ({locale: i18nLang}));
}

interface QuizPageProps {
    params: { locale: string }
}

export default async function Quiz({
    params: { locale }
}: QuizPageProps) {
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    return <TranslationsProvider locale={locale} namespaces={i18nNamespaces} resources={resources}>
        <div className="settingsPage">
            <h1>{t('settings')}</h1>
            <div className="settingsContainer">
                <div className="pokeCard">
                    <LanguageSelectors />
                </div>
                <div className="pokeCard generationSettings">
                    <GenerationSelector />
                </div>
                <div className="pokeCard" style={{display: "flex", justifyContent: "center"}}>
                    <AutoValidateToggle />
                </div>
            </div>
        </div>
    </TranslationsProvider>
}
