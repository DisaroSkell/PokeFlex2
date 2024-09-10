'use client'

import nextConfig from "@/next.config.mjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import AutoGiveupSelector from "../autoGiveupSelector/component";
import CountdownTimer from "../countdownTimer/component";
import CustomButton from "../customButton/component";
import GenerationSelector from "../generationSelector/component";
import PokeInfoDisplayer from "../pokeInfoDisplayer/component";
import QuizOptionsSelectors from "../quizOptionsSelectors/component";
import TypesGuessSelectors from "../typesGuessSelectors/component";
import UniversalInput from "../universalInput/component";

import { PokeGuessOptions, Pokemon, PokePos } from "@/src/types/pokemon.type";
import { PokeType } from "@/src/types/pokeType.type";

import { usePoke } from "@/src/lib/hooks/usePoke";

import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { selectGens, selectSelectedGens } from "@/src/lib/store/pokeGens/pokeGensSlice";
import { selectCurrentLang } from "@/src/lib/store/lang/langSlice";
import { incrementStreak, selectStreaks } from "@/src/lib/store/streak/streakSlice";
import { selectUserSettings } from "@/src/lib/store/userSettings/userSettingsSlice";

import { guessWithID, guessWithName, guessWithTypes } from "@/src/utils/guess";
import { formatStreaksKey } from "@/src/utils/streaks";

import "./quizContent.css";

export default function QuizContent() {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const allGens = useAppSelector(selectGens);
    const selectedGensID = useAppSelector(selectSelectedGens);
    const selectedLang = useAppSelector(selectCurrentLang);
    const streaks = useAppSelector(selectStreaks);
    const userSettings = useAppSelector(selectUserSettings);

    const selectedGens = useMemo(() => {
        return allGens.filter(gen => selectedGensID.some(selected => gen.id === selected));
    }, [selectedGensID]);
    
    const [
        currentPoke,
        isPokeLoading,
        changePoke,
    ] = usePoke(selectedLang, selectedGens);
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
        if (!pokeHasToChange || isPokeLoading || selectedGens.length === 0 || !selectedLang) return;
        
        changePoke();
        setPokeHasToChange(false);
    }, [allGens, selectedGens, selectedLang, pokeHasToChange, isPokeLoading, changePoke]);

    // Resets on change selectors value
    useEffect(() => {
        setCurrentInput('')
        setSubmitFeedback('')
        setStreakCount(0)
        setBestStreakKey(formatStreaksKey(
            userSettings.chosenQuizOptions.infoOption,
            userSettings.chosenQuizOptions.guessOption,
            selectedGens,
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

                {
                    const guessResult = guessWithID(currentInputAsNumber, currentPoke.id);
                    success = guessResult.success;
                    setSubmitFeedback(guessResult.feedback);
                }

                break;
            case PokeGuessOptions.Name:
                if (!currentInput) return

                {
                    const guessResult = guessWithName(currentInput, currentPoke.name);
                    success = guessResult.success;
                    setSubmitFeedback(guessResult.feedback);
                }

                break;
            case PokeGuessOptions.Types:
                if (!pokeType1Input) return

                {
                    const guessResult = guessWithTypes(pokeType1Input, pokeType2Input, {type1: currentPoke.type1, type2: currentPoke.type2});
                    success = guessResult.success;
                    setSubmitFeedback(guessResult.feedback);
                }

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
                            pokemon={pokeHasToChange || isPokeLoading ? null : currentPoke}
                            infoType={userSettings.chosenQuizOptions.infoOption}
                            pokePos={PokePos.current}
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
