'use client';


import { useEffect } from "react";

import { PokeType } from "@/src/types/pokeType.type";

import CustomSelect from "../customSelect/component";

import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";
import { fetchPokeTypes, selectPokeTypes } from "@/src/lib/pokeTypes/pokeTypesSlice";

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
    const selectedLang = useAppSelector(state => state.lang.selectedLang);
    const pokeTypes = useAppSelector(selectPokeTypes);

    useEffect(() => {
        dispatch(fetchPokeTypes(selectedLang));
    }, [dispatch, selectedLang]);

    function getPokeTypesAsOptions(pokeTypes: PokeType[]) {
        return [{value: '', label: ' '}, ...pokeTypes.map(type => {return {
            value: type.id,
            label: type.fullName
        }})];
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
            disabledValues={['']}
            onChangeCallback={(e) => changeTypes(e.target.value, typesValue.type2)}
        />
        <CustomSelect
            value={typesValue.type2}
            options={getPokeTypesAsOptions(pokeTypes)}
            disabledValues={[]}
            onChangeCallback={(e) => changeTypes(typesValue.type1, e.target.value)}
        />
    </div>
}