import nextConfig from "@/next.config.mjs";
import { Config as I18nConfig } from "next-i18n-router/dist/types";

export const i18nSupportedLanguages = ['en', 'fr', 'ja-HRKT'];
export const i18nDefaultLanguage = i18nSupportedLanguages[0];

export const i18nConfig: I18nConfig = {
    locales: i18nSupportedLanguages,
    defaultLocale: i18nDefaultLanguage,
    basePath: nextConfig.basePath,
    prefixDefault: true,
};
