'use client'

import { useCallback, useEffect, useState } from "react";

import nextConfig from "@/next.config.mjs"

import UniversalInput from "@/src/app/_components/universalInput/component";
import GenerationSelector from "@/src/app/_components/generationSelector/component";

import { getPokeWithId } from "@/src/apiCalls/pokemons";

import { useAppSelector } from "@/src/lib/hooks";

import Image from 'next/image';
import "./quiz.css";

export default function Quiz() {
    const selectedGens = useAppSelector(state => state.gens.selectedGens)
    
    const [currentPoke, setCurrentPoke] = useState<any>(null)
    const [currentInput, setCurrentInput] = useState('')
    const [submitFeedback, setSubmitFeedback] = useState('')
    const [pokeHasToChange, setPokeHasToChange] = useState(true)
    const [streakCount, setStreakCount] = useState(0)

    // fetch image
    useEffect(() => {
        if (!pokeHasToChange || selectedGens.length === 0) return
        
        // Chooses a random selected gen
        const randomGen = selectedGens[Math.floor(Math.random() * selectedGens.length)]
        // Choose a random pokemon id in this gen
        const randomId = Math.floor(Math.random() * (randomGen.lastPokemonId - randomGen.firstPokemonId + 1) + randomGen.firstPokemonId)
        
        getPokeWithId(randomId)
            .then((poke) => {
                setCurrentPoke(poke)
                setPokeHasToChange(false)
            })
            .catch((err) => {
                console.error(err)
                setPokeHasToChange(false)
            })
    }, [selectedGens, pokeHasToChange])

    useEffect(() => {
        setPokeHasToChange(true)
    }, [selectedGens])

    const guessThePokemonCallback = useCallback(() => {
        const currentInputAsNumber = parseInt(currentInput)
        const currentPokeIdAsNumber = parseInt(currentPoke?.id)

        if (isNaN(currentInputAsNumber) || isNaN(currentPokeIdAsNumber)) {
            return
        }

        if (currentInputAsNumber === currentPokeIdAsNumber) {
            setPokeHasToChange(true)
            setCurrentInput('')
            setSubmitFeedback("You're right ;)")
            setStreakCount((streak) => streak + 1)
        } else {
            const diff = Math.abs(currentInputAsNumber - currentPokeIdAsNumber)
            setStreakCount(0)
            
            if(diff <= 5) setSubmitFeedback("You're close !")
            else if(diff === 10) setSubmitFeedback("Ahah... No ^^")
            else if(diff % 100 === 0) setSubmitFeedback("Really ?")
            else setSubmitFeedback("You're wrong :D")
        }
    }, [currentInput, currentPoke])

    function giveUpCallback() {
        if(currentPoke) {
            setSubmitFeedback(`It was n°${currentPoke.id}`)
            setPokeHasToChange(true)
            setCurrentInput('')
            setStreakCount(0)
        }
    }

    return (
        <div className="quiz">
            <div className="guessContainer">
                <div className="pokeCard">
                    <div className="quizUpperTextGroup">
                        <p>
                            {submitFeedback}
                        </p>
                        <p>
                            Streak: {streakCount}
                        </p>
                    </div>
                    <Image src={currentPoke ? currentPoke.sprites.front_default : `${nextConfig.basePath}/Logo.png`} alt={currentPoke?.name ? currentPoke.name : ''} width={300} height={300} />
                </div>

                <div className="pokeCard absoluteRight">
                    <GenerationSelector />
                </div>

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
