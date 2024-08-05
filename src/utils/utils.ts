export function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatNumberToMinNdigits(numberToFormat: number, n: number): string {
    if (n <= 0) {
        return numberToFormat.toString()
    }
    
    let result = ''
    
    for (let i = 1; i < n; i++) {
        result += '0'
    }
    
    result = (result + numberToFormat).slice(-n)
    
    return result
}

export function displayTimer(totalMilliseconds: number) {
    const milliseconds = formatNumberToMinNdigits(totalMilliseconds % 1000, 3);
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const seconds = formatNumberToMinNdigits(totalSeconds % 60, 2);
    const totalMinutes = Math.floor(totalSeconds / 60);

    return `${totalMinutes}:${seconds}.${milliseconds}`;
}
