'use client';

import nextConfig from "@/next.config.mjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import AutoGiveupSelector from "../autoGiveupSelector/component";
import CountdownTimer from "../countdownTimer/component";
import CustomButton from "../customButton/component";
import GenerationSelector from "../generationSelector/component";
import PokeInfoDisplayer from "../pokeInfoDisplayer/component";
import UniversalInput from "../universalInput/component";

import { PokeGuessOptions, PokeInfoOptions, Pokemon, PokePos } from "@/src/types/pokemon.type";

import { usePoke } from "@/src/lib/hooks/usePoke";

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
    
    const [
        poke1,
        isPokeLoading,,
        poke2,
        changePokes,
    ] = usePoke(selectedLang, allGens.filter(gen => selectedGens.some(selected => gen.id === selected)));
    const [previousAnswer, setPreviousAnswer] = useState<Pokemon | null>(null);
    const [pokeHasToChange, setPokeHasToChange] = useState(true);
    const [guessingPos, setGuessingPos] = useState<PokePos | null>(null);

    const pokeToDisplay = useMemo(
        () => guessingPos === PokePos.next ? poke1 : poke2,
        [guessingPos, poke1, poke2]
    );

    const pokeToGuess = useMemo(
        () => guessingPos === PokePos.next ? poke2 : poke1,
        [guessingPos, poke1, poke2]
    );
    
    const [currentInput, setCurrentInput] = useState('');
    const [submitFeedback, setSubmitFeedback] = useState('');
    
    const [streakCount, setStreakCount] = useState(0);
    const [bestStreakKey, setBestStreakKey] = useState('');

    const [isTimerPaused, setTimerPaused] = useState(false);
    const [timerResetKey, setTimerResetKey] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    // fetch image
    useEffect(() => {
        if (!pokeHasToChange || isPokeLoading || selectedGens.length === 0 || !selectedLang) return;

        changePokes();
        setPokeHasToChange(false);
        // Go previous or next at random
        setGuessingPos(
            Math.random() < 0.5
            ? PokePos.prev
            : PokePos.next
        );
    }, [allGens, selectedGens, selectedLang, pokeHasToChange, isPokeLoading, changePokes]);

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
        if (!currentInput || isPokeLoading || !pokeToGuess) return;

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
    }, [currentInput, pokeToGuess, isPokeLoading]);

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
                        <PokeInfoDisplayer
                            pokemon={pokeHasToChange || isPokeLoading ? null : pokeToDisplay}
                            infoType={PokeInfoOptions.Image}
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
