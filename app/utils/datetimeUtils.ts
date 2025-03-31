export function getRelativeTime(from: Date, to: Date): string {
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = to.getTime() - from.getTime();
    const past = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const days = Math.floor(absDiff / msPerDay);
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remDays = days - (years * 365 + months * 30);

    const parts = [];
    if (years) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    if (remDays || (!years && !months)) parts.push(`${remDays} day${remDays !== 1 ? 's' : ''}`);

    const timeString = parts.join(' ');
    return past ? `${timeString} ago` : `in ${timeString}`;
}
