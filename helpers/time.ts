import { DateTime } from 'luxon';
import { appConfig } from './app_config';

/**
 * Checks if the given string is a valid time in the format HH:MM:SS.
 *
 * @param time - The time string to check.
 * @returns `true` if the time is valid, `false` otherwise.
 */
export function isValidTimeFormat(time: string): boolean {
    return /^\d{2}:\d{2}:\d{2}$/.test(time);
}

/**
 * Returns the timezone offset in the specified format for the given timezone.
 *
 * @param timeZone - The timezone for which to get the offset.
 * @param format - The format string for the timezone offset. "ZZ" -> "+07:00", "ZZZ" -> "+0700"
 * @returns The timezone offset as a string.
 */
export function timezoneOffset(timeZone: string, format: string): string {
    const dt = DateTime.now().setZone(timeZone);
    return dt.toFormat(format); // e.g. "+07:00"
}

/**
 * Returns the current timezone offset in the "ZZZ" format (+0700).
 *
 * @returns The current timezone offset as a string.
 */
export function currentTimezoneOffset(): string {
    return timezoneOffset(appConfig().timezone, "ZZZ")
}