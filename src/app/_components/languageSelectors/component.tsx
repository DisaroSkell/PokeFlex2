'use client';

import { ChangeEvent, useState } from "react";
import nextConfig from "@/next.config.mjs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { i18nConfig } from "@/i18nConfig";

import { Lang, supportedLanguages } from "@/src/types/lang.type";

import { fetchLangs, setSelectedLang } from "@/src/lib/store/lang/langSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";

import { capitalize } from "@/src/utils/utils";

import CustomSelect from "../../_components/customSelect/component";
import CustomButton from "../../_components/customButton/component";

import "./languageSelectors.css";

interface LanguageSelectorsProps {
}

export default function LanguageSelectors({
}: LanguageSelectorsProps) {
    const allLangs = useAppSelector(state => state.lang.langs)
    const selectedLang = useAppSelector(state => state.lang.selectedLang)
    const dispatch = useAppDispatch()

    const { i18n, t } = useTranslation();
    const currentLocale = i18n.language;
    const router = useRouter();
    const currentPathname = usePathname();

    const [isButtonDisabled, setButtonDisabled] = useState(false)

    function mapLanguagesToOptions(langs: Lang[]) {
        return langs.map(l => ({
            value: l.id,
            label: capitalize(l.fullName)
        }))
    }

    function onChangePokeLang(e: ChangeEvent<HTMLSelectElement>) {
        const foundLang = allLangs.find(lang => lang.id === e.target.value)

        if (foundLang) {
            dispatch(setSelectedLang(foundLang))
        }
    }

    function onChangeI18nLang(e: ChangeEvent<HTMLSelectElement>) {
        const newLocale = e.target.value;

        if (newLocale === currentLocale) return;

        const daysBeforeExpiration = 30;
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime()
                             + daysBeforeExpiration
                             * 24 * 60 * 60 * 1000);

        document.cookie = `NEXT_LOCALE=${newLocale};expires=${expirationDate.toUTCString()};path=${nextConfig.basePath};SameSite=Strict`;

        let newPath = '';

        if (
            currentLocale === i18nConfig.defaultLocale
            && !i18nConfig.prefixDefault
        ) {
            newPath = `/${newLocale}${currentPathname}`;
        } else {
            newPath = currentPathname.replace(`/${currentLocale}`, `/${newLocale}`);
        }

        router.push(newPath);
    }

    function loadMoreLangs() {
        setButtonDisabled(true)
        dispatch(fetchLangs())
    }

    return <div className="languageCard">
        <h2>{t("common:select-lang")}</h2>
        <div className="cardContent">
            <div className="languageSelector">
                <h3>{t("common:text-lang")}</h3>
                <CustomSelect
                    value={currentLocale}
                    options={mapLanguagesToOptions(supportedLanguages)}
                    disabledValues={[]}
                    onChangeCallback={onChangeI18nLang}
                />
            </div>
            <div className="verticalSeparator" />
            <div className="languageSelector">
                <h3>{t("common:poke-lang")}</h3>
                <CustomSelect
                    value={selectedLang.id}
                    options={mapLanguagesToOptions(allLangs)}
                    disabledValues={[]}
                    onChangeCallback={onChangePokeLang}
                />
                <CustomButton
                    label={t("common:load-langs")}
                    type={"primary"}
                    onClickCallback={loadMoreLangs}
                    disabled={isButtonDisabled}
                />
            </div>
        </div>
    </div>
}
