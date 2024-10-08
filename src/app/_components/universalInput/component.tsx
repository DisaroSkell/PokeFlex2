'use client'

import { FormEvent, HTMLInputTypeAttribute, useEffect } from "react";

import { PokeGuessOptions } from "@/src/types/pokemon.type";

import "./universalInput.css"

interface UniversalInputProps {
    inputValue: string
    inputChangeCallback: (newValue: string) => void
    submitCallback: () => void
    guessType: PokeGuessOptions
}

export default function UniversalInput({
    inputValue,
    inputChangeCallback,
    submitCallback,
    guessType
}: UniversalInputProps) {
    // "Enter for submit" listener
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const universalInput = document.getElementById("universalInput") as HTMLInputElement;

            if (universalInput && universalInput !== document.activeElement && e.key.match(/^[\p{L}0-9]$/gu)) {
                universalInput.focus();
                if (universalInput.type === 'number') {
                    universalInput.type = 'text';
                    universalInput.setSelectionRange(universalInput.value.length, universalInput.value.length)
                    universalInput.type = 'number';
                } else {
                    universalInput.setSelectionRange(universalInput.value.length, universalInput.value.length)
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown, true);

        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [])

    function formatValue(value: string) {
        if (convertGuessTypeToInputType(guessType) === 'number') {
            const castedValue = parseInt(value)

            return isNaN(castedValue) ? '' : castedValue.toString()
        }

        return value
    }

    function handleOnInput(event: FormEvent<HTMLInputElement>) {
        let input = event.currentTarget.value;

        // Limit input number size
        if (!(convertGuessTypeToInputType(guessType) === "number")
            || input.length < 10) inputChangeCallback(input);
    }

    function handleBeforeInput(event: React.CompositionEvent<HTMLInputElement>) {
        if (!event.data) {
            console.error("Couldn't read pressed key");
            return;
        }

        if (convertGuessTypeToInputType(guessType) === "number"
            && !event.data.match(/[0-9]/g)) event.preventDefault();
        else if (!event.data.match(/^[\p{L}0-9]$/gu)) event.preventDefault();
    }

    function convertGuessTypeToInputType (guessType: PokeGuessOptions): HTMLInputTypeAttribute {
        switch(guessType) {
            case PokeGuessOptions.ID:
                return "number";
            case PokeGuessOptions.Name:
                return "text";
            case PokeGuessOptions.Types:
                return "text";
        }
    }

    return <input
        className="customInput"
        id="universalInput"
        maxLength={20}
        type={convertGuessTypeToInputType(guessType)}
        value={formatValue(inputValue)}
        onKeyUp={(e) => { if(e.key === 'Enter') submitCallback() }}
        onInput={handleOnInput}
        onBeforeInput={handleBeforeInput}
    />
}