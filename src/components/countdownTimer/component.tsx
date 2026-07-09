import { useEffect } from "react";

import { useCountdownTimer } from "@/lib/hooks/useCountdownTimer";
import { displayTimer } from "@/utils/utils";

import "./countdownTimer.css";

interface CountdownTimerProps {
    startTime: number
    paused: boolean
    resetKey: number
    timeOverCallback?: () => void
}

export default function CountdownTimer({
    startTime,
    paused,
    resetKey,
    timeOverCallback
}: CountdownTimerProps)  {
    const [timer, resumeTimer, pauseTimer, resetTimer] = useCountdownTimer(startTime, timeOverCallback);

    useEffect(() => {
        paused ? pauseTimer() : resumeTimer();
    }, [paused, pauseTimer, resumeTimer]);

    useEffect(() => {
        resetTimer();
    }, [resetKey, resetTimer]);

    return <div className="timerContainer">
        {displayTimer(timer).slice(0, -1)}
    </div>;
}
