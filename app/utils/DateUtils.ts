export function toJulianDay(date: Date): number {
  const time = date.getTime();
  return Math.floor(time / 86400000) + 2440588;
}
