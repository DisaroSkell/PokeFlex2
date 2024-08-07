import { displayTimer } from "@/src/utils/utils"

import "./timeSlider.css"

interface TimeSliderProps {
    min: number
    max: number
    value: number
    label: string
    onChange: (e: number) => void
    disabled?: boolean
}

// Values of min, max and value are in seconds
export default function TimeSlider({
    min,
    max,
    value,
    label,
    onChange,
    disabled
}: TimeSliderProps) {
    return <div className={disabled ? "timerSlider disabledTimer" : "timerSlider"}>
        <p>{label}</p>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value))} disabled={disabled} />
        <div className="inputValue">{displayTimer(value * 1000).slice(0, -4)}</div>
    </div>
}
