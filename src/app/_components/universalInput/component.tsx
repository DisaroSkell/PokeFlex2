import { cp } from "fs";
import { ChangeEvent, FormEvent, HTMLInputTypeAttribute, useEffect } from "react";

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

            return isNaN(castedValue) ? 0 : castedValue
        }

        return value
    }

    return (
        <input
            id="universalInput"
            type={type}
            value={formatValue(inputValue)}
            onChange={e => inputChangeCallback(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') submitCallback() }}
        />
    )
}