import { useEffect, useState } from "react";

import { getAllGens } from "../../_apiCalls/generations";

import CheckboxWithLabel from "../checkboxWithLabel/component";

import { Generation } from "@/app/_types/generation.type";

import "./generationSelector.css"

interface GenerationSelectorProps {
    consumeSelectedGens: (value: Generation[]) => void
}

interface GenOptions {
    name: string
    selected: boolean
}

export default function GenerationSelector(props: GenerationSelectorProps) {
    const [gens, setGens] = useState<Generation[]>([])
    const [genOptions, setGenOptions] = useState<GenOptions[]>([])

    useEffect(() => {
        getAllGens().then((gens) => {
            setGens(gens)
            props.consumeSelectedGens(gens)
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
                        const newGenOptions: GenOptions[] = []
                        const selectedGens: Generation[] = []
                        for (let iterator = 0; iterator < genOptions.length; iterator++) {
                            if(iterator === genIndex) {
                                newGenOptions.push({
                                    name: genOptions[iterator].name,
                                    selected: newValue
                                })

                                if(newValue) {
                                    selectedGens.push(gens[iterator])
                                }
                            } else {
                                newGenOptions.push(genOptions[iterator])

                                if(genOptions[iterator].selected) {
                                    selectedGens.push(gens[iterator])
                                }
                            }

                        }

                        setGenOptions(newGenOptions)
                        props.consumeSelectedGens(selectedGens)
                    }}
                />
            )
        })
    }
    
    return (
        <div className="allGensGroup">
            {gensToDisplay()}
        </div>
    )
}