/**
 * does not accept tailing letters, such as 123f
 */
export function isNumStrict(s: string): boolean {
    return s.trim() !== '' && !isNaN(+s)
}

/**
 * does not accept tailing letters, such as 123f
 * eg 12asd -> null
 */
export function parseNumStrict(s: string): number | null{
    const num = +s;
    if (s.trim() !== '' && !isNaN(num)) {
        return num;
    }
    else return null;
}