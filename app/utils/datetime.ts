import { CalendarDate } from '@internationalized/date';

/********************************************************************************************************************
 * conversion from CalendarDate to number of days since year 0
 ********************************************************************************************************************/
function calendarDateToEpochDays(date: CalendarDate): number {
  const y = date.year;
  const m = date.month;
  const d = date.day;

  // using Gregorian calendar days math approximation
  return y * 365 + Math.floor((y + 3) / 4) - Math.floor((y + 99) / 100) + Math.floor((y + 399) / 400) + (m - 1) * 30 + d;
}

/********************************************************************************************************************
 * get duration of 'from' - 'to' in months/weeks/days
 ********************************************************************************************************************/
export function getRelativeTime(from: CalendarDate, to: CalendarDate): string {
  const past = to.compare(from) < 0;

  // convert both to days since epoch for rough diff
  const fromEpoch = calendarDateToEpochDays(from);
  const toEpoch = calendarDateToEpochDays(to);
  const diffDays = Math.abs(toEpoch - fromEpoch);

  const weeks = Math.floor(diffDays / 7);
  const months = Math.floor(diffDays / 30); // rough approx 30 days per mth

  let result = '';
  if (months >= 1) {
    result = `~${months} month${months !== 1 ? 's' : ''}`;
  } else if (weeks >= 1) {
    result = `~${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else {
    result = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  }

  return past ? `${result} ago` : `in ${result}`;
}

/********************************************************************************************************************
 * convert Date to CalendarDate
 ********************************************************************************************************************/
export function dateToCalendarDate(from: Date): CalendarDate {
  return new CalendarDate(
    from.getFullYear(),
    from.getMonth() + 1, // JS Date months are 0-based
    from.getDate()
  );
}

/********************************************************************************************************************
 * format Date to YYYY-MM-DD in local time
 ********************************************************************************************************************/
export function formatDateToISO(date: Date): string {
  return date.toLocaleDateString('sv-SE'); // 'sv-SE' gives ISO-like format: YYYY-MM-DD
}

/********************************************************************************************************************
 * add given number of days to a given Date
 ********************************************************************************************************************/
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/********************************************************************************************************************
 * returns the number of days between two dates
 * e.g. (May 2 - May 4) returns 2
 ********************************************************************************************************************/
export function getDaysBetween(start: Date, end: Date): number {
  const startTime = start.setHours(0, 0, 0, 0);
  const endTime = end.setHours(0, 0, 0, 0);
  const diffInMs = Math.abs(endTime - startTime);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}