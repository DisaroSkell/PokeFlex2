import { createRef, useEffect } from "react";

interface UniversalInputProps {
    inputValue: string
    inputChangeCallback: (newValue: string) => void
    submitCallback: () => void
    type: string
}

export default function UniversalInput({
    inputValue,
    inputChangeCallback,
    submitCallback,
    type
}: UniversalInputProps) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            document.getElementById("universalInput")?.focus();
        }

        document.addEventListener('keydown', handleKeyDown, true);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [])

    return (
        <input
            id="universalInput"
            type={type}
            value={inputValue}
            onChange={(e) => inputChangeCallback(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') submitCallback() }}
        />
    )
}