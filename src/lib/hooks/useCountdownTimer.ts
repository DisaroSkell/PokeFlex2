import { Dispatch, useCallback, useEffect, useState } from "react";

export function useCountdownTimer(
    startTime: number = 60000, // 1 minute
    timeOverCallback?: () => void,
    refreshRate: number = 10, // 0.01 second
): [
    number,
    Dispatch<void>,
    Dispatch<void>,
    Dispatch<void>,
    boolean,
] {
    const [remainingTime, setRemainingTime] = useState(startTime);
    const [paused, setPaused] = useState(false);
    const [lastUpdateDate, setLastUpdateDate] = useState(Date.now());

    // Timer handler
    useEffect(() => {
        const interval = paused
        ? setInterval(() => {
            setLastUpdateDate(Date.now());
        }, refreshRate)
        : setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime - (Date.now() - lastUpdateDate) <= 0) {
                    setPaused(true);
                    return 0;
                }

                return prevTime - (Date.now() - lastUpdateDate);
            });
            setLastUpdateDate(Date.now());
        }, refreshRate);

        return () => clearInterval(interval)
    }, [refreshRate, paused, lastUpdateDate, timeOverCallback]);

    useEffect(() => {
        if (remainingTime === 0 && timeOverCallback) timeOverCallback();
    // Call this when timeOverCallback is updated wouldn't be relevant
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remainingTime]);

    const resume: Dispatch<void> = useCallback(() => {
        setPaused(false);
    }, []);

    const pause: Dispatch<void> = useCallback(() => {
        setPaused(true);
    }, []);

    const reset: Dispatch<void> = useCallback(() => {
        setRemainingTime(startTime);
    }, [startTime]);

    return [remainingTime, resume, pause, reset, paused];
}
