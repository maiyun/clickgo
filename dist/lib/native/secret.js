import { callPersistence } from '../native';
/**
 * --- 查询 Native 系统密钥服务，无需 root 权限 ---
 * @param current 当前 App
 * @returns 是否可以安全保存敏感字符串
 */
export async function isAvailable(current) {
    return await callPersistence(current, 'secret', 'isAvailable') === true;
}
/**
 * --- 读取当前 App 的加密字符串，按 config.id 隔离 ---
 * @param current 当前 App
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @returns 字符串，未找到为 null，缺少有效 App ID、宿主、密钥服务或读取失败为 false
 */
export async function get(current, key) {
    const result = await callPersistence(current, 'secret', 'get', key);
    if (result === null || typeof result === 'string') {
        return result;
    }
    return false;
}
/**
 * --- 加密后保存字符串，按 config.id 隔离，不退回明文 ---
 * @param current 当前 App
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @param value 敏感字符串
 * @returns 是否保存成功，安全存储不可用为 false
 */
export async function set(current, key, value) {
    return await callPersistence(current, 'secret', 'set', key, value) === true;
}
/**
 * --- 删除加密记录，按 config.id 隔离 ---
 * @param current 当前 App
 * @param key 非空 Unicode 存储键，最多 128 个 UTF-16 码元
 * @returns 是否删除成功，未找到时也返回成功
 */
export async function remove(current, key) {
    return await callPersistence(current, 'secret', 'remove', key) === true;
}
