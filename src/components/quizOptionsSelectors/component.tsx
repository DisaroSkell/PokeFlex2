import { type ChangeEvent, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectQuizOptionsSetting, setQuizOptionsSetting } from "@/lib/store/userSettings/userSettingsSlice";

import { PokeGuessOptions, PokeInfoOptions } from "@/types/pokemon.type";

import CustomSelect from "@/components/customSelect/component";

import "./quizOptionsSelectors.css";

const i18nNamespaces = ["quiz", "common"];

export default function QuizOptionsSelectors() {
    const { t } = useTranslation(i18nNamespaces);

    const dispatch = useAppDispatch();
    const quizOptionsSettings = useAppSelector(selectQuizOptionsSetting);

    const getPokeInfoOptions = () => {
        const pokeInfoKeys = Object.keys(PokeInfoOptions);
        const pokeInfoValues = Object.values(PokeInfoOptions);
        const options: {
            value: string,
            label: string
        }[] = [];

        for (let i = 0; i < pokeInfoKeys.length; i++) {
            options.push({
                value: pokeInfoValues[i],
                label: t(pokeInfoValues[i])
            });
        }

        return options;
    };

    const getPokeGuessOptions = () => {
        const pokeGuessKeys = Object.keys(PokeGuessOptions);
        const pokeGuessValues = Object.values(PokeGuessOptions);
        const options: {
            value: string,
            label: string
        }[] = [];

        for (let i = 0; i < pokeGuessKeys.length; i++) {
            options.push({
                value: pokeGuessValues[i],
                label: t(pokeGuessValues[i])
            });
        }

        return options;
    };

    const onChangeInfoOption = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const foundOption = Object.values(PokeInfoOptions).find(option => option.valueOf() === e.target.value);

        if (foundOption) {
            dispatch(setQuizOptionsSetting({
                infoOption: foundOption,
                guessOption: quizOptionsSettings.guessOption,
            }));
        }
    }, [dispatch, quizOptionsSettings]);

    const onChangeGuessOption = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const foundOption = Object.values(PokeGuessOptions).find(option => option.valueOf() === e.target.value);

        if (foundOption) {
            dispatch(setQuizOptionsSetting({
                infoOption: quizOptionsSettings.infoOption,
                guessOption: foundOption,
            }));
        }
    }, [dispatch, quizOptionsSettings]);

    return <div className="quizSelectors pokeCard">
        <h2>{t("common:select-info-option")}</h2>
        <CustomSelect
            value={quizOptionsSettings.infoOption}
            options={getPokeInfoOptions()}
            disabledValues={[quizOptionsSettings.guessOption]}
            onChangeCallback={onChangeInfoOption}
        />
        <h2>{t("common:select-guess-option")}</h2>
        <CustomSelect
            value={quizOptionsSettings.guessOption}
            options={getPokeGuessOptions()}
            disabledValues={[quizOptionsSettings.infoOption]}
            onChangeCallback={onChangeGuessOption}
        />
    </div>;
}
