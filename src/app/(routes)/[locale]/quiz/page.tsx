import initTranslations from "@/src/i18n";

import QuizContent from "@/src/app/_components/quizContent/component";
import TranslationsProvider from "@/src/app/_components/providers/translationsProvider";

const i18nNamespaces = ["quiz", "common"];

interface QuizPageProps {
    params: { locale: string }
}

export default async function Quiz({
    params: { locale }
}: QuizPageProps) {
    const { resources } = await initTranslations(locale, i18nNamespaces);

    return <TranslationsProvider locale={locale} namespaces={i18nNamespaces} resources={resources}>
        <QuizContent />
    </TranslationsProvider>
}
