/**
 * Checks if the given string is a valid time in the format HH:MM:SS.
 *
 * @param time - The time string to check.
 * @returns `true` if the time is valid, `false` otherwise.
 */
export function isValidTimeFormat(time: string): boolean {
    return /^\d{2}:\d{2}:\d{2}$/.test(time);
}
