import { randomUUID } from 'node:crypto';
import { lstat, mkdir, open, readdir, rename, unlink } from 'node:fs/promises';
import { constants } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
/**
 * --- 同一操作系统用户的临时服务记录，不保存业务配置 ---
 * @returns 运行记录目录，环境变量用于独立测试或宿主自定义运行目录
 */
export function directory() {
    return process.env['CLICKGO_NATIVE_RUNTIME_DIR'] ?? join(homedir(), '.clickgo-native', 'run');
}
/**
 * --- 只接受当前用户拥有的非链接文件；Windows 沿用用户目录的访问控制 ---
 * @param path 待检查的目录或文件
 * @param folder 是否检查目录
 * @returns 记录是否处于受保护的本机用户边界
 */
async function isPrivate(path, folder) {
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
function validate(value) {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const record = value;
    if (record.applicationId !== undefined &&
        (typeof record.applicationId !== 'string' || !/^[A-Za-z0-9._-]{1,128}$/.test(record.applicationId))) {
        return false;
    }
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
 * @param applicationId 可执行文件的归属标识，独立于业务指定的稳定软件 ID
 * @returns 停止时删除记录的句柄，无法安全发布时为 false
 */
export async function publish(info, id, name, applicationId) {
    const root = directory();
    const record = {
        'id': id, 'applicationId': applicationId, 'instance': randomUUID(), 'name': name,
        'pid': process.pid, 'info': info,
    };
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
        await unlink(temporary).catch(() => { });
        return false;
    }
    return {
        close: async () => {
            // --- 正常关闭撤销凭据；崩溃遗留记录由发现过程排除 ---
            await unlink(path).catch(() => { });
        },
    };
}
/**
 * --- 发现当前用户的服务，拒绝链接、公开权限、损坏及失效记录 ---
 * @returns 可用记录；目录尚不存在或不可安全读取时为空列表
 */
export async function list() {
    const root = directory();
    const instances = [];
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
                let value;
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
/**
 * --- 只撤销已检查的文件，旧请求的清理不能移除后来创建的锁 ---
 * @param path 启动锁路径
 * @param stat 已检查文件的标识
 * @returns 文件已删除或已由其他进程处理
 */
async function removeStart(path, stat) {
    try {
        const current = await lstat(path);
        if (current.ino === stat.ino && current.dev === stat.dev) {
            await unlink(path);
        }
    }
    catch {
        // --- 文件已释放或暂时不可访问，不影响请求结束 ---
    }
}
/**
 * --- 同一安装的并发接入进程只允许一个负责拉起 GUI ---
 * @param applicationId 软件安装归属
 * @returns 释放句柄；其他进程正在启动为 null，目录或锁不可安全使用为 false
 */
export async function lockStart(applicationId) {
    if (!/^[A-Za-z0-9._-]{1,128}$/.test(applicationId)) {
        return false;
    }
    const root = directory();
    const path = join(root, `start-${applicationId}.lock`);
    try {
        await mkdir(root, { 'recursive': true, 'mode': 0o700 });
        if (!(await isPrivate(root, true))) {
            return false;
        }
        const file = await open(path, 'wx', 0o600);
        let stat;
        try {
            await file.writeFile(String(process.pid));
            stat = await file.stat();
        }
        finally {
            await file.close();
        }
        return {
            transfer: async (pid) => {
                if (!Number.isSafeInteger(pid) || pid < 1) {
                    return false;
                }
                const temporary = `${path}.${randomUUID()}.tmp`;
                try {
                    const target = await open(temporary, 'wx', 0o600);
                    try {
                        await target.writeFile(String(pid));
                    }
                    finally {
                        await target.close();
                    }
                    const current = await lstat(path);
                    if (current.ino !== stat.ino || current.dev !== stat.dev) {
                        return false;
                    }
                    // --- 原子交接给 GUI，其他请求始终读到完整 PID；旧句柄不再拥有此文件 ---
                    await rename(temporary, path);
                    return true;
                }
                catch {
                    return false;
                }
                finally {
                    await unlink(temporary).catch(() => { });
                }
            },
            close: () => removeStart(path, stat),
        };
    }
    catch (error) {
        if (error.code !== 'EEXIST') {
            return false;
        }
    }
    // --- 接入进程或已拉起的 GUI 保留启动权；异常退出的锁在下一轮发现前清理 ---
    try {
        if (!(await isPrivate(path, false))) {
            return false;
        }
        const file = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
        try {
            const stat = await file.stat();
            if (stat.size > 64) {
                return false;
            }
            const pid = Number(await file.readFile('utf8'));
            if (!Number.isSafeInteger(pid) || pid < 1) {
                // --- 另一个进程刚创建文件、尚未写入 PID，等待它完成 ---
                if (stat.size === 0 && Date.now() - stat.mtimeMs > 20000) {
                    await removeStart(path, stat);
                }
                return null;
            }
            try {
                process.kill(pid, 0);
            }
            catch (error) {
                if (error.code === 'ESRCH') {
                    await removeStart(path, stat);
                }
            }
        }
        finally {
            await file.close();
        }
        return null;
    }
    catch {
        // --- 其他进程刚释放的锁留到下一轮竞争；不绕过受保护的启动边界 ---
        return null;
    }
}
/**
 * --- GUI 与 App 就绪后撤销它接管的启动锁，后续客户端可清理前一个请求的交接 ---
 * @param applicationId 软件安装归属
 * @param pid 已就绪 GUI 的进程 ID
 * @returns 对应锁已释放；其他启动进程的锁保留
 */
export async function releaseStart(applicationId, pid) {
    if (!/^[A-Za-z0-9._-]{1,128}$/.test(applicationId) || !Number.isSafeInteger(pid) || pid < 1) {
        return;
    }
    const root = directory();
    const path = join(root, `start-${applicationId}.lock`);
    try {
        if (!(await isPrivate(root, true)) || !(await isPrivate(path, false))) {
            return;
        }
        const file = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
        try {
            const stat = await file.stat();
            if (stat.size <= 64 && Number(await file.readFile('utf8')) === pid) {
                await removeStart(path, stat);
            }
        }
        finally {
            await file.close();
        }
    }
    catch {
        // --- 另一个客户端可能已完成清理，不影响 GUI 就绪 ---
    }
}
/**
 * --- 判断 GUI 是否仍在受保护的启动等待期，避免并发客户端过早发送业务请求 ---
 * @param applicationId 软件安装归属
 * @returns 是否存在私有启动锁
 */
export async function isStarting(applicationId) {
    try {
        return await isPrivate(join(directory(), `start-${applicationId}.lock`), false);
    }
    catch {
        return false;
    }
}
