import * as lNative from '../native';
/**
 * --- 检测软件更新，主进程须 launcher({ updates: true }) 并配置 build.publish ---
 * @param current 当前 App 或窗体，要求 root 权限
 * @returns 检测状态；开发/便携/未启用返回 disabled，无权限为 false，网页/旧宿主为 null
 */
export function checkUpdates(current) {
    return lNative.invokeUpdate(current, 'check');
}
/**
 * --- 下载检测到的版本，合并并发下载，由 Native 校验文件 ---
 * @param current 当前 App 或窗体，要求 root 权限，业务须先取得用户确认
 * @returns downloaded 表示校验完成，未就绪/失败为 error；无权限为 false，不支持为 null
 */
export function downloadUpdate(current) {
    return lNative.invokeUpdate(current, 'download');
}
/**
 * --- 安装本进程已下载的版本并重启，业务须先保存文档并确认 ---
 * @param current 当前 App 或窗体，要求 root 权限
 * @returns restarting 表示安装开始；异步失败由 onUpdateState 通知，无权限为 false，不支持为 null
 */
export function installUpdate(current) {
    return lNative.invokeUpdate(current, 'install');
}
/**
 * --- 读取 Native 软件级更新状态快照 ---
 * @param current 当前 App 或窗体，要求 root 权限
 * @returns 当前状态，无权限为 false，网页或旧宿主不支持为 null
 */
export function getUpdateState(current) {
    return lNative.invokeUpdate(current, 'state');
}
/**
 * --- 监听软件级公开状态及下载进度；不包含 URL、凭据或文件路径 ---
 * @param current 当前 App 或窗体，不要求 root；控制更新仍须 root
 * @param handler 状态回调，业务不需要定义 Native 事件名
 * @returns 无返回值；窗体或任务销毁时自动解除，网页/旧宿主不会投递
 */
export function onUpdateState(current, handler) {
    lNative.on(current, 'update-state', handler, false, typeof current === 'string' ? undefined :
        current.formId);
}
