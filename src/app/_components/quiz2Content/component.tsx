'use client';

import nextConfig from "@/next.config.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import AutoGiveupSelector from "../autoGiveupSelector/component";
import CountdownTimer from "../countdownTimer/component";
import CustomButton from "../customButton/component";
import GenerationSelector from "../generationSelector/component";
import Quiz2InfoDisplayer from '../pokeInfoDisplayer/quiz2InfoDisplayer';
import UniversalInput from "../universalInput/component";

import { PokeGuessOptions, Pokemon, PokePos } from "@/src/types/pokemon.type";

import { getPokeWithId } from "@/src/apiCalls/pokemons";

import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { selectGens, selectSelectedGens } from "@/src/lib/store/pokeGens/pokeGensSlice";
import { selectCurrentLang } from "@/src/lib/store/lang/langSlice";
import { incrementStreak, selectStreaks } from "@/src/lib/store/streak/streakSlice";
import { selectUserSettings } from "@/src/lib/store/userSettings/userSettingsSlice";

import { guessWithName } from "@/src/utils/guess";
import { formatStreaksKey } from "@/src/utils/streaks";

import "./quiz2Content.css";

export default function Quiz2Content() {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const allGens = useAppSelector(selectGens);
    const selectedGens = useAppSelector(selectSelectedGens);
    const selectedLang = useAppSelector(selectCurrentLang);
    const streaks = useAppSelector(selectStreaks);
    const userSettings = useAppSelector(selectUserSettings);
    
    const [pokeToDisplay, setPokeToDisplay] = useState<Pokemon | null>(null);
    const [pokeToGuess, setPokeToGuess] = useState<Pokemon | null>(null);
    const [previousAnswer, setPreviousAnswer] = useState<Pokemon | null>(null);
    const [pokeHasToChange, setPokeHasToChange] = useState(true);
    const [guessingPos, setGuessingPos] = useState<PokePos | null>(null);
    
    const [currentInput, setCurrentInput] = useState('');
    const [submitFeedback, setSubmitFeedback] = useState('');
    
    const [streakCount, setStreakCount] = useState(0);
    const [bestStreakKey, setBestStreakKey] = useState('');

    const [isTimerPaused, setTimerPaused] = useState(false);
    const [timerResetKey, setTimerResetKey] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    // fetch image
    useEffect(() => {
        if (!pokeHasToChange || selectedGens.length === 0 || !selectedLang) return;
        
        // Chooses a random selected gen
        const randomGen = allGens
            .find(gen => gen.id === selectedGens[Math.floor(Math.random() * selectedGens.length)])
            ?? allGens[0];
        // Choose a random pokemon id in this gen
        const randomId = Math.floor(Math.random() * (randomGen.lastPokemonId - randomGen.firstPokemonId + 1) + randomGen.firstPokemonId);

        getPokeWithId(randomId, selectedLang)
        .then((poke) => {
            // Go previous or next at random
            if ((Math.random() < 0.5 && randomId - 1 >= randomGen.firstPokemonId) || randomId + 1 > randomGen.lastPokemonId) {
                // Previous poke
                getPokeWithId(randomId - 1, selectedLang)
                .then((prevPoke) => {
                    setGuessingPos(PokePos.prev);
                    setPokeToDisplay(poke);
                    setPokeToGuess(prevPoke);
                    setPokeHasToChange(false);
                })
            } else {
                // Next poke
                getPokeWithId(randomId + 1, selectedLang)
                .then((nextPoke) => {
                    setGuessingPos(PokePos.next);
                    setPokeToDisplay(poke);
                    setPokeToGuess(nextPoke);
                    setPokeHasToChange(false);
                })
            }
        })
        .catch((err) => {
            console.error(err);
            setPokeHasToChange(false);
        });
        
    }, [allGens, selectedGens, selectedLang, pokeHasToChange]);

    // Resets on change selectors value
    useEffect(() => {
        setCurrentInput('')
        setSubmitFeedback('')
        setStreakCount(0)
        setBestStreakKey("q2-" + formatStreaksKey(
            userSettings.chosenQuizOptions.infoOption,
            userSettings.chosenQuizOptions.guessOption,
            allGens.filter(gen => selectedGens.some(selected => gen.id === selected))
        ));
        setPokeHasToChange(true)
    }, [allGens, selectedGens, userSettings.chosenQuizOptions])

    // Reset timer on Pokémon change and auto give up value change
    useEffect(() => {
        setTimerPaused(false);
        setTimerResetKey(key => key + 1);
    }, [pokeToDisplay, userSettings.autoGiveup.enabled]);

    // Streak increase check
    useEffect(() => {
        if (streakCount > (streaks[bestStreakKey] ?? 0))
            dispatch(incrementStreak(bestStreakKey));
    }, [streakCount, streaks, bestStreakKey, dispatch])

    const isCurrentGuessEmpty = useCallback(() => {
        return !currentInput;
    }, [currentInput]);

    const guessThePokemonCallback = useCallback(() => {
        if (!currentInput || !pokeToGuess) return;
        
        const guessResult = guessWithName(currentInput, pokeToGuess.name);
        setSubmitFeedback(guessResult.feedback);

        if (guessResult.success) {
            setPokeHasToChange(true)
            setCurrentInput('')
            setStreakCount((streak) => streak + 1)
            setTimerPaused(true);
            audioRef.current?.play()
        } else {
            setStreakCount(-1)
        }
    }, [currentInput, pokeToGuess])

    function giveSolution(
        // pokeToGuess: Pokemon
    ) {
        // console.log("Pokémon was this: ", pokeToGuess)

        setSubmitFeedback("solution-name");
    }

    const giveUpCallback = useCallback(() => {
        if(pokeToGuess) {
            setPreviousAnswer(pokeToGuess);
            setPokeHasToChange(true);
            setCurrentInput('');
            setStreakCount(0);
            setTimerPaused(true);
            giveSolution();
        }
    }, [pokeToGuess]);

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
    }, [giveUpCallback]);

    return (
        <div className="quiz">
            <div className="guessContainer">
                <div className="pokeCard infoContainer">
                    <div className="infoContainerHeader">
                        <p>
                            {t(submitFeedback, { poke: previousAnswer })}
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
                        <Quiz2InfoDisplayer
                            pokemon={pokeHasToChange ? null : pokeToDisplay}
                            pokePos={guessingPos ?? PokePos.current}
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
                    <UniversalInput
                        inputValue={currentInput}
                        guessType={PokeGuessOptions.Name}
                        inputChangeCallback={setCurrentInput}
                        submitCallback={guessThePokemonCallback}
                    />
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
