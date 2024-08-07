import "./customSlider.css"

interface CustomSliderProps {
    min: number
    max: number
    value: number
    displayValue: string
    label: string
    onChange: (e: number) => void
    disabled?: boolean
}

// Values of min, max and value are in seconds
export default function CustomSlider({
    min,
    max,
    value,
    displayValue,
    label,
    onChange,
    disabled
}: CustomSliderProps) {
    return <div className={disabled ? "disabledValue customSlider" : "customSlider"}>
        <p>{label}</p>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value))} disabled={disabled} />
        <div className="inputValue">{displayValue}</div>
    </div>
}
