'use client'

import nextConfig from "@/next.config.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import UniversalInput from "@/src/app/_components/universalInput/component";
import GenerationSelector from "@/src/app/_components/generationSelector/component";
import CustomButton from "@/src/app/_components/customButton/component";
import QuizOptionsSelectors from "../../_components/quizOptionsSelectors/component";
import PokeInfoDisplayer from "../../_components/pokeInfoDisplayer/component";
import TypesGuessSelectors from "../../_components/typesGuessSelectors/component";

import { PokeGuessOptions, PokeInfoOptions, Pokemon } from "@/src/types/pokemon.type";
import { PokeType } from "@/src/types/pokeType.type";

import { getPokeWithId } from "@/src/apiCalls/pokemons";

import { useCountdownTimer } from "@/src/lib/hooks/useCountdownTimer";
import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { incrementStreak, selectStreaks } from "@/src/lib/store/streak/streakSlice";

import { displayTimer } from "@/src/utils/utils";
import { formatStreaksKey } from "@/src/utils/streaks";

import "./quizContent.css";

export default function QuizContent() {
    const { t } = useTranslation();

    const dispatch = useAppDispatch()
    const selectedGens = useAppSelector(state => state.gens.selectedGens)
    const selectedLang = useAppSelector(state => state.lang.selectedLang)
    
    const [currentPoke, setCurrentPoke] = useState<Pokemon | null>(null)
    const [previousPoke, setPreviousPoke] = useState<Pokemon | null>(null)
    const [pokeHasToChange, setPokeHasToChange] = useState(true)
    
    const [currentInput, setCurrentInput] = useState('')
    const [pokeType1Input, setPokeType1Input] = useState<PokeType | null>(null)
    const [pokeType2Input, setPokeType2Input] = useState<PokeType | null>(null)
    const [submitFeedback, setSubmitFeedback] = useState('')
    
    const [selectedInfoOption, setSelectedInfoOption] = useState(PokeInfoOptions.Image)
    const [selectedGuessOption, setSelectedGuessOption] = useState(PokeGuessOptions.ID)
    
    const [streakCount, setStreakCount] = useState(0)
    const streaks = useAppSelector(selectStreaks)
    const [bestStreakKey, setBestStreakKey] = useState('')

    const [secondsBetweenMons, setSecondsBetweenMons] = useState(30);
    const [timer, resumeTimer, pauseTimer, resetTimer] = useCountdownTimer(secondsBetweenMons * 1000, () => giveUpCallback());

    const audioRef = useRef<HTMLAudioElement>(null)

    // fetch image
    useEffect(() => {
        if (!pokeHasToChange || selectedGens.length === 0 || !selectedLang) return
        
        // Chooses a random selected gen
        const randomGen = selectedGens[Math.floor(Math.random() * selectedGens.length)]
        // Choose a random pokemon id in this gen
        const randomId = Math.floor(Math.random() * (randomGen.lastPokemonId - randomGen.firstPokemonId + 1) + randomGen.firstPokemonId)
        
        getPokeWithId(randomId, selectedLang)
            .then((poke) => {
                setCurrentPoke(poke)
                setPokeHasToChange(false)
            })
            .catch((err) => {
                console.error(err)
                setPokeHasToChange(false)
            })
    }, [selectedGens, selectedLang, pokeHasToChange])

    // Resets on change selectors value
    useEffect(() => {
        setCurrentInput('')
        setSubmitFeedback('')
        setStreakCount(0)
        setBestStreakKey(formatStreaksKey(selectedInfoOption, selectedGuessOption, selectedGens))
        setPokeHasToChange(true)
        setPokeType1Input(null);
        setPokeType2Input(null);
    }, [selectedGens, selectedInfoOption, selectedGuessOption])

    // Reset timer on Pokémon change
    useEffect(() => {
        resumeTimer();
        resetTimer();
    }, [currentPoke, resumeTimer, resetTimer]);

    // Streak increase check
    useEffect(() => {
        if (streakCount > (streaks[bestStreakKey] ?? 0))
            dispatch(incrementStreak(bestStreakKey));
    }, [streakCount, streaks, bestStreakKey, dispatch])

    const isCurrentGuessEmpty = useCallback(() => {
        switch(selectedGuessOption) {
            case PokeGuessOptions.ID:
                if (!currentInput) return true;
                break;
            case PokeGuessOptions.Name:
                if (!currentInput) return true;
                break;
            case PokeGuessOptions.Types:
                if (!pokeType1Input) return true;
                break;
        }

        return false;
    }, [selectedGuessOption, currentInput, pokeType1Input]);

    function guessWithID (guess: number, idToGuess: number): boolean {
        if (guess === idToGuess) {
            setSubmitFeedback("right");
            return true;
        } else {
            const diff = Math.abs(guess - idToGuess)

            if(diff <= 5) setSubmitFeedback("close");
            else if(diff === 10) setSubmitFeedback("stupid");
            else if(diff % 100 === 0) setSubmitFeedback("far");
            else setSubmitFeedback("wrong");
            return false;
        }
    }

    function guessWithName (guess: string, nameToGuess: string): boolean {
        const normalizedGuess = guess.trim().replaceAll(/[^\p{L}]/gu, '').toLowerCase();
        const normalizedName = nameToGuess.trim().replaceAll(/[^\p{L}]/gu, '').toLowerCase();

        if (normalizedGuess === normalizedName) {
            setSubmitFeedback("right");
            return true;
        } else {
            if(nameToGuess.includes(guess) || guess.includes(nameToGuess)) setSubmitFeedback("close");
            else setSubmitFeedback("wrong");
            return false;
        }
    }

    function guessWithTypes (
        guessForType1: PokeType,
        guessForType2: PokeType | null,
        typesToGuess: {type1: PokeType; type2: PokeType|null}
    ): boolean {
        const normalizedGuessType1 = guessForType1.fullName.toString().trim().toLowerCase();
        const normalizedGuessType2 = (guessForType2?.fullName.toString() ?? '').trim().toLowerCase();
        const guessForTypes = normalizedGuessType1 + normalizedGuessType2;
        const guessForTypesAlternate = normalizedGuessType2 + normalizedGuessType1;

        const normalizedType1 = typesToGuess.type1.fullName.toString().trim().toLowerCase();
        const normalizedType2 = (typesToGuess.type2?.fullName.toString() ?? '').trim().toLowerCase();
        const typesAsString = normalizedType1 + normalizedType2;
        const typesAlternateAsString = normalizedType2 + normalizedType1;

        if (guessForTypes === typesAsString
        ||  guessForTypes === typesAlternateAsString
        ||  guessForTypesAlternate === typesAsString
        ||  guessForTypesAlternate === typesAlternateAsString) {
            setSubmitFeedback("right");
            return true;
        } else {
            if(normalizedGuessType1 === normalizedType1
            || normalizedGuessType1 === normalizedType2
            || normalizedGuessType2 === normalizedType1
            || normalizedGuessType2 === normalizedType2) setSubmitFeedback("halfright");
            else setSubmitFeedback("wrong");
            return false;
        }
    }

    const guessThePokemonCallback = useCallback(() => {
        let success = true;
        
        if (currentPoke) switch(selectedGuessOption) {
            case PokeGuessOptions.ID:
                if (!currentInput) return

                const currentInputAsNumber = parseInt(currentInput);

                if (isNaN(currentInputAsNumber)) {
                    setSubmitFeedback("problem");
                    return;
                }

                success = guessWithID(currentInputAsNumber, currentPoke.id);
                break;
            case PokeGuessOptions.Name:
                if (!currentInput) return

                success = guessWithName(currentInput, currentPoke.name);
                break;
            case PokeGuessOptions.Types:
                if (!pokeType1Input) return

                success = guessWithTypes(pokeType1Input, pokeType2Input, {type1: currentPoke.type1, type2: currentPoke.type2});
                break;
        }

        if (success) {
            setPokeHasToChange(true)
            setCurrentInput('')
            setPokeType1Input(null)
            setPokeType2Input(null)
            setStreakCount((streak) => streak + 1)
            pauseTimer();
            audioRef.current?.play()
        } else {
            setStreakCount(-1)
        }
    }, [currentInput, currentPoke, selectedGuessOption, pokeType1Input, pokeType2Input, pauseTimer])

    function giveSolution(pokeToGuess: Pokemon, guessOption: PokeGuessOptions) {
        switch(guessOption) {
            case PokeGuessOptions.ID:
                setSubmitFeedback("solution-id");
                break;
            case PokeGuessOptions.Name:
                setSubmitFeedback("solution-name");
                break;
            case PokeGuessOptions.Types:
                if (pokeToGuess.type2) setSubmitFeedback("solution-types");
                else setSubmitFeedback("solution-type");
                break;
        }
    }

    const giveUpCallback = useCallback(() => {
        if(currentPoke) {
            setPreviousPoke(currentPoke);
            setPokeHasToChange(true);
            setCurrentInput('');
            setPokeType1Input(null);
            setPokeType2Input(null);
            setStreakCount(0);
            pauseTimer();
            giveSolution(currentPoke, selectedGuessOption);
        }
    }, [currentPoke, selectedGuessOption, pauseTimer])

    // Give up key listener
    useEffect(() => {
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Escape") giveUpCallback();
        }

        document.addEventListener('keyup', handleKeyUp, true);

        return () => document.removeEventListener('keyup', handleKeyUp, true);
    }, [giveUpCallback])

    return (
        <div className="quiz">
            <div className="absoluteLeft">
                <QuizOptionsSelectors
                    infoOptionValue={selectedInfoOption}
                    onInfoOptionChange={setSelectedInfoOption}
                    guessOptionValue={selectedGuessOption}
                    onGuessOptionChange={setSelectedGuessOption}
                />
            </div>

            <div className="guessContainer">
                <div className="pokeCard infoContainer">
                    <div className="infoContainerHeader">
                        <p>
                            {t(submitFeedback, { poke: previousPoke })}
                        </p>
                        <div className="streaksContainer">
                            <p>
                                {t("best-streak")}: {streaks[bestStreakKey] ?? 0}
                            </p>
                            <p>
                                {t("current-streak")}: {streakCount === -1 ? t("streak-broke") : streakCount}
                            </p>
                        </div>
                    </div>
                    <div className="infoContainerContent">
                        <PokeInfoDisplayer pokemon={pokeHasToChange ? null : currentPoke} infoType={selectedInfoOption} />
                    </div>
                </div>

                <div className="timerContainer">
                    {displayTimer(timer).slice(0, -1)}
                </div>

                <div className="inputGroup">
                    {
                        selectedGuessOption === PokeGuessOptions.Types ?
                        <TypesGuessSelectors 
                            typesValue={{
                                type1: pokeType1Input?.id ?? '',
                                type2: pokeType2Input?.id ?? ''
                            }}
                            onTypesChange={(newType1, newType2) => {
                                setPokeType1Input(newType1);
                                setPokeType2Input(newType2);
                            }} />
                        : <UniversalInput
                            inputValue={currentInput}
                            guessType={selectedGuessOption}
                            inputChangeCallback={setCurrentInput}
                            submitCallback={guessThePokemonCallback}
                        />
                    }
                    <div className="buttonGroup">
                        <CustomButton label={`${t("guess")} ! (↵)`} type={"primary"} onClickCallback={guessThePokemonCallback} disabled={isCurrentGuessEmpty()} />
                        <div className="victimButton">
                            <CustomButton label={`${t("giveup")} :( (Esc)`} type={"alert"} onClickCallback={giveUpCallback} />
                        </div>
                    </div>
                    <audio ref={audioRef} src={`${nextConfig.basePath}/sounds/success.mp3`} />
                </div>
            </div>

            <div className="pokeCard absoluteRight">
                <GenerationSelector />
            </div>
        </div>
    );
}
