import * as range from '../abox/range';

/** --- 内置快捷范围；天数含今天，月份从回退自然月的次日起算 --- */
export type Shortcut = 'today' | 'last3days' | 'last7days' | 'thismonth' | 'last1month' | 'last3months' | 'last6months';

/**
 * --- 按指定时区计算完整日期范围，精度与日期面板一致为秒 ---
 * @param shortcut 快捷范围
 * @param now 当前毫秒时间戳
 * @param tz 固定时区偏移小时
 * @returns 开始日 00:00:00 至今天 23:59:59 的毫秒时间戳
 */
export function getRange(shortcut: Shortcut, now: number, tz: number): [number, number] {
    return range.getRange(shortcut, now, tz);
}

/**
 * --- 将范围裁到允许的起止时间，沿用日期面板的秒/毫秒边界参数 ---
 * @param value 毫秒范围
 * @param start 可选下界，省略时使用日期面板默认的 1900 年 UTC 起点
 * @param end 可选上界，省略时不裁剪结束值
 * @returns 有效交集；无交集或无效值返回 null
 */
export function restrictRange(
    value: [number, number], start?: number | string, end?: number | string
): [number, number] | null {
    return range.restrictRange(value, start, end);
}

/**
 * --- 保留指定时区的日期并设置时分秒 ---
 * @param value 毫秒时间戳
 * @param tz 时区偏移小时
 * @param time 六位时分秒，如 091500
 * @returns 设置时间后的毫秒时间戳
 */
export function withTime(value: number, tz: number, time: string): number {
    return range.withTime(value, tz, time);
}
