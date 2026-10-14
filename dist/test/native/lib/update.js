import { app } from 'electron';
import * as lAboxUpdate from '../abox/update.js';
/** --- 仅由 launcher 在主进程显式启用 --- */
let enabled = false;
/** --- 软件级状态；进程内只允许一个检测和一个下载 --- */
let state = { 'status': 'disabled', 'currentVersion': app.getVersion(), 'reason': 'not-enabled' };
let checking;
let downloading;
let downloadedVersion;
let driver;
const listeners = new Set();
/**
 * --- 主进程设置是否提供更新能力，不设置更新源 ---
 * @param value 是否启用，更新源使用打包后的 build.publish 配置
 * @returns 无返回值
 */
export function setEnabled(value) {
    enabled = value;
    publish(disabled() ?? { 'status': 'idle', 'currentVersion': app.getVersion() });
}
/**
 * --- 读取当前环境不能更新的原因 ---
 * @returns 禁用状态，可更新时为 null
 */
function disabled() {
    const currentVersion = app.getVersion();
    if (!enabled) {
        return { 'status': 'disabled', 'currentVersion': currentVersion, 'reason': 'not-enabled' };
    }
    if (!app.isPackaged) {
        return { 'status': 'disabled', 'currentVersion': currentVersion, 'reason': 'development' };
    }
    if (process.env.PORTABLE_EXECUTABLE_FILE) {
        return { 'status': 'disabled', 'currentVersion': currentVersion, 'reason': 'portable' };
    }
    return null;
}
/**
 * --- 取得软件级更新状态副本，进度对象也独立复制 ---
 * @returns 当前状态，尚未检测时为 idle，当前环境不能更新时为 disabled
 */
export function getUpdateState() {
    const unavailable = disabled();
    if (unavailable !== null) {
        return unavailable;
    }
    return state.progress ? { ...state, 'progress': { ...state.progress } } : { ...state };
}
/**
 * --- 发布已确定的状态，监听者错误不阻断更新流程 ---
 * @param value 新状态
 * @returns 无返回值
 */
function publish(value) {
    state = value;
    for (const listener of listeners) {
        try {
            listener(getUpdateState());
        }
        catch {
            // --- 单个订阅者不能阻断其他订阅者或安装状态 ---
        }
    }
}
/**
 * --- 主进程监听软件级状态和下载进度 ---
 * @param handler 状态副本回调，不含 URL、凭据或安装路径
 * @returns 取消订阅函数
 */
export function onUpdateState(handler) {
    listeners.add(handler);
    return () => { listeners.delete(handler); };
}
/**
 * --- 加载更新适配器，安装异步失败允许业务恢复编辑和重试 ---
 * @returns 适配器，初始化失败为 false
 */
async function load() {
    const result = await lAboxUpdate.load(() => {
        if (state.status === 'restarting') {
            publish({ ...state, 'status': 'error', 'errorCode': 'install-failed' });
        }
    }, (progress) => {
        if (state.status === 'downloading') {
            publish({ ...state, 'progress': progress });
        }
    });
    if (result !== false) {
        driver = result;
    }
    return result;
}
/**
 * --- 手动检测软件更新，合并并发请求；下载后保持当前安装目标 ---
 * @returns 状态；检测失败为 error，开发、便携或未启用时为 disabled
 */
export function checkUpdates() {
    const unavailable = disabled();
    if (unavailable !== null) {
        return Promise.resolve(unavailable);
    }
    if (downloading || downloadedVersion) {
        if (downloadedVersion && state.status === 'error') {
            publish({ ...state, 'status': 'downloaded', 'errorCode': undefined });
        }
        return Promise.resolve(getUpdateState());
    }
    if (checking) {
        return checking;
    }
    checking = Promise.resolve().then(async () => {
        publish({ 'status': 'checking', 'currentVersion': app.getVersion() });
        const updater = await load();
        const result = updater === false ? false : await updater.check();
        if (result === false) {
            publish({ 'status': 'error', 'currentVersion': app.getVersion(), 'errorCode': 'check-failed' });
        }
        else if (result === null) {
            publish({ 'status': 'disabled', 'currentVersion': app.getVersion() });
        }
        else {
            publish({ 'status': result.available ? 'available' : 'up-to-date',
                'currentVersion': app.getVersion(), 'version': result.version });
        }
        return getUpdateState();
    }).finally(() => { checking = undefined; });
    return checking;
}
/**
 * --- 下载已检测版本，由更新器校验文件，合并并发请求 ---
 * @returns 状态；未检测到更新为 not-ready，下载失败为 download-failed
 */
export function downloadUpdate() {
    const unavailable = disabled();
    if (unavailable !== null) {
        return Promise.resolve(unavailable);
    }
    if (downloading) {
        return downloading;
    }
    if (downloadedVersion) {
        if (state.status !== 'restarting') {
            publish({ ...state, 'status': 'downloaded', 'errorCode': undefined });
        }
        return Promise.resolve(getUpdateState());
    }
    if (checking || state.status !== 'available' || !state.version) {
        return Promise.resolve({ ...getUpdateState(), 'status': 'error', 'errorCode': 'not-ready' });
    }
    const version = state.version;
    downloading = Promise.resolve().then(async () => {
        publish({ 'status': 'downloading', 'currentVersion': app.getVersion(), 'version': version });
        const updater = await load();
        if (updater !== false && await updater.download()) {
            downloadedVersion = version;
            publish({ 'status': 'downloaded', 'currentVersion': app.getVersion(), 'version': version });
        }
        else {
            publish({ 'status': 'error', 'currentVersion': app.getVersion(), 'version': version,
                'errorCode': 'download-failed' });
        }
        return getUpdateState();
    }).finally(() => { downloading = undefined; });
    return downloading;
}
/**
 * --- 安装本进程已成功下载并校验的版本，业务须先确认并保存文档 ---
 * @returns restarting 表示已交给安装器；未就绪或安装失败返回 error，重复调用不重复启动
 */
export function installUpdate() {
    const unavailable = disabled();
    if (unavailable !== null) {
        return unavailable;
    }
    if (!downloadedVersion || downloading || checking || !driver) {
        return { ...getUpdateState(), 'status': 'error', 'errorCode': 'not-ready' };
    }
    if (state.status === 'restarting') {
        return getUpdateState();
    }
    publish({ 'status': 'restarting', 'currentVersion': app.getVersion(), 'version': downloadedVersion });
    if (!driver.install()) {
        publish({ ...state, 'status': 'error', 'errorCode': 'install-failed' });
    }
    return getUpdateState();
}
