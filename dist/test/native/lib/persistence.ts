import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { app } from 'electron';
import * as lAboxPersistence from '../abox/persistence.js';

/** --- 普通配置只接受可稳定跨进程传输的 JSON 值 --- */
export type TJson = null | boolean | number | string | TJson[] | { [key: string]: TJson; };

/** --- 包装存储值，以便将 false/null 数据与失败/未找到区分 --- */
export interface IStoredValue<T extends TJson = TJson> {
    'value': T;
}

/** --- 按文件串行化当前进程的读写，同一个键不能被并发操作打断 --- */
const pending = new Map<string, Promise<unknown>>();

/** --- 小型配置和加密记录的磁盘大小上限 --- */
export const maxBytes = 1024 * 1024;

/**
 * --- 拒绝循环、非 JSON 类型和可执行属性，不调用 getter 或 toJSON ---
 * @param value 待存储数据
 * @param seen 已访问的容器
 * @param depth 当前嵌套深度
 * @returns 是否是有限、普通的 JSON 数据；最大深度 32，不允许稀疏数组、附加属性、访问器或类实例
 */
export function isJson(value: unknown, seen = new Set<object>(), depth = 0): value is TJson {
    return lAboxPersistence.isJson(value, seen, depth);
}

/**
 * --- 创建并核实私有数据目录，不接受符号链接 ---
 * @param directory 数据目录
 * @returns 是否可使用
 */
async function prepare(directory: string): Promise<boolean> {
    return lAboxPersistence.prepare(directory);
}

/**
 * --- 取得私有文件中的完整记录，错误由调用边界转换 ---
 * @param file 已确定的记录路径
 * @returns 内容，缺少记录为 null，不安全文件为 false
 */
export async function read(file: string): Promise<Buffer | null | false> {
    return lAboxPersistence.read(file, maxBytes);
}

/**
 * --- 写临时文件并替换原记录，写入失败不破坏已有数据 ---
 * @param file 已确定的记录路径
 * @param data 完整记录
 * @returns 写入完成
 */
export async function write(file: string, data: Buffer): Promise<boolean> {
    return lAboxPersistence.write(file, data, maxBytes);
}

/**
 * --- 删除一个记录；不存在的键视为已经删除 ---
 * @param file 已确定的记录路径
 * @returns 是否删除成功
 */
export async function remove(file: string): Promise<boolean> {
    return lAboxPersistence.remove(file);
}

/**
 * --- 将业务键限定在软件数据目录，统一处理文件和加密异常 ---
 * @param area 普通配置或敏感数据
 * @param key 稳定存储键，与 taskId 无关
 * @param operation 对当前键的操作
 * @param appId 固定 App ID；省略时使用主进程的软件级存储
 * @returns 操作结果，路径、权限或读写异常为 false
 */
export async function run<T>(area: 'storage' | 'secret', key: string,
    operation: (file: string) => Promise<T>, appId?: string): Promise<T | false> {
    // --- 键只参与文件名哈希，允许 Unicode 和分隔符；损坏的 UTF-16 字符串不能映射为同一 UTF-8 键 ---
    if (typeof key !== 'string' || !key || key.length > 128 || Buffer.from(key, 'utf8').toString('utf8') !== key) {
        return false;
    }
    if (appId !== undefined && (typeof appId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(appId))) {
        return false;
    }
    let directory: string;
    try {
        directory = join(app.getPath('userData'), 'clickgo-native');
    }
    catch {
        return false;
    }
    const parent = directory;
    const apps = join(parent, 'apps');
    // --- 固定 ID 与安装位置、显示名称和版本无关；不同 App 和宿主不能因使用同名键而互相覆盖 ---
    if (appId !== undefined) {
        directory = join(apps, createHash('sha256').update(appId).digest('hex'));
    }
    const scope = directory;
    directory = join(directory, area);
    const file = join(directory, `${createHash('sha256').update(key).digest('hex')}.dat`);
    const previous = pending.get(file) ?? Promise.resolve();
    const result = previous.then(async (): Promise<T | false> => {
        try {
            if (!await prepare(parent)) {
                return false;
            }
            if (appId !== undefined && (!await prepare(apps) || !await prepare(scope))) {
                return false;
            }
            if (!await prepare(directory)) {
                return false;
            }
            return await operation(file);
        }
        catch {
            // --- 包括存储损坏、磁盘错误和密钥服务异常，均不泄露数据或覆盖原记录 ---
            return false;
        }
    });
    pending.set(file, result);
    return result.finally((): void => {
        if (pending.get(file) === result) {
            pending.delete(file);
        }
    });
}
