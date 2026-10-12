import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout } from 'node:timers/promises';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import * as lInstance from './instance.js';
import { version } from './version.js';

/** --- 宿主授权的 GUI 入口，参数不包含 --cli / --mcp --- */
export interface IStartupEntry {
    'command': string;
    'args': string[];
    /** --- 等待 GUI 和 App 就绪的上限（毫秒），默认 20000 --- */
    'timeout'?: number;
}

/**
 * --- 启动期间只读检查 App 是否已加载，不重试任何业务修改 ---
 * @param instance 正在准备的 GUI 实例
 * @param signal 上游取消信号
 * @param timeout 本次检查的最长等待时间
 * @returns 当前软件是否已有可访问的 App
 */
async function isReady(instance: lInstance.IInstance, signal: AbortSignal, timeout: number): Promise<boolean> {
    const client = new Client({ 'name': 'clickgo-native-client', 'version': version }, {
        'versionNegotiation': { 'mode': 'auto' },
    });
    try {
        await client.connect(new StreamableHTTPClientTransport(new URL(instance.info.url), {
            'requestInit': { 'headers': { 'Authorization': `Bearer ${instance.info.token}` } },
        }), { 'signal': signal, 'timeout': timeout });
        const result = await client.callTool({ 'name': 'clickgo_list_apps', 'arguments': {} }, {
            'signal': signal, 'timeout': timeout,
        });
        const content = result.structuredContent;
        return content !== null && typeof content === 'object' && 'ok' in content && content['ok'] === true &&
            'data' in content && Array.isArray(content['data']) && content['data'].length > 0;
    }
    catch {
        return false;
    }
    finally {
        await client.close().catch(() => {});
    }
}

/**
 * --- 缺少运行实例时按需启动软件，等待 App 就绪；取消不关闭已拉起的 GUI ---
 * @param applicationId 软件安装归属
 * @param entry GUI 启动入口
 * @param signal 上游取消信号
 * @returns 就绪为 null，失败为错误码；后续业务请求仍只执行一次
 */
export async function ensure(
    applicationId: string, entry: IStartupEntry, signal: AbortSignal
): Promise<'startup-failed' | 'startup-timeout' | 'cancelled' | null> {
    const timeout = entry.timeout ?? 20000;
    const end = Date.now() + timeout;
    let lock: Awaited<ReturnType<typeof lInstance.lockStart>> = null;
    let launched = false;
    try {
        while (!signal.aborted && Date.now() < end) {
            const instances = (await lInstance.list()).filter(instance => instance.applicationId === applicationId);
            if (instances.length > 1) {
                // --- 已有多个 GUI 时由原调用处理实例歧义，不在启动等待中默认选择 ---
                return null;
            }
            if (instances.length) {
                // --- 服务记录可能早于网页加载；先等只读发现可用，再交给原请求选择目标 ---
                if (await isReady(instances[0], signal, Math.max(1, Math.min(1000, end - Date.now())))) {
                    await lInstance.releaseStart(applicationId, instances[0].pid);
                    return null;
                }
            }
            else if (!launched) {
                lock = await lInstance.lockStart(applicationId);
                if (lock === false) {
                    return 'startup-failed';
                }
                if (lock !== null) {
                    launched = true;
                    // --- 竞争锁期间可能已有 GUI 发布，取得启动权后再次确认 ---
                    const running = (await lInstance.list()).some(instance => instance.applicationId === applicationId);
                    if (!running && !signal.aborted) {
                        const startupLock = lock;
                        const env = { ...process.env };
                        delete env['ELECTRON_RUN_AS_NODE'];
                        const child = spawn(entry.command, entry.args, {
                            'detached': true, 'stdio': 'ignore', 'windowsHide': true, 'env': env,
                        });
                        launched = await once(child, 'spawn').then(() => true, () => false);
                        if (!launched) {
                            return 'startup-failed';
                        }
                        if (!(await startupLock.transfer(child.pid ?? 0))) {
                            // --- 无法记录这次启动时终止自己的子进程，避免下一请求重复拉起 ---
                            child.kill();
                            return 'startup-failed';
                        }
                        child.unref();
                    }
                }
            }
            // --- 取消只结束本次等待；已交接的 GUI 启动锁保留到就绪或进程退出 ---
            await setTimeout(Math.min(100, Math.max(1, end - Date.now())), undefined, { 'signal': signal }).catch(() => {});
        }
        return signal.aborted ? 'cancelled' : 'startup-timeout';
    }
    finally {
        if (lock !== null && lock !== false) {
            // --- 只释放本请求仍拥有的锁；GUI 已接管的文件具有不同标识 ---
            await lock.close();
        }
    }
}
