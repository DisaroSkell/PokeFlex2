'use client'

import nextConfig from "@/next.config.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import AutoGiveupSelector from "../autoGiveupSelector/component";
import CountdownTimer from "../countdownTimer/component";
import CustomButton from "../customButton/component";
import GenerationSelector from "../generationSelector/component";
import PokeInfoDisplayer from "../pokeInfoDisplayer/component";
import QuizOptionsSelectors from "../quizOptionsSelectors/component";
import TypesGuessSelectors from "../typesGuessSelectors/component";
import UniversalInput from "../universalInput/component";

import { PokeGuessOptions, Pokemon } from "@/src/types/pokemon.type";
import { PokeType } from "@/src/types/pokeType.type";

import { getPokeWithId } from "@/src/apiCalls/pokemons";

import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { selectGens, selectSelectedGens } from "@/src/lib/store/pokeGens/pokeGensSlice";
import { selectCurrentLang } from "@/src/lib/store/lang/langSlice";
import { incrementStreak, selectStreaks } from "@/src/lib/store/streak/streakSlice";
import { selectUserSettings } from "@/src/lib/store/userSettings/userSettingsSlice";

import { formatStreaksKey } from "@/src/utils/streaks";
import { normalizePokeName } from "@/src/utils/utils";

import "./quizContent.css";

export default function QuizContent() {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const allGens = useAppSelector(selectGens);
    const selectedGens = useAppSelector(selectSelectedGens);
    const selectedLang = useAppSelector(selectCurrentLang);
    const streaks = useAppSelector(selectStreaks);
    const userSettings = useAppSelector(selectUserSettings);
    
    const [currentPoke, setCurrentPoke] = useState<Pokemon | null>(null)
    const [previousPoke, setPreviousPoke] = useState<Pokemon | null>(null)
    const [pokeHasToChange, setPokeHasToChange] = useState(true)
    
    const [currentInput, setCurrentInput] = useState('')
    const [pokeType1Input, setPokeType1Input] = useState<PokeType | null>(null)
    const [pokeType2Input, setPokeType2Input] = useState<PokeType | null>(null)
    const [submitFeedback, setSubmitFeedback] = useState('')
    
    const [streakCount, setStreakCount] = useState(0)
    const [bestStreakKey, setBestStreakKey] = useState('')

    const [isTimerPaused, setTimerPaused] = useState(false);
    const [timerResetKey, setTimerResetKey] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null)

    // fetch image
    useEffect(() => {
        if (!pokeHasToChange || selectedGens.length === 0 || !selectedLang) return
        
        // Chooses a random selected gen
        const randomGen = allGens
            .find(gen => gen.id === selectedGens[Math.floor(Math.random() * selectedGens.length)])
            ?? allGens[0];
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
    }, [allGens, selectedGens, selectedLang, pokeHasToChange])

    // Resets on change selectors value
    useEffect(() => {
        setCurrentInput('')
        setSubmitFeedback('')
        setStreakCount(0)
        setBestStreakKey(formatStreaksKey(
            userSettings.chosenQuizOptions.infoOption,
            userSettings.chosenQuizOptions.guessOption,
            allGens.filter(gen => selectedGens.some(selected => gen.id === selected))
        ));
        setPokeHasToChange(true)
        setPokeType1Input(null);
        setPokeType2Input(null);
    }, [allGens, selectedGens, userSettings.chosenQuizOptions])

    // Reset timer on Pokémon change and auto give up value change
    useEffect(() => {
        setTimerPaused(false);
        setTimerResetKey(key => key + 1);
    }, [currentPoke, userSettings.autoGiveup.enabled]);

    // Streak increase check
    useEffect(() => {
        if (streakCount > (streaks[bestStreakKey] ?? 0))
            dispatch(incrementStreak(bestStreakKey));
    }, [streakCount, streaks, bestStreakKey, dispatch])

    const isCurrentGuessEmpty = useCallback(() => {
        switch(userSettings.chosenQuizOptions.guessOption) {
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
    }, [userSettings.chosenQuizOptions.guessOption, currentInput, pokeType1Input]);

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
        const normalizedGuess = normalizePokeName(guess);
        const normalizedName = normalizePokeName(nameToGuess);

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
        
        if (currentPoke) switch(userSettings.chosenQuizOptions.guessOption) {
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
            setTimerPaused(true);
            audioRef.current?.play()
        } else {
            setStreakCount(-1)
        }
    }, [currentInput, currentPoke, userSettings.chosenQuizOptions.guessOption, pokeType1Input, pokeType2Input])

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
            setTimerPaused(true);
            giveSolution(currentPoke, userSettings.chosenQuizOptions.guessOption);
        }
    }, [currentPoke, userSettings.chosenQuizOptions.guessOption])

    const autoGiveUpCallback = useCallback(() => {
        if (userSettings.autoGiveup.enabled) giveUpCallback();
    }, [userSettings.autoGiveup.enabled, giveUpCallback]);

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
                <QuizOptionsSelectors />
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
                        <PokeInfoDisplayer
                            pokemon={pokeHasToChange ? null : currentPoke}
                            infoType={userSettings.chosenQuizOptions.infoOption}
                        />
                    </div>
                </div>

                {userSettings.autoGiveup.enabled && <CountdownTimer
                    startTime={userSettings.autoGiveup.selectedTimeBeforeGiveup * 1000}
                    paused={isTimerPaused}
                    resetKey={timerResetKey}
                    timeOverCallback={() => autoGiveUpCallback()}
                />}

                <div className="inputGroup">
                    {
                        userSettings.chosenQuizOptions.guessOption === PokeGuessOptions.Types ?
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
                            guessType={userSettings.chosenQuizOptions.guessOption}
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

            <div className="absoluteRight">
                <div className="pokeCard">
                    <GenerationSelector />
                </div>
                <div className="pokeCard">
                    <AutoGiveupSelector />
                </div>
            </div>
        </div>
    );
}
