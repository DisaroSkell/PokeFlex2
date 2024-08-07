import { displayTimer } from "@/src/utils/utils"

import "./timeSlider.css"

interface TimeSliderProps {
    min: number
    max: number
    value: number
    label: string
    onChange: (e: number) => void
}

// Values of min, max and value are in seconds
export default function TimeSlider({
    min,
    max,
    value,
    label,
    onChange
}: TimeSliderProps) {
    return <div className="timerSlider">
        <p>{label}</p>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value))} />
        <div className="inputValue">{displayTimer(value * 1000).slice(0, -4)}</div>
    </div>
}
