import { FormEvent, HTMLInputTypeAttribute, useEffect } from "react";

interface UniversalInputProps {
    inputValue: string
    inputChangeCallback: (newValue: string) => void
    submitCallback: () => void
    type: HTMLInputTypeAttribute
}

export default function UniversalInput({
    inputValue,
    inputChangeCallback,
    submitCallback,
    type
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
        if (type === 'number') {
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

        if (!castedEvent.key.match(/[0-9]/g)) event.preventDefault()
    }

    return (
        <input
            id="universalInput"
            type={type}
            value={formatValue(inputValue)}
            onKeyDown={(e) => { if(e.key === 'Enter') submitCallback() }}
            onInput={handleOnInput}
            onBeforeInput={handleBeforeInput}
        />
    )
}