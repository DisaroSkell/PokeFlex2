'use client'

import { useCallback, useEffect, useState } from "react";

import UniversalInput from "@/src/app/_components/universalInput/component";
import GenerationSelector from "@/src/app/_components/generationSelector/component";
import CustomButton from "@/src/app/_components/customButton/component";
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

    function guessWithID (guess: number, idToGuess: number) {
        if (guess === idToGuess) {
            setPokeHasToChange(true)
            setCurrentInput('')
            setSubmitFeedback("You're right ;)")
            setStreakCount((streak) => streak + 1)
        } else {
            const diff = Math.abs(guess - idToGuess)
            setStreakCount(0)
            
            if(diff <= 5) setSubmitFeedback("You're close !")
            else if(diff === 10) setSubmitFeedback("Ahah... No ^^")
            else if(diff % 100 === 0) setSubmitFeedback("Really ?")
            else setSubmitFeedback("You're wrong :D")
        }
    }

    function guessWithName (guess: string, nameToGuess: string) {
        if (guess.trim().toLowerCase() === nameToGuess.trim().toLowerCase()) {
            setPokeHasToChange(true)
            setCurrentInput('')
            setSubmitFeedback("You're right ;)")
            setStreakCount((streak) => streak + 1)
        } else {
            setStreakCount(0)
            
            if(nameToGuess.includes(guess) || guess.includes(nameToGuess)) setSubmitFeedback("You're close !")
            else setSubmitFeedback("You're wrong :D")
        }
    }

    function guessWithTypes (guess: string, typesToGuess: {type1: PokeType; type2: PokeType|null}) {
        const normalizedType1 = typesToGuess.type1.toString().trim().toLowerCase();
        const normalizedType2 = (typesToGuess.type2?.toString() ?? '').trim().toLowerCase();
        const typesAsString = normalizedType1 + normalizedType2;
        const typesAlternateAsString = normalizedType2 + normalizedType1;
        const normalizedGuess = guess.trim().toLowerCase();

        if (normalizedGuess === typesAsString
        ||  normalizedGuess === typesAlternateAsString) {
            setPokeHasToChange(true)
            setCurrentInput('')
            setSubmitFeedback("You're right ;)")
            setStreakCount((streak) => streak + 1)
        } else {
            setStreakCount(0)
            
            if(normalizedGuess === normalizedType1
            || normalizedGuess === normalizedType2) setSubmitFeedback("You're missing one !")
            else setSubmitFeedback("You're wrong :D")
        }
    }

    const guessThePokemonCallback = useCallback(() => {
        if (!currentInput) return

        if (currentPoke) switch(selectedGuessOption) {
            case PokeGuessOptions.ID:
                const currentInputAsNumber = parseInt(currentInput);

                if (isNaN(currentInputAsNumber)) {
                    break;
                }

                return guessWithID(currentInputAsNumber, currentPoke.id);
            case PokeGuessOptions.Name:
                return guessWithName(currentInput, currentPoke.name);
            case PokeGuessOptions.Types:
                return guessWithTypes(currentInput, {type1: currentPoke.type1, type2: currentPoke.type2});
        }

        setSubmitFeedback("Something went wrong");
    }, [currentInput, currentPoke, selectedGuessOption])

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
                        <PokeInfoDisplayer pokemon={pokeHasToChange ? null : currentPoke} infoType={selectedInfoOption} />
                    </div>
                </div>

                <div className="inputGroup">
                    <UniversalInput
                        inputValue={currentInput}
                        guessType={selectedGuessOption}
                        inputChangeCallback={setCurrentInput}
                        submitCallback={guessThePokemonCallback}
                    />
                    <div className="buttonGroup">
                        <CustomButton label="Guess !" type={"primary"} onClickCallback={guessThePokemonCallback} />
                        <div className="victimButton">
                            <CustomButton label="Give up :(" type={"alert"} onClickCallback={giveUpCallback} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pokeCard absoluteRight">
                <GenerationSelector />
            </div>
        </div>
    );
}
