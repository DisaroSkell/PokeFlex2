import Image from 'next/image';

import initTranslations from '@/src/i18n';

import "./footer.css"

const i18nNamespaces = ["footer"];

interface FooterProps {
    locale: string
}

export default async function Footer({
    locale
}: FooterProps) {
    const { t } = await initTranslations(locale, i18nNamespaces);

    const xmlnsAttributes = {
        "xmlns:cc":"http://creativecommons.org/ns#",
        "xmlns:dct":"http://purl.org/dc/terms/",
    }

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
    </div>
}