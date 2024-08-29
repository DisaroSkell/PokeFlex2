import initTranslations from "@/src/i18n";

import { i18nSupportedLanguages } from "@/i18nConfig";

import Quiz2Content from "@/src/app/_components/quiz2Content/component";
import TranslationsProvider from "@/src/app/_components/providers/translationsProvider";

const i18nNamespaces = ["quiz", "common"];

export async function generateStaticParams() {
    return i18nSupportedLanguages.map((i18nLang) => ({locale: i18nLang}));
}

interface Quiz2PageProps {
    params: { locale: string }
}

export default async function Quiz2({
    params: { locale }
}: Quiz2PageProps) {
    const { resources } = await initTranslations(locale, i18nNamespaces);

    return <TranslationsProvider locale={locale} namespaces={i18nNamespaces} resources={resources}>
        <Quiz2Content />
    </TranslationsProvider>
}
