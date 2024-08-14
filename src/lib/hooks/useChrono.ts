import { Dispatch, useCallback, useEffect, useState } from "react";

export function useChrono(
    refreshRate: number = 10, // 0.01 second
): [
    number,
    Dispatch<void>,
    Dispatch<void>,
    Dispatch<void>,
    boolean,
] {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [paused, setPaused] = useState(false);
    const [lastUpdateDate, setLastUpdateDate] = useState(Date.now());

    // Timer handler
    useEffect(() => {
        const interval = paused
        ? setInterval(() => {
            setLastUpdateDate(Date.now());
        }, refreshRate)
        : setInterval(() => {
            setElapsedTime(prevTime => prevTime + Date.now() - lastUpdateDate);
            setLastUpdateDate(Date.now());
        }, refreshRate);

        return () => clearInterval(interval)
    }, [refreshRate, paused, lastUpdateDate]);

    const resume: Dispatch<void> = useCallback(() => {
        setPaused(false);
    }, []);

    const pause: Dispatch<void> = useCallback(() => {
        setPaused(true);
    }, []);

    const reset: Dispatch<void> = useCallback(() => {
        setElapsedTime(0);
    }, []);

    return [elapsedTime, resume, pause, reset, paused];
}
