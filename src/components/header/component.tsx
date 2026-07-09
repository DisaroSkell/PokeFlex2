import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import logo from "/Logo.png";

import BurgerMenu from "@/components/burgerMenu/component";

import { BurgerMenuType } from "@/types/burgerMenuTypes";

import "./header.css";

const i18nNamespaces = ["common"];

export default function Header() {
    const { t, i18n } = useTranslation(i18nNamespaces);
    const locale = i18n.language;

    const pagesButtons = [
        <Link key="quiz" className="navLink" to={`/${locale}/quiz`}>{t("quiz")}</Link>,
        <Link key="quiz2" className="navLink" to={`/${locale}/quiz2`}>{t("quiz2")}</Link>,
        <Link key="settings" className="navLink" to={`/${locale}/settings`}>{t("settings")}</Link>,
    ];

    return <div className="pokeHeader">
        <div className="container">
            <Link to={`/${locale}/`}>
                <img
                    className="logoImg"
                    src={logo}
                    alt={'App logo'}
                />
            </Link>
        </div>

        <div className="pages">
            {pagesButtons}
        </div>

        <BurgerMenu menuType={BurgerMenuType.Navigation} />
    </div>;
}
