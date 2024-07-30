import nextConfig from "@/next.config.mjs";

export const i18nConfig = {
    locales: ['en', 'fr', 'ja'],
    defaultLocale: 'en',
    basePath: nextConfig.basePath,
};
