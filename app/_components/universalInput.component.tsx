import { createRef, useEffect } from "react";

interface UniversalInputProps {
    inputValue: string
    inputChangeCallback: (newValue: string) => void
    submitCallback: () => void
    type: string
}

export default function UniversalInput(props: UniversalInputProps) {
    const inputRef = createRef<HTMLInputElement>();

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Enter') {
                props.submitCallback();
                return;
            }
    
            inputRef.current?.focus();
        }

        document.addEventListener('keydown', handleKeyDown, true);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [inputRef, props])

    return (
        <input
            ref={inputRef}
            type={props.type}
            value={props.inputValue}
            onChange={(e) => props.inputChangeCallback(e.target.value)}
        />
    )
}