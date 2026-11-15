function isCalendarDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isDateInTripRange(date: string, startDate: string, endDate: string): boolean {
    return isCalendarDate(date) && date >= startDate && date <= endDate;
}

export function getTripDates(startDate: string, endDate: string): string[] {
    if (!isCalendarDate(startDate) || !isCalendarDate(endDate) || startDate > endDate) return [];

    const dates: string[] = [];
    const current = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);

    // UTCで加算し、タイムゾーンや夏時間による日付のずれを防ぐ。
    while (current <= end) {
        dates.push(current.toISOString().slice(0, 10));
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
}
