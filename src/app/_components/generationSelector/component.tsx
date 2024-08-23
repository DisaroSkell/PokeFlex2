'use client';

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import CheckboxWithLabel from "../checkboxWithLabel/component";
import CustomButton from "../customButton/component";

import { Generation } from "@/src/types/generation.type";

import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { fetchPokeGens, setSelectedGens } from "@/src/lib/store/pokeGens/pokeGensSlice";

import "./generationSelector.css"

interface GenOptions {
    key: number
    label: string
    selected: boolean
}

interface GenerationSelectorProps {}

export default function GenerationSelector({
}: GenerationSelectorProps) {
    const { t, i18n } = useTranslation();

    const allGens = useAppSelector(state => state.gens.gens)
    const selectedGens = useAppSelector(state => state.gens.selectedGens)
    const dispatch = useAppDispatch()

    const [genOptions, setGenOptions] = useState<GenOptions[]>([])
    const [unsavedChanges, setUnsavedChanges] = useState(false)

    useEffect(() => {
        dispatch(fetchPokeGens({id: i18n.language, fullName: i18n.language}))
    }, [dispatch, i18n.language]);

    useEffect(() => {
        setGenOptions(allGens.map((gen) => {return{
            key: gen.id,
            label: gen.name,
            selected: selectedGens.some((genId) => gen.id === genId)
        }}))
    }, [allGens, selectedGens])

    useEffect(() => {
        // check if selected gens and gen options matches
        let misMatching = false

        for (let i = 0; i < genOptions.length; i++) {
            // mismatch case 0 : mismatch found before
            // mismatch case 1 : genOptions option is selected but isn't in selected gens
            // mismatch case 2 : genOptions option isn't selected but is in selected gens
            // case 1 and 2 simplify to a XOR
            misMatching = misMatching || (genOptions[i].selected !== selectedGens.some(genId => genId === genOptions[i].key))
        }
        
        setUnsavedChanges(misMatching)
    }, [selectedGens, genOptions])

    function onGenOptionValueChange(genIndex: number, newValue: boolean) {
        const newGenOptions: GenOptions[] = []
        for (let iterator = 0; iterator < genOptions.length; iterator++) {
            if(iterator === genIndex) {
                newGenOptions.push({
                    key: genOptions[iterator].key,
                    label: genOptions[iterator].label,
                    selected: newValue
                })
            } else newGenOptions.push(genOptions[iterator])
        }

        setGenOptions(newGenOptions)
    }

    const gensToDisplay = () => {
        return genOptions.map((gen, genIndex) => {
            return (
                <CheckboxWithLabel
                    key={gen.key}
                    label={gen.label}
                    value={gen.selected}
                    onValueChange={(newValue) => onGenOptionValueChange(genIndex, newValue)}
                />
            )
        })
    }

    function isEmptyGenSelection() {
        let i = 0
        while (i < genOptions.length && !genOptions[i].selected) i++

        return i !== genOptions.length
    }

    function confirmChangesCallback() {
        const newSelectedGens: Generation[] = []
        for (let i = 0; i < genOptions.length; i++) {
            if(genOptions[i].selected) {
                newSelectedGens.push(allGens[i])
            }
        }

        dispatch(setSelectedGens(newSelectedGens))
    }

    function cancelChangesCallback() {
        setGenOptions(allGens.map((gen) => {return{
            key: gen.id,
            label: gen.name,
            selected: selectedGens.some((genId) => gen.id === genId)
        }}))
    }
    
    return (
        <div className="genSelectorWrapper">
            <h2>{t("common:select-gens")}</h2>

            <div className="allGensGroup">
                {gensToDisplay()}
            </div>

            <div className="buttonsContainer">
                <CustomButton label={t("common:cancel")} type="primary" onClickCallback={cancelChangesCallback} disabled={!unsavedChanges || !isEmptyGenSelection()} />
                <CustomButton label={t("common:confirm")} type="secondary" onClickCallback={confirmChangesCallback} disabled={!unsavedChanges} />
            </div>
        </div>
    )
}