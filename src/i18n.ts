import { createInstance, type i18n, type Namespace, type Resource } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

export const i18nSupportedLanguages = ['en', 'fr'/* , 'ja-HRKT' */];
export const i18nDefaultLanguage = i18nSupportedLanguages[0];

export const i18nConfig = {
    locales: i18nSupportedLanguages,
    defaultLocale: i18nDefaultLanguage,
    prefixDefault: true,
};

export default function initTranslations(
    locale: string,
    namespaces: Namespace,
    i18nInstance?: i18n,
    resources?: Resource
) {
    i18nInstance = i18nInstance || createInstance();
    
    i18nInstance.use(initReactI18next);
    
    if (!resources) {
        i18nInstance.use(
            resourcesToBackend(
                (language: string, namespace: string) =>
                    import(`../locales/${language}/${namespace}.json`)
            )
        );
    }
    
    i18nInstance.init({
        lng: locale,
        resources,
        fallbackLng: i18nConfig.defaultLocale,
        supportedLngs: i18nConfig.locales,
        defaultNS: namespaces[0],
        fallbackNS: namespaces[0],
        ns: namespaces,
        preload: resources ? [] : i18nConfig.locales,
        react: { useSuspense: true },
    });
    
    return {
        i18n: i18nInstance,
        resources: i18nInstance.services.resourceStore.data,
        t: i18nInstance.t
    };
}
