'use client'

import { ChangeEvent, useCallback, useEffect, useState } from "react";

import UniversalInput from "@/src/app/_components/universalInput/component";
import GenerationSelector from "@/src/app/_components/generationSelector/component";
import CustomButton from "@/src/app/_components/customButton/component";
import PokeInfoDisplayer from "../../_components/pokeInfoDisplayer/component";

import { PokeGuessOptions, PokeInfoOptions, Pokemon } from "@/src/types/pokemon.type";

import { getPokeWithId } from "@/src/apiCalls/pokemons";

import { useAppSelector } from "@/src/lib/hooks";

import "./quiz.css";
import CustomSelect from "../../_components/customSelect/component";

export default function Quiz() {
    const selectedGens = useAppSelector(state => state.gens.selectedGens)
    
    const [currentPoke, setCurrentPoke] = useState<Pokemon | null>(null)
    const [pokeHasToChange, setPokeHasToChange] = useState(true)
    const [bestStreak, setBestStreak] = useState(0)
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

    useEffect(() => {
        setBestStreak((current) => streakCount > current ? streakCount : current)
    }, [streakCount])

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

    function giveSolution(guessOption: PokeGuessOptions) {
        if (currentPoke) switch(guessOption) {
            case PokeGuessOptions.ID:
                setSubmitFeedback(`Its id was n°${currentPoke.id}`);
                break;
            case PokeGuessOptions.Name:
                setSubmitFeedback(`Its name was ${currentPoke.name}`);
                break;
            case PokeGuessOptions.Types:
                if (currentPoke.type2) setSubmitFeedback(`Its types were ${currentPoke.type1} and ${currentPoke.type2}`);
                else setSubmitFeedback(`Its type was ${currentPoke.type1}`);
                break;
        }
    }

    function giveUpCallback() {
        setPokeHasToChange(true);
        setCurrentInput('');

        if(currentPoke) {
            setStreakCount(0);
            giveSolution(selectedGuessOption);
        }
    }

    const getPokeInfoOptions = () => {
        const pokeInfoKeys = Object.keys(PokeInfoOptions)
        const pokeInfoValues = Object.values(PokeInfoOptions)
        const options: {
            value: string,
            label: string
        }[] = []

        for (let i = 0; i < pokeInfoKeys.length; i++) {
            options.push({
                value: pokeInfoValues[i],
                label: pokeInfoKeys[i]
            })
        }

        return options
    }

    const getPokeGuessOptions = () => {
        const pokeGuessKeys = Object.keys(PokeGuessOptions)
        const pokeGuessValues = Object.values(PokeGuessOptions)
        const options: {
            value: string,
            label: string
        }[] = []

        for (let i = 0; i < pokeGuessKeys.length; i++) {
            options.push({
                value: pokeGuessValues[i],
                label: pokeGuessKeys[i]
            })
        }

        return options
    }

    return (
        <div className="quiz">
            <div className="quizSelectors pokeCard absoluteLeft">
                <h2>Things you want to see</h2>
                <CustomSelect
                    value={selectedInfoOption}
                    options={getPokeInfoOptions()}
                    disabledValues={[selectedGuessOption]}
                    onChangeCallback={e => {
                        const foundOption = Object.values(PokeInfoOptions).find(option => option.valueOf() === e.target.value)
        
                        if (foundOption) {
                            setSelectedInfoOption(foundOption)
                        }
                    }}
                />
                <h2>Things you want to guess</h2>
                <CustomSelect
                    value={selectedGuessOption}
                    options={getPokeGuessOptions()}
                    disabledValues={[selectedInfoOption]}
                    onChangeCallback={e => {
                        const foundOption = Object.values(PokeGuessOptions).find(option => option.valueOf() === e.target.value)
        
                        if (foundOption) {
                            setSelectedGuessOption(foundOption)
                        }
                    }}
                />
            </div>

            <div className="guessContainer">
                <div className="pokeCard infoContainer">
                    <div className="infoContainerHeader">
                        <p>
                            {submitFeedback}
                        </p>
                        <div className="streaksContainer">
                            <p>
                                Best Streak: {bestStreak}
                            </p>
                            <p>
                                Streak: {streakCount}
                            </p>
                        </div>
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
