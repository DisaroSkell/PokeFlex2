'use client';

import { useTranslation } from "react-i18next";

import CustomSelect from "../customSelect/component";

import { PokeGuessOptions, PokeInfoOptions } from "@/src/types/pokemon.type";

import "./quizOptionsSelectors.css"

interface QuizOptionsSelectorsProps {
    infoOptionValue: PokeInfoOptions
    onInfoOptionChange: (newValue: PokeInfoOptions) => void
    guessOptionValue: PokeGuessOptions
    onGuessOptionChange: (newValue: PokeGuessOptions) => void
}

export default function QuizOptionsSelectors({
    infoOptionValue,
    onInfoOptionChange,
    guessOptionValue,
    onGuessOptionChange
}: QuizOptionsSelectorsProps) {
    const { t } = useTranslation();

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
            })
        }

        return options;
    }

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
            })
        }

        return options;
    }

    return <div className="quizSelectors pokeCard">
        <h2>{t("common:select-info-option")}</h2>
        <CustomSelect
            value={infoOptionValue}
            options={getPokeInfoOptions()}
            disabledValues={[guessOptionValue]}
            onChangeCallback={e => {
                const foundOption = Object.values(PokeInfoOptions).find(option => option.valueOf() === e.target.value)

                if (foundOption) {
                    onInfoOptionChange(foundOption)
                }
            }}
        />
        <h2>{t("common:select-guess-option")}</h2>
        <CustomSelect
            value={guessOptionValue}
            options={getPokeGuessOptions()}
            disabledValues={[infoOptionValue]}
            onChangeCallback={e => {
                const foundOption = Object.values(PokeGuessOptions).find(option => option.valueOf() === e.target.value)

                if (foundOption) {
                    onGuessOptionChange(foundOption)
                }
            }}
        />
    </div>
}