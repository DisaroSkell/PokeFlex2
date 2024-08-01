'use client';

import { ChangeEvent, useState } from "react";

import { Lang } from "@/src/types/lang.type";
import { useTranslation } from "react-i18next";

import { fetchLangs, setSelectedLang } from "@/src/lib/lang/langSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";

import { capitalize } from "@/src/utils/utils";

import CustomSelect from "../../_components/customSelect/component";
import CustomButton from "../../_components/customButton/component";

import "./languageSelectors.css";

interface LanguageSelectorsProps {
}

export default function LanguageSelectors({
}: LanguageSelectorsProps) {
    const { t } = useTranslation();

    const allLangs = useAppSelector(state => state.lang.langs)
    const selectedLang = useAppSelector(state => state.lang.selectedLang)
    const dispatch = useAppDispatch()

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
        // TODO
    }

    function loadMoreLangs() {
        setButtonDisabled(true)
        dispatch(fetchLangs())
    }

    return <div className="pokeCard languageCard">
        <h2>{t("common:select-lang")}</h2>
        <div className="cardContent">
            <div className="languageSelector">
                <h3>{t("common:text-lang")}</h3>
                <CustomSelect
                    value={"en"}
                    options={[{label: "English", value: "en"}]}
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
