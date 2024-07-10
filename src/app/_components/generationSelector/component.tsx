import { useEffect, useState } from "react";

import CheckboxWithLabel from "../checkboxWithLabel/component";

import { Generation } from "@/src/types/generation.type";

import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";
import { setSelectedGens } from "@/src/lib/pokeGens/pokeGensSlice";

import "./generationSelector.css"

interface GenerationSelectorProps {}

interface GenOptions {
    name: string
    selected: boolean
}

export default function GenerationSelector(props: GenerationSelectorProps) {
    const allGens = useAppSelector(state => state.gens.gens)
    const selectedGens = useAppSelector(state => state.gens.selectedGens)
    const dispatch = useAppDispatch()

    const [genOptions, setGenOptions] = useState<GenOptions[]>([])
    const [unsavedChanges, setUnsavedChanges] = useState(false)

    useEffect(() => {
        setGenOptions(allGens.map((gen) => {return{
            name: gen.name,
            selected: selectedGens.some((g) => gen.name === g.name)
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
            misMatching = misMatching || (genOptions[i].selected !== selectedGens.some(g => g.name === genOptions[i].name))
        }
        
        setUnsavedChanges(misMatching)
    }, [selectedGens, genOptions])

    function onGenOptionValueChange(genIndex: number, newValue: boolean) {
        const newGenOptions: GenOptions[] = []
        for (let iterator = 0; iterator < genOptions.length; iterator++) {
            if(iterator === genIndex) {
                newGenOptions.push({
                    name: genOptions[iterator].name,
                    selected: newValue
                })
            } else newGenOptions.push(genOptions[iterator])
        }

        setGenOptions(newGenOptions)
    }

    const gensToDisplay = () => {
        let key = 0
        return genOptions.map((gen, genIndex) => {
            key++
            return (
                <CheckboxWithLabel
                    key={`${gen.name}-${key}`}
                    label={gen.name}
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
            name: gen.name,
            selected: selectedGens.some((g) => gen.name === g.name)
        }}))
    }
    
    return (
        <div className="genSelectorWrapper">
            <h2>Select Pokémon Generations</h2>

            <div className="allGensGroup">
                {gensToDisplay()}
            </div>

            <div className="buttonsContainer">
                <button onClick={cancelChangesCallback} disabled={!unsavedChanges}>Cancel changes</button>
                <button onClick={confirmChangesCallback} disabled={!unsavedChanges || !isEmptyGenSelection()}>Confirm changes</button>
            </div>
        </div>
    )
}