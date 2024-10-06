import nextConfig from "@/next.config.mjs";
import Link from "next/link";
import Image from 'next/image';

import initTranslations from "@/src/i18n";

import "./header.css"

const i18nNamespaces = ["header"];

interface HeaderProps {
    locale: string
}

export default async function Header({
    locale,
}: HeaderProps) {
    const { t } = await initTranslations(locale, i18nNamespaces);

    return <div className="pokeHeader">
        <div className="container">
            <Link href={`/${locale}/`}>
                <Image
                    className="logoImg"
                    src={`${nextConfig.basePath}/Logo.png`}
                    alt={'App logo'}
                    priority={true}
                    width={1} height={1}
                />
            </Link>
        </div>
        <div className="pages">
            <Link className="pageButton" href={`/${locale}/quiz`}>{t("quiz")}</Link>
            <Link className="pageButton" href={`/${locale}/quiz2`}>{t("quiz")}2</Link>
            <Link className="pageButton" href={`/${locale}/settings`}>{t("settings")}</Link>
        </div>
    </div>
}
