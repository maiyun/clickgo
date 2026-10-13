import * as lPersistence from './persistence.js';

export type { TJson, IStoredValue } from './persistence.js';

/**
 * --- 从当前软件的用户数据目录读取配置 ---
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @param appId 固定 App ID；省略时使用软件级存储
 * @returns 包装后的 JSON 值；没有记录为 null，读取失败为 false
 */
export function get<T extends lPersistence.TJson = lPersistence.TJson>(
    key: string, appId?: string
): Promise<lPersistence.IStoredValue<T> | null | false> {
    return lPersistence.run('storage', key, async (file): Promise<lPersistence.IStoredValue<T> | null | false> => {
        const data = await lPersistence.read(file);
        if (data === null || data === false) {
            return data;
        }
        const record: unknown = JSON.parse(data.toString('utf8'));
        if (!record || typeof record !== 'object' || Array.isArray(record) ||
            !Object.hasOwn(record, 'value') || !lPersistence.isJson((record as lPersistence.IStoredValue).value)) {
            return false;
        }
        return { 'value': (record as lPersistence.IStoredValue<T>).value };
    }, appId);
}

/**
 * --- 保存小型 JSON 配置，成功后数据已经写入磁盘 ---
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @param value 配置值，支持 false/null 数据，完整记录最大 1 MiB
 * @param appId 固定 App ID；省略时使用软件级存储
 * @returns 是否保存成功；非法数据或写入失败为 false
 */
export function set(key: string, value: lPersistence.TJson, appId?: string): Promise<boolean> {
    let data: Buffer;
    try {
        if (!lPersistence.isJson(value)) {
            return Promise.resolve(false);
        }
        data = Buffer.from(JSON.stringify({ 'value': value }));
    }
    catch {
        return Promise.resolve(false);
    }
    return lPersistence.run('storage', key, (file) => lPersistence.write(file, data), appId);
}

/**
 * --- 删除配置，未找到时也返回成功 ---
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @param appId 固定 App ID；省略时使用软件级存储
 * @returns 是否删除成功
 */
export function remove(key: string, appId?: string): Promise<boolean> {
    return lPersistence.run('storage', key, lPersistence.remove, appId);
}
