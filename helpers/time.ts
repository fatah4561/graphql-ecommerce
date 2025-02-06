export function isValidTimeFormat(time: string): boolean {
    return /^\d{2}:\d{2}:\d{2}$/.test(time);
}
