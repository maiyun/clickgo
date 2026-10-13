import type * as lCore from '../core';
import type * as lTool from '../tool';
import { callPersistence } from '../native';

/** --- 小型配置允许保存的 JSON 数据 --- */
export type TJson = lTool.TJson;

/** --- 包装实际值，false/null 数据不会与失败/未找到混淆 --- */
export interface IStoredValue<T extends TJson = TJson> {
    'value': T;
}

/**
 * --- 读取当前 App 的持久配置，按 config.id 隔离 ---
 * @param current 当前 App
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @returns JSON 值包装；未找到为 null，缺少有效 App ID、宿主或读取失败为 false
 */
export async function get<T extends TJson = TJson>(
    current: lCore.TCurrent, key: string
): Promise<IStoredValue<T> | null | false> {
    const result = await callPersistence(current, 'storage', 'get', key);
    if (result === false || result === null) {
        return result;
    }
    if (!result || typeof result !== 'object' || !Object.hasOwn(result, 'value')) {
        return false;
    }
    return result as IStoredValue<T>;
}

/**
 * --- 保存当前 App 的持久配置，按 config.id 隔离 ---
 * @param current 当前 App
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @param value JSON 配置值，完整记录最大 1 MiB
 * @returns 是否保存成功，普通网页或不支持此接口的宿主为 false
 */
export async function set(current: lCore.TCurrent, key: string, value: TJson): Promise<boolean> {
    return await callPersistence(current, 'storage', 'set', key, value) === true;
}

/**
 * --- 删除当前 App 的持久配置，按 config.id 隔离 ---
 * @param current 当前 App
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @returns 是否删除成功，未找到时也返回成功
 */
export async function remove(current: lCore.TCurrent, key: string): Promise<boolean> {
    return await callPersistence(current, 'storage', 'remove', key) === true;
}
