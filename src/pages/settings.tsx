import { useTranslation } from "react-i18next";

import AutoGiveupSelector from "@/components/autoGiveupSelector/component";
import AutoValidateToggle from "@/components/autoValidateToggle/component";
import GenerationSelector from "@/components/generationSelector/component";
import LanguageSelectors from "@/components/languageSelectors/component";

import "./settings.css";

const i18nNamespaces = ["settings", "common"];

export default function Settings() {
    const { t } = useTranslation(i18nNamespaces);

    return <div className="settingsPage">
        <h1>{t('settings')}</h1>
        <div className="settingsContainer">
            <div className="pokeCard">
                <LanguageSelectors />
            </div>
            <div className="pokeCard generationSettings">
                <GenerationSelector />
            </div>
            <div className="pokeCard">
                <AutoGiveupSelector />
            </div>
            <div className="pokeCard" style={{display: "flex", justifyContent: "center"}}>
                <AutoValidateToggle />
            </div>
        </div>
    </div>;
}
