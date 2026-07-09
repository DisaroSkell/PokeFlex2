import { useTranslation } from "react-i18next";

import "./footer.css";

const i18nNamespaces = ["footer"];

export default function Footer() {
    const { t } = useTranslation(i18nNamespaces);

    const xmlnsAttributes = {
        "xmlns:cc":"http://creativecommons.org/ns#",
        "xmlns:dct":"http://purl.org/dc/terms/",
    };

    return <div className="footerContainer">
        <p
            {...xmlnsAttributes}
        >{t("pokeflex-by")}<a
            rel="cc:attributionURL dct:creator"
            property="cc:attributionName"
            href="https://github.com/DisaroSkell"
        >DisaroSkell</a>{t("licensed-under")}<a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
            target="_blank"
            rel="license noopener noreferrer"
            style={{ display: "inline-block" }}
        >CC BY-NC-SA 4.0</a></p>
    </div>;
}
