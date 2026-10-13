import { constants } from 'node:fs';
import { lstat, mkdir, open, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { app } from 'electron';
/** --- 按文件串行化当前进程的读写，同一个键不能被并发操作打断 --- */
const pending = new Map();
/** --- 小型配置和加密记录的磁盘大小上限 --- */
export const maxBytes = 1024 * 1024;
/**
 * --- 拒绝循环、非 JSON 类型和可执行属性，不调用 getter 或 toJSON ---
 * @param value 待存储数据
 * @param seen 已访问的容器
 * @param depth 当前嵌套深度
 * @returns 是否是有限、普通的 JSON 数据
 */
export function isJson(value, seen = new Set(), depth = 0) {
    if (depth > 32) {
        return false;
    }
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
        return true;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value);
    }
    if (typeof value !== 'object' || seen.has(value) || Object.getOwnPropertySymbols(value).length) {
        return false;
    }
    const array = Array.isArray(value);
    const prototype = Object.getPrototypeOf(value);
    if (!array && prototype !== Object.prototype && prototype !== null) {
        return false;
    }
    seen.add(value);
    const descriptors = Object.getOwnPropertyDescriptors(value);
    if (array && Object.keys(value).length !== value.length) {
        return false;
    }
    if (array) {
        for (let index = 0; index < value.length; ++index) {
            if (!Object.hasOwn(value, index)) {
                return false;
            }
        }
    }
    for (const key of Object.keys(descriptors)) {
        if (array && key === 'length') {
            continue;
        }
        const descriptor = descriptors[key];
        if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value') ||
            !isJson(descriptor.value, seen, depth + 1)) {
            return false;
        }
    }
    seen.delete(value);
    return true;
}
/**
 * --- 创建并核实私有数据目录，不接受符号链接 ---
 * @param directory 数据目录
 * @returns 是否可使用
 */
async function prepare(directory) {
    await mkdir(directory, { 'recursive': true, 'mode': 0o700 });
    const stat = await lstat(directory);
    return stat.isDirectory() && !stat.isSymbolicLink() &&
        (process.platform === 'win32' || stat.uid === process.getuid?.() && (stat.mode & 0o077) === 0);
}
/**
 * --- 取得私有文件中的完整记录，错误由调用边界转换 ---
 * @param file 已确定的记录路径
 * @returns 内容，缺少记录为 null，不安全文件为 false
 */
export async function read(file) {
    let handle;
    try {
        const stat = await lstat(file);
        if (!stat.isFile() || stat.isSymbolicLink()) {
            return false;
        }
        handle = await open(file, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    }
    catch (error) {
        return error.code === 'ENOENT' ? null : false;
    }
    try {
        const stat = await handle.stat();
        if (!stat.isFile() || stat.size > maxBytes ||
            process.platform !== 'win32' && (stat.uid !== process.getuid?.() || (stat.mode & 0o077) !== 0)) {
            return false;
        }
        const data = await handle.readFile();
        return data.length <= maxBytes ? data : false;
    }
    finally {
        await handle.close();
    }
}
/**
 * --- 写临时文件并替换原记录，写入失败不破坏已有数据 ---
 * @param file 已确定的记录路径
 * @param data 完整记录
 * @returns 写入完成
 */
export async function write(file, data) {
    if (data.length > maxBytes) {
        return false;
    }
    const temporary = `${file}.${randomUUID()}.tmp`;
    try {
        const handle = await open(temporary, 'wx', 0o600);
        try {
            await handle.writeFile(data);
            await handle.sync();
        }
        finally {
            await handle.close();
        }
        await rename(temporary, file);
        return true;
    }
    finally {
        await unlink(temporary).catch(() => { });
    }
}
/**
 * --- 删除一个记录；不存在的键视为已经删除 ---
 * @param file 已确定的记录路径
 * @returns 是否删除成功
 */
export async function remove(file) {
    try {
        await unlink(file);
        return true;
    }
    catch (error) {
        return error.code === 'ENOENT';
    }
}
/**
 * --- 将业务键限定在软件数据目录，统一处理文件和加密异常 ---
 * @param area 普通配置或敏感数据
 * @param key 稳定存储键，与 taskId 无关
 * @param operation 对当前键的操作
 * @param appId 固定 App ID；省略时使用主进程的软件级存储
 * @returns 操作结果，路径、权限或读写异常为 false
 */
export async function run(area, key, operation, appId) {
    // --- 键只参与文件名哈希，允许 Unicode 和分隔符；损坏的 UTF-16 字符串不能映射为同一 UTF-8 键 ---
    if (typeof key !== 'string' || !key || key.length > 128 || Buffer.from(key, 'utf8').toString('utf8') !== key) {
        return false;
    }
    if (appId !== undefined && (typeof appId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(appId))) {
        return false;
    }
    let directory;
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
    const result = previous.then(async () => {
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
    return result.finally(() => {
        if (pending.get(file) === result) {
            pending.delete(file);
        }
    });
}
