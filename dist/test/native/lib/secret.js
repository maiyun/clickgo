import { app, safeStorage } from 'electron';
import * as lPersistence from './persistence.js';
/**
 * --- 检查系统密钥服务，不允许无保护的 Linux 后端 ---
 * @returns 系统安全存储是否可用，未就绪或异常时为 false
 */
export async function isAvailable() {
    try {
        if (!app.isReady() || !await safeStorage.isAsyncEncryptionAvailable()) {
            return false;
        }
        // --- Linux 明确拒绝 basic_text，不能把弱保护当成安全存储 ---
        if (process.platform === 'linux') {
            const backend = safeStorage.getSelectedStorageBackend();
            if (backend === 'basic_text' || backend === 'unknown') {
                return false;
            }
        }
        return true;
    }
    catch {
        return false;
    }
}
/**
 * --- 读取并解密字符串，错误时不删除已有密文 ---
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @param appId 固定 App ID；省略时使用软件级存储
 * @returns 解密后的字符串；没有记录为 null，密钥服务或读取失败为 false
 */
export function get(key, appId) {
    return lPersistence.run('secret', key, async (file) => {
        const data = await lPersistence.read(file);
        if (data === null || data === false) {
            return data;
        }
        if (!await isAvailable()) {
            return false;
        }
        const decrypted = await safeStorage.decryptStringAsync(data);
        const record = JSON.parse(decrypted.result);
        if (!record || typeof record !== 'object' || Array.isArray(record)) {
            return false;
        }
        const secret = record;
        if (secret.key !== key || secret.appId !== appId || typeof secret.value !== 'string') {
            return false;
        }
        // --- 密钥轮换后用当前密钥替换密文，仍经临时文件写入保护原记录 ---
        if (decrypted.shouldReEncrypt) {
            const encrypted = await safeStorage.encryptStringAsync(decrypted.result);
            if (!await lPersistence.write(file, encrypted)) {
                return false;
            }
        }
        return secret.value;
    }, appId);
}
/**
 * --- 使用系统密钥加密后保存字符串，不退回明文 ---
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @param value 敏感字符串，最大 64 KiB
 * @param appId 固定 App ID；省略时使用软件级存储
 * @returns 是否保存成功，安全存储不可用或写入失败为 false
 */
export function set(key, value, appId) {
    if (typeof value !== 'string' || Buffer.byteLength(value, 'utf8') > 65536) {
        return Promise.resolve(false);
    }
    return lPersistence.run('secret', key, async (file) => {
        if (!await isAvailable()) {
            return false;
        }
        const data = await safeStorage.encryptStringAsync(JSON.stringify({ 'key': key, 'value': value, 'appId': appId }));
        return lPersistence.write(file, data);
    }, appId);
}
/**
 * --- 删除敏感记录，无需系统密钥服务可用 ---
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @param appId 固定 App ID；省略时使用软件级存储
 * @returns 是否删除成功，未找到时也返回成功
 */
export function remove(key, appId) {
    return lPersistence.run('secret', key, lPersistence.remove, appId);
}
