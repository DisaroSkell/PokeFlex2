import { useEffect, useState } from "react";

import { getAllGens } from "../../../apiCalls/generations";

import CheckboxWithLabel from "../checkboxWithLabel/component";

import { Generation } from "@/src/types/generation.type";

import "./generationSelector.css"

interface GenerationSelectorProps {
    onSelectedGensUpdate: (value: Generation[]) => void
}

interface GenOptions {
    name: string
    selected: boolean
}

export default function GenerationSelector(props: GenerationSelectorProps) {
    const [allGens, setAllGens] = useState<Generation[]>([])
    const [genOptions, setGenOptions] = useState<GenOptions[]>([])
    const [unsavedChanges, setUnsavedChanges] = useState(false)

    useEffect(() => {
        getAllGens().then((gens) => {
            setAllGens(gens)
            props.onSelectedGensUpdate(gens)
            setGenOptions(gens.map((gen) => {return { name: gen.name, selected: true }}))
        })
    }, []) // Can't put props in dependencies because it create an infinite loop

    const gensToDisplay = () => {
        let key = 0
        return genOptions.map((gen, genIndex) => {
            key++
            return (
                <CheckboxWithLabel
                    key={`${gen.name}-${key}`}
                    label={gen.name}
                    value={gen.selected}
                    onValueChange={(newValue) => {
                        setUnsavedChanges(true)
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
                    }}
                />
            )
        })
    }

    function confirmChangesCallback() {
        const selectedGens: Generation[] = []
        for (let iterator = 0; iterator < genOptions.length; iterator++) {
            if(genOptions[iterator].selected) {
                selectedGens.push(allGens[iterator])
            }
        }
        props.onSelectedGensUpdate(selectedGens)

        setUnsavedChanges(false)
    }
    
    return (
        <div className="genSelectorWrapper">
            <h2>Select Pokémon Generations</h2>

            <div className="allGensGroup">
                {gensToDisplay()}
            </div>

            <button onClick={confirmChangesCallback} disabled={!unsavedChanges}>Confirm changes</button>
        </div>
    )
}