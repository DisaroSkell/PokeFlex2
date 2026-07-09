import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import "./home.css";

const i18nNamespaces = ["home", "common"];

export default function Home() {
    const { t, i18n } = useTranslation(i18nNamespaces);
    const locale = i18n.language;

    return (
        <div className="mainContainer">
            <h1>PokéFlex&nbsp;2</h1>
            <div className="quizPresentation">
                <div className="pokeCard flexQuizPresentation">
                    <h2>{t("common:quiz")}</h2>
                    <p>{t("flex-explain")}</p>
                    <Link className="navLink" to={`/${locale}/quiz`}>{t("go-quiz")}</Link>
                </div>
                <div className="pokeCard chainQuizPresentation">
                    <h2>{t("common:quiz2")}</h2>
                    <p>{t("chain-explain")}</p>
                    <Link className="navLink" to={`/${locale}/quiz2`}>{t("go-quiz")}</Link>
                </div>
            </div>
        </div>
    );
}
