'use client'

import Link from "next/link";
import { ChangeEvent, useState } from "react";

import { Lang } from "@/src/types/lang.type";

import { fetchLangs, setSelectedLang } from "@/src/lib/lang/langSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";

import { capitalize } from "@/src/utils/utils";

import CustomSelect from "../_components/customSelect/component";
import CustomButton from "../_components/customButton/component";

import "./page.css";

export default function Home() {
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

    function onChangeLang(e: ChangeEvent<HTMLSelectElement>) {
        const foundLang = allLangs.find(lang => lang.id === e.target.value)

        if (foundLang) {
            dispatch(setSelectedLang(foundLang))
        }
    }

    function loadMoreLangs() {
        setButtonDisabled(true)
        dispatch(fetchLangs())
    }
    
    return (
        <div className="mainContainer">
            <h1>Welcome to your dream land</h1>
            <div className="pokeCard languageCard">
                <h2>Select your language</h2>
                <CustomSelect
                    value={selectedLang.id}
                    options={mapLanguagesToOptions(allLangs)}
                    disabledValues={[]}
                    onChangeCallback={onChangeLang}
                />
                <CustomButton
                    label={"Load more languages"}
                    type={"primary"}
                    onClickCallback={loadMoreLangs}
                    disabled={isButtonDisabled}
                />
            </div>
            <Link className="navLink" href="/quiz">Go to Quiz</Link>
        </div>
    );
}
