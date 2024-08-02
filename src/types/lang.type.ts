import { i18nDefaultLanguage, i18nSupportedLanguages } from "@/i18nConfig"

export interface Lang {
    id: string
    fullName: string
}

export const supportedLanguages: Lang[] = i18nSupportedLanguages.map(lang => {
    const tryFullName = new Intl.DisplayNames([lang], { type: 'language' }).of(lang)

    if (tryFullName) return {
        id: lang,
        fullName: tryFullName
    }
}).filter(lang => !!lang);

export const defaultLanguage: Lang = {
    id: i18nDefaultLanguage,
    fullName: new Intl.DisplayNames(
        [i18nDefaultLanguage],
        { type: 'language' }
    ).of(i18nDefaultLanguage) ?? 'Default language'
};
