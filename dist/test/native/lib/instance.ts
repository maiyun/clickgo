import { randomUUID } from 'node:crypto';
import { lstat, mkdir, open, readdir, rename, unlink } from 'node:fs/promises';
import { constants } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { IMcpInfo } from './mcp.js';

/** --- 当前运行实例；id 在重启后稳定，instance 在每次启动时变化 --- */
export interface IInstance {
    'id': string;
    'instance': string;
    'name': string;
    'pid': number;
    'info': IMcpInfo;
}

/**
 * --- 同一操作系统用户的临时服务记录，不保存业务配置 ---
 * @returns 运行记录目录，环境变量用于独立测试或宿主自定义运行目录
 */
export function directory(): string {
    return process.env['CLICKGO_NATIVE_RUNTIME_DIR'] ?? join(homedir(), '.clickgo-native', 'run');
}

/**
 * --- 只接受当前用户拥有的非链接文件；Windows 沿用用户目录的访问控制 ---
 * @param path 待检查的目录或文件
 * @param folder 是否检查目录
 * @returns 记录是否处于受保护的本机用户边界
 */
async function isPrivate(path: string, folder: boolean): Promise<boolean> {
    const stat = await lstat(path);
    if (stat.isSymbolicLink() || (folder ? !stat.isDirectory() : !stat.isFile())) {
        return false;
    }
    return process.platform === 'win32' ||
        (stat.uid === process.getuid?.() && (stat.mode & 0o077) === 0);
}

/**
 * --- 验证记录格式，禁止将认证信息发送到非本机或自定义 URL ---
 * @param value 从记录文件解析的值
 * @returns 合法记录，格式无效为 false
 */
function validate(value: unknown): IInstance | false {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const record = value as IInstance;
    if (typeof record.id !== 'string' || !/^[A-Za-z0-9._-]{1,128}$/.test(record.id) ||
        typeof record.instance !== 'string' || !/^[0-9a-f-]{36}$/.test(record.instance) ||
        typeof record.name !== 'string' || record.name.length > 512 || !Number.isSafeInteger(record.pid) || record.pid < 1 ||
        record.info?.transport !== 'streamable-http' || typeof record.info.url !== 'string' ||
        typeof record.info.token !== 'string' || !/^[A-Za-z0-9_-]{32,256}$/.test(record.info.token)) {
        return false;
    }
    const url = new URL(record.info.url);
    if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || !url.port ||
        url.pathname !== '/mcp' || url.username || url.password || url.search || url.hash) {
        return false;
    }
    return record;
}

/**
 * --- 原子发布当前连接设置，访问凭据只写入同用户私有文件 ---
 * @param info 本次启动的连接信息
 * @param id 软件稳定标识
 * @param name 软件展示名称
 * @returns 停止时删除记录的句柄，无法安全发布时为 false
 */
export async function publish(
    info: IMcpInfo, id: string, name: string
): Promise<{ 'close': () => Promise<void>; } | false> {
    const root = directory();
    const record: IInstance = { 'id': id, 'instance': randomUUID(), 'name': name, 'pid': process.pid, 'info': info };
    const path = join(root, `${record.instance}.json`);
    const temporary = `${path}.tmp`;
    // --- 文件系统、权限和外部 URL 解析失败在发布边界处理，不启动无发现能力的半成品 ---
    try {
        if (validate(record) === false) {
            return false;
        }
        await mkdir(root, { 'recursive': true, 'mode': 0o700 });
        if (!(await isPrivate(root, true))) {
            return false;
        }
        const file = await open(temporary, 'wx', 0o600);
        try {
            await file.writeFile(JSON.stringify(record));
        }
        finally {
            await file.close();
        }
        await rename(temporary, path);
    }
    catch {
        await unlink(temporary).catch(() => {});
        return false;
    }
    return {
        close: async (): Promise<void> => {
            // --- 正常关闭撤销凭据；崩溃遗留记录由发现过程排除 ---
            await unlink(path).catch(() => {});
        },
    };
}

/**
 * --- 发现当前用户的服务，拒绝链接、公开权限、损坏及失效记录 ---
 * @returns 可用记录；目录尚不存在或不可安全读取时为空列表
 */
export async function list(): Promise<IInstance[]> {
    const root = directory();
    const instances: IInstance[] = [];
    try {
        if (!(await isPrivate(root, true))) {
            return instances;
        }
        const names = await readdir(root);
        for (const name of names) {
            if (!/^[0-9a-f-]{36}\.json$/.test(name)) {
                continue;
            }
            const path = join(root, name);
            try {
                if (!(await isPrivate(path, false))) {
                    continue;
                }
                const file = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
                let value: unknown;
                try {
                    const stat = await file.stat();
                    if (stat.size > 16384 || (process.platform !== 'win32' &&
                        (stat.uid !== process.getuid?.() || (stat.mode & 0o077) !== 0))) {
                        continue;
                    }
                    value = JSON.parse(await file.readFile('utf8'));
                }
                finally {
                    await file.close();
                }
                const record = validate(value);
                if (record === false || `${record.instance}.json` !== name) {
                    continue;
                }
                process.kill(record.pid, 0);
                instances.push(record);
            }
            catch {
                // --- 单个无效或已退出的实例不阻断其他软件的发现 ---
            }
        }
    }
    catch {
        // --- 尚未启用服务或目录不可访问时没有可发现实例 ---
    }
    return instances;
}
