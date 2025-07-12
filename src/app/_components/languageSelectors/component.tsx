'use client';

import nextConfig from "@/next.config.mjs";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { i18nConfig } from "@/i18nConfig";

import { Lang, supportedLanguages } from "@/src/types/lang.type";

import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { fetchLangs, setSelectedLang } from "@/src/lib/store/lang/langSlice";
import { selectDisplayTutorialSetting } from "@/src/lib/store/userSettings/userSettingsSlice";

import { capitalize } from "@/src/utils/utils";

import CustomButton from "../customButton/component";
import CustomSelect from "../customSelect/component";

import "./languageSelectors.css";

interface LanguageSelectorsProps {
}

export default function LanguageSelectors({
}: LanguageSelectorsProps) {
    const allLangs = useAppSelector(state => state.lang.langs)
    const selectedLang = useAppSelector(state => state.lang.selectedLang)
    const firstVisit = useAppSelector(selectDisplayTutorialSetting)
    const dispatch = useAppDispatch()

    const { i18n, t } = useTranslation();
    const currentLocale = i18n.language;
    const router = useRouter();
    const currentPathname = usePathname();

    const [pokeLang, setPokeLang] = useState(selectedLang.id);
    const [i18nLang, setI18nLang] = useState(currentLocale);

    useEffect(() => {
        dispatch(fetchLangs())
    }, [dispatch]);

    useEffect(() => {
        if (!firstVisit) return;

        // Update pokeLang to locale
        console.log("allLangs", allLangs);
        console.log("currentLocale", currentLocale);
        const foundLang = allLangs.find(lang => lang.id === currentLocale)

        if (foundLang && foundLang.id !== selectedLang.id) {
            setPokeLang(foundLang.id);
            dispatch(setSelectedLang(foundLang))
        }
    }, [firstVisit])

    function mapLanguagesToOptions(langs: Lang[]) {
        return langs.map(l => ({
            value: l.id,
            label: capitalize(l.fullName)
        }))
    }

    function onChangePokeLang(e: ChangeEvent<HTMLSelectElement>) {
        setPokeLang(e.target.value);
    }

    function onChangeI18nLang(e: ChangeEvent<HTMLSelectElement>) {
        setI18nLang(e.target.value);
    }

    function confirmChangesCallback() {
        // Update pokeLang
        const foundLang = allLangs.find(lang => lang.id === pokeLang)

        if (foundLang && foundLang.id !== selectedLang.id) {
            dispatch(setSelectedLang(foundLang))
        }

        //Update i18nLang
        if (i18nLang === currentLocale) return;

        const daysBeforeExpiration = 30;
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime()
                             + daysBeforeExpiration
                             * 24 * 60 * 60 * 1000);

        document.cookie = `NEXT_LOCALE=${i18nLang};expires=${expirationDate.toUTCString()};path=${nextConfig.basePath};SameSite=Strict`;

        let newPath = '';

        if (
            currentLocale === i18nConfig.defaultLocale
            && !i18nConfig.prefixDefault
        ) {
            newPath = `/${i18nLang}${currentPathname}`;
        } else {
            newPath = currentPathname.replace(`/${currentLocale}`, `/${i18nLang}`);
        }

        router.push(newPath);
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
        <div className="buttonsContainer">
            <CustomButton label={t("common:cancel")} type="primary" onClickCallback={cancelChangesCallback} disabled={!unsavedChanges} />
            <CustomButton label={t("common:confirm")} type="secondary" onClickCallback={confirmChangesCallback} disabled={!unsavedChanges} />
        </div>
    </div>
}
