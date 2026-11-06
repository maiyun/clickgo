import type { Shortcut } from '../lib/range';

export function getRange(shortcut: Shortcut, now: number, tz: number): [number, number] {
    const offset = tz * 3_600_000;
    const first = new Date(now + offset);
    first.setUTCHours(0, 0, 0, 0);
    const last = new Date(first);
    last.setUTCHours(23, 59, 59, 0);
    if (shortcut === 'last3days' || shortcut === 'last7days') {
        first.setUTCDate(first.getUTCDate() - (shortcut === 'last3days' ? 2 : 6));
    }
    else if (shortcut === 'thismonth') {
        first.setUTCDate(1);
    }
    else if (shortcut !== 'today') {
        const months = { last1month: 1, last3months: 3, last6months: 6 }[shortcut];
        const day = first.getUTCDate();
        first.setUTCDate(1);
        first.setUTCMonth(first.getUTCMonth() - months);
        const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
        first.setUTCDate(Math.min(day, daysInMonth) + 1);
    }
    return [first.getTime() - offset, last.getTime() - offset];
}

export function restrictRange(value: [number, number], start?: number | string, end?: number | string): [number, number] | null {
    const boundary = (value: number | string): number => {
        const number = Number(value);
        return number.toString().length < 13 ? number * 1000 : number;
    };
    const lower = start === undefined ? Date.UTC(1900, 0, 1) : boundary(start);
    const upper = end === undefined ? Infinity : boundary(end);
    const first = Math.max(value[0], lower);
    const last = Math.min(value[1], upper);
    return Number.isFinite(first) && Number.isFinite(last) && first <= last ? [first, last] : null;
}

export function withTime(value: number, tz: number, time: string): number {
    const date = new Date(value + tz * 3_600_000);
    date.setUTCHours(Number(time.slice(0, 2)), Number(time.slice(2, 4)), Number(time.slice(4)), 0);
    return date.getTime() - tz * 3_600_000;
}
