import { createInstance, type Namespace, type Resource } from "i18next";
import { useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import initTranslations from "@/i18n";

interface TranslationsProviderProps {
    children: React.ReactNode
    locale: string
    namespaces: Namespace
    resources?: Resource
}

export default function TranslationsProvider({
    children,
    locale,
    namespaces,
    resources,
}: TranslationsProviderProps) {
    const i18n = useMemo(() => createInstance(), []);

    const initializedI18n = useMemo(() => {
        initTranslations(locale, namespaces, i18n, resources);
        return i18n;
    }, [locale, namespaces, resources, i18n]);

    return <I18nextProvider i18n={initializedI18n}>{children}</I18nextProvider>;
}
