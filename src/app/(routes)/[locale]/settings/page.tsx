import initTranslations from "@/src/i18n";

import TranslationsProvider from "@/src/app/_components/providers/translationsProvider";
import LanguageSelectors from "@/src/app/_components/languageSelectors/component";

import "./settings.css";
import GenerationSelector from "@/src/app/_components/generationSelector/component";

const i18nNamespaces = ["settings", "common"];

interface QuizPageProps {
    params: { locale: string }
}

export default async function Quiz({
    params: { locale }
}: QuizPageProps) {
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

    return <TranslationsProvider locale={locale} namespaces={i18nNamespaces} resources={resources}>
        <div className="settingsPage">
            <div className="pokeCard settingsContainer">
                <h1>{t('settings')}</h1>
                <div className="settingsGrid">
                    <div className="pokeCard">
                        <LanguageSelectors />
                    </div>
                    <div className="pokeCard">
                        <GenerationSelector />
                    </div>
                </div>
            </div>
        </div>
    </TranslationsProvider>
}
