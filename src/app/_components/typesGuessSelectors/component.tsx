'use client';

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { PokeType } from "@/src/types/pokeType.type";
import { defaultLanguage } from "@/src/types/lang.type";

import CustomSelect from "../customSelect/component";

import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { fetchPokeTypes, selectPokeTypes } from "@/src/lib/store/pokeTypes/pokeTypesSlice";

import "./typesGuessSelectors.css";

interface TypesGuessSelectorsProps {
    typesValue: { type1: string, type2: string }
    onTypesChange: (newType1: PokeType, newType2: PokeType | null) => void
}

export default function TypesGuessSelectors({
    typesValue,
    onTypesChange
}: TypesGuessSelectorsProps) {
    const dispatch = useAppDispatch();
    const langs = useAppSelector(state => state.lang.langs);
    const pokeTypes = useAppSelector(selectPokeTypes);
    
    const { i18n } = useTranslation();

    useEffect(() => {
        let foundLang = langs.find(l => l.id.toLowerCase() === i18n.language.toLowerCase());

        if (!foundLang) foundLang = defaultLanguage;
            
        dispatch(fetchPokeTypes(foundLang));
    }, [dispatch, langs, i18n]);

    function getPokeTypesAsOptions(pokeTypes: PokeType[]) {
        return [{value: '', label: ' '}, ...pokeTypes.map(type => {return {
            value: type.id,
            label: type.fullName
        }}).sort((a, b) => {
            if (a.label.match(/[^\p{L}]/gu) && !b.label.match(/[^\p{L}]/gu)) {
                return 1;
            }
            
            if (b.label.match(/[^\p{L}]/gu) && !a.label.match(/[^\p{L}]/gu)) {
                return -1;
            }

            return a.label.localeCompare(b.label);
        })];
    }

    function changeTypes(type1Value: string, type2Value: string) {
        const type1 = pokeTypes.find(type => type.id === type1Value);

        if (type1) {
            const foundType2 = pokeTypes.find(type => type.id === type2Value);
            const type2 = foundType2 ?? null;

            onTypesChange(type1, type2);
        }
    }

    return <div className="pokeCard typesSelectors">
        <CustomSelect
            value={typesValue.type1}
            options={getPokeTypesAsOptions(pokeTypes)}
            disabledValues={['', typesValue.type2]}
            onChangeCallback={(e) => changeTypes(e.target.value, typesValue.type2)}
        />
        <CustomSelect
            value={typesValue.type2}
            options={getPokeTypesAsOptions(pokeTypes)}
            disabledValues={[typesValue.type1]}
            onChangeCallback={(e) => changeTypes(typesValue.type1, e.target.value)}
            disabled={typesValue.type1 === ''}
        />
    </div>
}
