'use client'

import { useCallback, useEffect, useState } from "react";

import UniversalInput from "@/app/_components/universalInput/component";
import GenerationSelector from "@/app/_components/generationSelector/component";

import { defaultURL, pokemonsEndpoint } from "@/app/_types/api.type";

import Image from 'next/image';
import "./quiz.css";
import { Generation } from "@/app/_types/generation.type";

export default function Quiz() {
    const [currentPoke, setCurrentPoke] = useState<any>(null)
    const [currentInput, setCurrentInput] = useState('')
    const [submitFeedback, setSubmitFeedback] = useState('')
    const [selectedGens, setSelectedGens] = useState<Generation[]>([])

    // fetch image
    useEffect(() => {
        if (currentPoke !== null || selectedGens.length === 0) return

        // Chooses a random selected gen
        const randomGen = selectedGens[Math.floor(Math.random() * selectedGens.length)]
        // Choose a random pokemon id in this gen
        const randomId = Math.floor(Math.random() * (randomGen.lastPokemonId - randomGen.firstPokemonId + 1) + randomGen.firstPokemonId)

        fetch(defaultURL + pokemonsEndpoint + randomId).then((res) => {
            if(res.ok) res.json().then((foundPoke) => {
                if(foundPoke) {
                    setCurrentPoke(foundPoke)
                }
            })
        }).catch((err) => {
            console.error(err)
        })
    }, [currentPoke, selectedGens])

    const guessThePokemonCallback = useCallback(() => {
        const currentInputAsNumber = parseInt(currentInput)
        const currentPokeIdAsNumber = parseInt(currentPoke?.id)

        if (isNaN(currentInputAsNumber) || isNaN(currentPokeIdAsNumber)) {
            return
        }

        if (currentInputAsNumber === currentPokeIdAsNumber) {
            setCurrentPoke(null)
            setCurrentInput('')
            setSubmitFeedback("You're right ;)")
        } else {
            const diff = Math.abs(currentInputAsNumber - currentPokeIdAsNumber)
            
            if(diff <= 5) setSubmitFeedback("You're close !")
            else if(diff === 10) setSubmitFeedback("Ahah... No ^^")
            else if(diff % 100 === 0) setSubmitFeedback("Really ?")
            else setSubmitFeedback("You're wrong :D")
        }
    }, [currentInput, currentPoke])

    function giveUpCallback() {
        setSubmitFeedback(`Dommage c'était le ${currentPoke.id}`)
        setCurrentPoke(null)
        setCurrentInput('')
    }

    return (
        <div className="quiz">
            {submitFeedback}
            <div className="guessContainer">
                <div className="pokeCard">
                    <Image src={currentPoke ? currentPoke.sprites.front_default : '/PokeFlex2/Logo.png'} alt={currentPoke?.name ? currentPoke.name : ''} width={300} height={300} />
                </div>

                <GenerationSelector consumeSelectedGens={setSelectedGens} />

                <div className="inputGroup">
                    <UniversalInput
                        inputValue={currentInput}
                        type="number"
                        inputChangeCallback={setCurrentInput}
                        submitCallback={guessThePokemonCallback}
                    />
                    <div className="buttonGroup">
                        <button onClick={guessThePokemonCallback}>Try ?</button>
                        <button onClick={giveUpCallback}>Give up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
