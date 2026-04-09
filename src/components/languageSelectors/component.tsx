import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";

import { i18nConfig } from "@/i18n";

import { type Lang, supportedLanguages } from "@/types/lang.type";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchLangs, setSelectedLang } from "@/lib/store/lang/langSlice";
import { selectDisplayTutorialSetting } from "@/lib/store/userSettings/userSettingsSlice";

import { capitalize } from "@/utils/utils";

import CustomButton from "@/components/customButton/component";
import CustomSelect from "@/components/customSelect/component";

import "./languageSelectors.css";

export default function LanguageSelectors() {
    const allLangs = useAppSelector(state => state.lang.langs);
    const selectedLang = useAppSelector(state => state.lang.selectedLang);
    const firstVisit = useAppSelector(selectDisplayTutorialSetting);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { i18n, t } = useTranslation();
    const currentLocale = i18n.language;
    const { pathname: currentPathname } = useLocation();

    const [pokeLang, setPokeLang] = useState(selectedLang.id);
    const [i18nLang, setI18nLang] = useState(currentLocale);

    useEffect(() => {
        dispatch(fetchLangs());
    }, [dispatch]);

    useEffect(() => {
        if (!firstVisit) return;

        // Update pokeLang to locale
        const foundLang = allLangs.find(lang => lang.id === currentLocale);

        if (foundLang && foundLang.id !== selectedLang.id) {
            setPokeLang(foundLang.id);
            dispatch(setSelectedLang(foundLang));
        }
    }, [firstVisit]);

    function mapLanguagesToOptions(langs: Lang[]) {
        return langs.map(l => ({
            value: l.id,
            label: capitalize(l.fullName)
        }));
    }

    function onChangePokeLang(e: ChangeEvent<HTMLSelectElement>) {
        setPokeLang(e.target.value);
    }

    function onChangeI18nLang(e: ChangeEvent<HTMLSelectElement>) {
        setI18nLang(e.target.value);
    }

    function confirmChangesCallback() {
        // ------------ Update pokeLang ------------
        const foundLang = allLangs.find(lang => lang.id === pokeLang);

        if (foundLang && foundLang.id !== selectedLang.id) {
            dispatch(setSelectedLang(foundLang));
        }
        // -----------------------------------------

        if (i18nLang === currentLocale) return;
        
        // ------------ Update i18nLang ------------
        i18n.changeLanguage(i18nLang);

        let newPath = '';

        if (
            currentLocale === i18nConfig.defaultLocale
            && !i18nConfig.prefixDefault
        ) {
            // In this case, we need to add the locale prefix to the path because it isn't there yet
            newPath = `/${i18nLang}${currentPathname}`;
        } else {
            newPath = currentPathname.replace(`/${currentLocale}`, `/${i18nLang}`);
        }

        // Navigate to the new path, which will trigger the i18n language change in AppLayout
        navigate(newPath, { replace: true });
        // -----------------------------------------
    }

    function cancelChangesCallback() {
        setPokeLang(selectedLang.id);
        setI18nLang(currentLocale);
    }

    const unsavedChanges = useMemo(
        () => pokeLang !== selectedLang.id || i18nLang !== currentLocale,
        [pokeLang, selectedLang.id, i18nLang, currentLocale],
    );

    return <div className="languageCard">
        <h2>{t("common:select-lang")}</h2>
        <div className="cardContent">
            <div className="languageSelector">
                <h3>{t("common:text-lang")}</h3>
                <CustomSelect
                    value={i18nLang}
                    options={mapLanguagesToOptions(supportedLanguages)}
                    disabledValues={[]}
                    onChangeCallback={onChangeI18nLang}
                />
            </div>
            <div className="verticalSeparator" />
            <div className="languageSelector">
                <h3>{t("common:poke-lang")}</h3>
                <CustomSelect
                    value={pokeLang}
                    options={mapLanguagesToOptions(allLangs)}
                    disabledValues={[]}
                    onChangeCallback={onChangePokeLang}
                />
            </div>
        </div>
        <div className="langButtonsContainer">
            <CustomButton label={t("common:cancel")} type="primary" onClickCallback={cancelChangesCallback} disabled={!unsavedChanges} />
            <CustomButton label={t("common:confirm")} type="secondary" onClickCallback={confirmChangesCallback} disabled={!unsavedChanges} />
        </div>
    </div>;
}
