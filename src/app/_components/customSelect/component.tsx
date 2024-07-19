import { ChangeEvent } from "react"

import "./customSelect.css"

interface CustomSelectProps {
    value: string
    options: {
        value: string
        label: string
    }[]
    disabledValues: string[]
    onChangeCallback: (e: ChangeEvent<HTMLSelectElement>) => void
}

export default function CustomSelect({
    value,
    options,
    disabledValues,
    onChangeCallback
}: CustomSelectProps) {
    const getSelect = () => {
        const builtOptions: JSX.Element[] = []

        for (let i = 0; i < options.length; i++) {
            builtOptions.push(<option
                value={options[i].value}
                key={options[i].label}
                disabled={disabledValues.includes(options[i].value)}
            >
                {options[i].label}
            </option>)
        }

        return <select
            className="customSelect"
            name="pokeGuessOptions"
            value={value}
            onChange={onChangeCallback}
        >{builtOptions}</select>
    }

    return <>{ getSelect() }</>
}