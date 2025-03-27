/**
 * get user's local timezone
 */
export function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * get the user's current locale (e.g. 'en-US', 'fr-FR').
 */
export function getLocale(): string {
  return navigator.language || 'en-US';
}

/**
 * get epoch day (number of days since Jan 1, 1970) in the user's local timezone
 */
export function toEpochDay(date: Date): number {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(localMidnight.getTime() / 86400000);
}