import nextConfig from "@/next.config.mjs";
import Link from "next/link";
import Image from 'next/image';

import initTranslations from "@/src/i18n";

import BurgerMenu from "@/src/app/_components/burgerMenu/component";

import "./header.css"

const i18nNamespaces = ["common"];

interface HeaderProps {
    locale: string
}

export default async function Header({
    locale,
}: HeaderProps) {
    const { t } = await initTranslations(locale, i18nNamespaces);

    const pagesButtons = [
        <Link key="quiz" className="navLink" href={`/${locale}/quiz`}>{t("quiz")}</Link>,
        <Link key="quiz2" className="navLink" href={`/${locale}/quiz2`}>{t("quiz2")}</Link>,
        <Link key="settings" className="navLink" href={`/${locale}/settings`}>{t("settings")}</Link>,
    ];

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
            {pagesButtons}
        </div>

        <BurgerMenu menuContent={
            <div className="pagesVertical">
                {pagesButtons}
            </div>
        }/>
    </div>
}
