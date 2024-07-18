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
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const universalInput = document.getElementById("universalInput") as HTMLInputElement;

            if (universalInput && universalInput !== document.activeElement && e.key !== 'Tab') {
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

        return () => document.removeEventListener('keydown', handleKeyDown);
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

        inputChangeCallback(input);
    }

    function handleBeforeInput(event: FormEvent<HTMLInputElement>) {
        const castedEvent = event.nativeEvent as KeyboardEvent

        if (convertGuessTypeToInputType(guessType) === "number" && !castedEvent.key.match(/[0-9]/g)) event.preventDefault()
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

    return (
        <input
            className="customInput"
            id="universalInput"
            type={convertGuessTypeToInputType(guessType)}
            value={formatValue(inputValue)}
            onKeyDown={(e) => { if(e.key === 'Enter') submitCallback() }}
            onInput={handleOnInput}
            onBeforeInput={handleBeforeInput}
        />
    )
}