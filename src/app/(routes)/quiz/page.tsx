'use client'

import { useCallback, useEffect, useState } from "react";

import UniversalInput from "@/src/app/_components/universalInput/component";
import GenerationSelector from "@/src/app/_components/generationSelector/component";
import PokeInfoDisplayer from "../../_components/pokeInfoDisplayer/component";

import { PokeGuessOptions, PokeInfoOptions, Pokemon } from "@/src/types/pokemon.type";

import { getPokeWithId } from "@/src/apiCalls/pokemons";

import { useAppSelector } from "@/src/lib/hooks";

import "./quiz.css";

export default function Quiz() {
    const selectedGens = useAppSelector(state => state.gens.selectedGens)
    
    const [currentPoke, setCurrentPoke] = useState<Pokemon | null>(null)
    const [pokeHasToChange, setPokeHasToChange] = useState(true)
    const [streakCount, setStreakCount] = useState(0)

    const [currentInput, setCurrentInput] = useState('')
    const [submitFeedback, setSubmitFeedback] = useState('')

    const [selectedInfoOption, setSelectedInfoOption] = useState(PokeInfoOptions.Image)
    const [selectedGuessOption, setSelectedGuessOption] = useState(PokeGuessOptions.ID)

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
        setSubmitFeedback('')
        setStreakCount(0)
        setPokeHasToChange(true)
    }, [selectedGens, selectedInfoOption, selectedGuessOption])

    const guessThePokemonCallback = useCallback(() => {
        const currentInputAsNumber = parseInt(currentInput)
        const currentPokeIdAsNumber = currentPoke?.id ?? -1

        if (isNaN(currentInputAsNumber) || currentPokeIdAsNumber === -1) {
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

    const getPokeInfoOptions = () => {
        const pokeInfoKeys = Object.keys(PokeInfoOptions)
        const pokeInfoValues = Object.values(PokeInfoOptions)
        const options: JSX.Element[] = []

        for (let i = 0; i < pokeInfoKeys.length; i++) {
            options.push(<option
                value={pokeInfoValues[i]}
                key={pokeInfoKeys[i]}
                disabled={pokeInfoValues[i].valueOf() === selectedGuessOption.valueOf()}
            >
                {pokeInfoKeys[i]}
            </option>)
        }

        return <select
            name="pokeInfoOptions"
            value={selectedInfoOption}
            onChange={e => {
                const newValue = e.target.value

                const foundOption = Object.values(PokeInfoOptions).find(option => option.valueOf() === newValue)

                if (foundOption) {
                    setSelectedInfoOption(foundOption)
                }
            }}
        >{options}</select>
    }

    const getPokeGuessOptions = () => {
        const pokeGuessKeys = Object.keys(PokeGuessOptions)
        const pokeGuessValues = Object.values(PokeGuessOptions)
        const options: JSX.Element[] = []

        for (let i = 0; i < pokeGuessKeys.length; i++) {
            options.push(<option
                value={pokeGuessValues[i]}
                key={pokeGuessKeys[i]}
                disabled={pokeGuessValues[i].valueOf() === selectedInfoOption.valueOf()}
            >
                {pokeGuessKeys[i]}
            </option>)
        }

        return <select
            name="pokeGuessOptions"
            value={selectedGuessOption}
            onChange={e => {
                const newValue = e.target.value

                const foundOption = Object.values(PokeGuessOptions).find(option => option.valueOf() === newValue)

                if (foundOption) {
                    setSelectedGuessOption(foundOption)
                }
            }}
        >{options}</select>
    }

    return (
        <div className="quiz">
            <div className="quizSelectors absoluteLeft">
                <div className="pokeCard">{getPokeInfoOptions()}</div>
                <div className="pokeCard">{getPokeGuessOptions()}</div>
            </div>

            <div className="guessContainer">
                <div className="pokeCard infoContainer">
                    <div className="infoContainerHeader">
                        <p>
                            {submitFeedback}
                        </p>
                        <p>
                            Streak: {streakCount}
                        </p>
                    </div>
                    <div className="infoContainerContent">
                        <PokeInfoDisplayer pokemon={pokeHasToChange ? null : currentPoke} infoType={selectedInfoOption} size={300} />
                    </div>
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

            <div className="pokeCard absoluteRight">
                <GenerationSelector />
            </div>
        </div>
    );
}
