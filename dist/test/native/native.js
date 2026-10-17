import * as nodeFs from 'node:fs';
import * as nodePath from 'path';
import { pathToFileURL } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import * as electron from 'electron';
import * as lFs from './lib/fs.js';
import * as lTool from './lib/tool.js';
import * as lMcp from './lib/mcp.js';
import * as lCli from './lib/cli.js';
import * as lStorage from './lib/storage.js';
import * as lSecret from './lib/secret.js';
import * as lUpdate from './lib/update.js';
export * as storage from './lib/storage.js';
export * as secret from './lib/secret.js';
export { checkUpdates, downloadUpdate, getUpdateState, onUpdateState } from './lib/update.js';
// npm publish --tag dev --access public
// --- sass --watch dist/:dist/ --style compressed --no-source-map ---
/** --- 窗体是否含有 border 边框，有的话将不是沉浸式，也不会绑定任何窗体的大小的相关事件 --- */
let hasFrame = true;
/** --- 是否没有物理窗体时就主动退出软件（进程结束），如果不要窗体只有 node 的话，会用到 false 的情况 --- */
let isNoFormQuit = true;
/** --- 主窗体 --- */
let form;
/** --- 首个 Form 指定的最小尺寸，解锁启动窗口后重新应用 --- */
let minimumSize = [0, 0];
/** --- 当前设定的通讯 token --- */
let token = '';
/** --- 主窗体唯一允许使用 Native 通讯的页面地址（不含 hash） --- */
let mainPage = '';
/** --- 主框架正在更换文档时暂停 Native 通讯 --- */
let mainNavigating = false;
/** --- 一个 Native 进程共用一个 MCP 服务，关闭主窗体时释放 --- */
let mcpServer;
/** --- 当前服务是否允许软件自身的 CLI/stdio 发现连接 --- */
let mcpDiscovery = false;
/** --- 命令请求是否允许在没有运行实例时拉起 GUI，默认关闭 --- */
let commandAutoStart = false;
/** --- 尚在准备的监听，用于防重复与停止时等待释放 --- */
let mcpPending;
/** --- 停止操作使此前尚未完成的启动失效 --- */
let mcpGeneration = 0;
/** --- 应用已确认关闭，避免再次进入网页关闭事件 --- */
let closeAllowed = false;
/** --- 安装失败时恢复先前的关闭确认规则 --- */
let updateCloseAllowed;
/** --- 当前启用系统文件打开处理的启动类 --- */
let fileOpenBoot;
/** --- 普通 GUI 请求的宿主及尚未交给主文档的系统事件 --- */
let launchBoot;
let nativeRequestId = 0;
const nativeEvents = [];
/** --- 当前系统平台 --- */
const platform = process.platform;
// const platform: NodeJS.Platform = 'darwin';
/** --- 监听前台的执行的方法，内置的方法，用户可调用方法自行添加 --- */
const methods = {
    // --- 只向已验证的主文档会话提供待处理系统事件 ---
    'cg-native-events': {
        'once': false,
        handler: function (t) {
            return verifyToken(t) ? nativeEvents.splice(0) : false;
        },
    },
    // --- 按固定 App ID 隔离持久配置与加密字符串，并查询安全存储是否可用 ---
    'cg-app-persistence': {
        'once': false,
        handler: async function (t, appId, area, action, key, value) {
            if (!verifyToken(t)) {
                return false;
            }
            if (area === 'secret' && action === 'isAvailable') {
                return lSecret.isAvailable();
            }
            if (typeof appId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(appId)) {
                return false;
            }
            if (typeof key !== 'string') {
                return false;
            }
            if (area === 'storage') {
                switch (action) {
                    case 'get':
                        return lStorage.get(key, appId);
                    case 'set':
                        return lStorage.set(key, value, appId);
                    case 'remove':
                        return lStorage.remove(key, appId);
                }
            }
            else if (area === 'secret') {
                switch (action) {
                    case 'get':
                        return lSecret.get(key, appId);
                    case 'set':
                        return typeof value === 'string' ? lSecret.set(key, value, appId) : false;
                    case 'remove':
                        return lSecret.remove(key, appId);
                }
            }
            return false;
        },
    },
    // --- 软件更新只允许固定动作，网页不能传入源地址或文件路径 ---
    'cg-update': {
        'once': false,
        handler: function (t, action) {
            if (!verifyToken(t)) {
                return false;
            }
            switch (action) {
                case 'check': return lUpdate.checkUpdates();
                case 'download': return lUpdate.downloadUpdate();
                case 'install': return installUpdate();
                case 'state': return lUpdate.getUpdateState();
            }
            return false;
        },
    },
    // --- 获取软件自身的 CLI/stdio 入口及能力状态，不含连接凭据 ---
    'cg-command-entry': {
        'once': false,
        handler: function (t) {
            return verifyToken(t) ? getCommandEntry() : null;
        },
    },
    // --- 获取当前 MCP 的连接地址与凭据，供客户端配置使用 ---
    'cg-mcp-info': {
        'once': false,
        handler: function (t) {
            return verifyToken(t) ? getMcpInfo() : null;
        },
    },
    // --- 完全退出软件进程 ---
    'cg-quit': {
        'once': false,
        handler: function (t) {
            if (!t || !form) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            closeAllowed = true;
            electron.app.quit();
        }
    },
    // --- 设置实体窗体大小 ---
    'cg-set-size': {
        'once': false,
        handler: function (t, width, height) {
            if (!form || !width || !height) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            // --- 首个应用窗体先解除启动屏尺寸限制，再设置尺寸 ---
            form.resizable = true;
            // --- Linux 解锁会恢复锁定前的约束，须在解锁后应用 Form 的最小尺寸 ---
            form.setMinimumSize(...minimumSize);
            form.setSize(Math.max(width, minimumSize[0]), Math.max(height, minimumSize[1]));
            form.center();
        }
    },
    // --- 设置实体窗体最小尺寸 ---
    'cg-set-min-size': {
        'once': false,
        handler: function (t, width, height) {
            if (!form || !verifyToken(t) || !Number.isInteger(width) || !Number.isInteger(height) ||
                (width < 0) || (height < 0)) {
                return;
            }
            minimumSize = [width, height];
            // --- 启动屏仍锁定时只记录约束，避免被后续解锁覆盖或改变启动屏尺寸 ---
            if (!form.resizable) {
                return;
            }
            form.setMinimumSize(width, height);
            const [currentWidth, currentHeight] = form.getSize();
            if ((currentWidth < width) || (currentHeight < height)) {
                form.setSize(Math.max(currentWidth, width), Math.max(currentHeight, height));
            }
        }
    },
    // --- 设置窗体最大化、最小化、还原（从最大化还原） ---
    'cg-set-state': {
        'once': false,
        handler: function (t, state) {
            if (!form || !state) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            switch (state) {
                case 'max': {
                    form.maximize();
                    break;
                }
                case 'min': {
                    form.minimize();
                    break;
                }
                case 'restore': {
                    // --- 最小化还原 ---
                    form.restore();
                    break;
                }
                default: {
                    // --- 从最大化还原 ---
                    form.unmaximize();
                }
            }
        }
    },
    // --- 激活窗体 ---
    'cg-activate': {
        'once': false,
        handler: function (t) {
            if (!verifyToken(t)) {
                return;
            }
            activateMainForm();
        },
    },
    // --- 关闭窗体（可能软件进程不会被退出） ---
    'cg-close': {
        'once': false,
        handler: function (t) {
            if (!form) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            closeAllowed = true;
            form.close();
        }
    },
    // --- 是否允许最大化 ---
    'cg-maximizable': {
        'once': false,
        handler: function (t, val) {
            if (!form) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            form.setMaximizable(val);
        }
    },
    // --- fs 相关操作 ---
    'cg-fs-getContent': {
        'once': false,
        handler: async function (t, path, options) {
            if (!verifyToken(t)) {
                return null;
            }
            return lFs.getContent(path, options);
        }
    },
    'cg-fs-putContent': {
        'once': false,
        handler: async function (t, path, data, options) {
            if (!verifyToken(t)) {
                return false;
            }
            return lFs.putContent(path, data, options);
        }
    },
    'cg-fs-readLink': {
        'once': false,
        handler: async function (t, path, encoding) {
            if (!verifyToken(t)) {
                return null;
            }
            return lFs.readLink(path, encoding);
        }
    },
    'cg-fs-symlink': {
        'once': false,
        handler: async function (t, filePath, linkPath, type) {
            if (!verifyToken(t)) {
                return false;
            }
            return lFs.symlink(filePath, linkPath, type);
        }
    },
    'cg-fs-unlink': {
        'once': false,
        handler: async function (t, path) {
            if (!verifyToken(t)) {
                return false;
            }
            return lFs.unlink(path);
        }
    },
    'cg-fs-stats': {
        'once': false,
        handler: async function (t, path) {
            if (!verifyToken(t)) {
                return null;
            }
            return lFs.stats(path);
        }
    },
    'cg-fs-mkdir': {
        'once': false,
        handler: async function (t, path, mode) {
            if (!verifyToken(t)) {
                return false;
            }
            return lFs.mkdir(path, mode);
        }
    },
    'cg-fs-rmdir': {
        'once': false,
        handler: async function (t, path) {
            if (!verifyToken(t)) {
                return false;
            }
            return lFs.rmdir(path);
        }
    },
    'cg-fs-chmod': {
        'once': false,
        handler: async function (t, path, mod) {
            if (!verifyToken(t)) {
                return false;
            }
            return lFs.chmod(path, mod);
        }
    },
    'cg-fs-rename': {
        'once': false,
        handler: async function (t, oldPath, newPath) {
            if (!verifyToken(t)) {
                return false;
            }
            return lFs.rename(oldPath, newPath);
        }
    },
    'cg-fs-readDir': {
        'once': false,
        handler: async function (t, path, encoding) {
            if (!verifyToken(t)) {
                return [];
            }
            return lFs.readDir(path, encoding);
        }
    },
    'cg-fs-copyFile': {
        'once': false,
        handler: async function (t, src, dest) {
            if (!verifyToken(t)) {
                return false;
            }
            return lFs.copyFile(src, dest);
        }
    },
    // --- form ---
    'cg-form-open': {
        'once': false,
        handler: function (t, options = {}) {
            if (!t || !form) {
                return null;
            }
            if (!verifyToken(t)) {
                return null;
            }
            options.filters ??= [];
            options.props ??= {};
            options.props.file ??= true;
            options.props.directory ??= false;
            options.props.multi ??= false;
            const paths = electron.dialog.showOpenDialogSync(form, {
                'defaultPath': options.path ? lTool.formatPath(options.path) : undefined,
                'filters': options.filters.map((item) => {
                    return {
                        'name': item.name,
                        'extensions': item.accept,
                    };
                }),
                'properties': [
                    options.props.file ? 'openFile' : '',
                    options.props.directory ? 'openDirectory' : '',
                    options.props.multi ? 'multiSelections' : '',
                ].filter(item => item),
            });
            if (!paths) {
                return null;
            }
            return paths.map(item => lTool.parsePath(item));
        }
    },
    'cg-form-save': {
        'once': false,
        handler: function (t, options = {}) {
            if (!t || !form) {
                return null;
            }
            if (!verifyToken(t)) {
                return null;
            }
            options.filters ??= [];
            const path = electron.dialog.showSaveDialogSync(form, {
                'defaultPath': options.path ? lTool.formatPath(options.path) : undefined,
                'filters': options.filters.map((item) => {
                    return {
                        'name': item.name,
                        'extensions': item.accept,
                    };
                }),
            });
            if (!path) {
                return null;
            }
            return lTool.parsePath(path);
        }
    },
    'cg-form-dialog': {
        'once': false,
        handler: function (t, options = {}) {
            if (!t || !form) {
                return -1;
            }
            if (!verifyToken(t)) {
                return -1;
            }
            if (typeof options === 'string') {
                options = {
                    'message': options
                };
            }
            options.title ??= 'ClickGo';
            options.message ??= '';
            return electron.dialog.showMessageBoxSync(form, {
                'type': options.type,
                'title': options.title,
                'message': options.message,
                'detail': options.detail,
                'buttons': options.buttons,
            });
        }
    },
    // --- 无需校验码 ---
    // --- 测试与 native 的连通性 ---
    'cg-ping': {
        'once': false,
        handler: function (t) {
            // --- t 不是 token，传过来什么就会传回去 ---
            return 'pong: ' + t;
        }
    },
    // --- 判断窗体是否是最大化状态 ---
    'cg-is-max': {
        'once': false,
        handler: function () {
            return form?.isMaximized() ? true : false;
        }
    },
};
/**
 * --- 激活已有主窗体 ---
 * @returns 无
 */
function activateMainForm() {
    if (!form || form.isDestroyed()) {
        return;
    }
    if (form.isMinimized()) {
        form.restore();
    }
    form.setAlwaysOnTop(true);
    form.show();
    form.focus();
    form.setAlwaysOnTop(false);
}
/**
 * --- 规范化操作系统交给应用的文件路径，仅保留实际存在的普通文件 ---
 * @param paths 原始文件路径
 * @param cwd 相对路径使用的工作目录
 * @returns ClickGo storage 路径格式的文件列表
 */
function normalizeFilePaths(paths, cwd) {
    const result = [];
    const exists = new Set();
    for (const item of paths) {
        if ((typeof item !== 'string') || !item || item.startsWith('-')) {
            continue;
        }
        const path = nodePath.resolve(cwd, item);
        try {
            if (!nodeFs.statSync(path).isFile()) {
                continue;
            }
        }
        catch {
            continue;
        }
        const parsed = lTool.parsePath(path);
        if (exists.has(parsed)) {
            continue;
        }
        exists.add(parsed);
        result.push(parsed);
    }
    return result;
}
/**
 * --- 将操作系统文件打开请求转给启用该能力的应用 ---
 * @param paths 原始文件路径
 * @param cwd 相对路径使用的工作目录
 * @param source 请求来源
 * @param requestId 同一启动请求的 ID，独立请求默认分配
 * @returns 无
 */
function dispatchOpenFiles(paths, cwd, source, requestId = ++nativeRequestId) {
    if (!fileOpenBoot) {
        return;
    }
    const parsed = normalizeFilePaths(paths, cwd);
    if (!parsed.length) {
        return;
    }
    const info = { 'requestId': requestId, 'source': source };
    nativeEvents.push({ 'type': 'openFiles', 'paths': [...parsed], 'info': { ...info } });
    try {
        // --- 原有单参数回调仍有效，宿主处理不阻止 App 侧收到通知 ---
        Promise.resolve(fileOpenBoot.onOpenFiles([...parsed], { ...info })).catch(() => { });
    }
    catch {
        // --- 单个业务回调异常不能阻断另一侧通知 ---
    }
    notifyNativeEvents();
}
/**
 * --- 接收启动及后续实例的业务参数，文件请求复用同一个请求 ID ---
 * @param args 去掉软件入口后的业务参数
 * @param cwd 启动方原生工作目录
 * @param source 首次或后续实例启动
 * @returns 无
 */
function dispatchLaunch(args, cwd, source) {
    const requestId = ++nativeRequestId;
    const event = {
        'requestId': requestId, 'source': source, 'args': [...args], 'cwd': nodePath.resolve(cwd),
    };
    nativeEvents.push({ 'type': 'launch', 'event': { ...event, 'args': [...args] } });
    try {
        Promise.resolve(launchBoot?.onLaunch(event)).catch(() => { });
    }
    catch {
        // --- Native 与 ClickGo 的业务监听独立，不互相取消 ---
    }
    dispatchOpenFiles(args, cwd, source, requestId);
    notifyNativeEvents();
}
/**
 * --- 通知当前主文档读取队列；启动或导航期间未取走的请求继续暂存 ---
 * @returns 无
 */
function notifyNativeEvents() {
    if (!form || form.isDestroyed() || !token || mainNavigating) {
        return;
    }
    void form.webContents.executeJavaScript('window.clickgoNativeWeb?.nativeEvents()').catch(() => { });
}
/** --- 全局类 --- */
export class AbstractBoot {
    /**
     * --- 是否含有实体窗体边框和标题 ---
     */
    get hasFrame() {
        return hasFrame;
    }
    /**
     * --- 没有实体窗体时整个实体进程是不是会被结束 ---
     */
    get isNoFormQuit() {
        return isNoFormQuit;
    }
    /**
     * --- 当前系统代号 ---
     */
    get platform() {
        return platform;
    }
    /**
     * --- 当前的通讯 token ---
     */
    get token() {
        return token;
    }
    /**
     * --- 接收操作系统交给应用的文件，仅在 launcher 的 openFiles 为 true 时触发 ---
     * @param paths 不含 /storage/ 的 ClickGo 文件路径
     * @param info 启动、再次启动、文件关联或拖入来源及请求 ID
     * @returns 无
     */
    onOpenFiles(paths, info) {
        void paths;
        void info;
    }
    /**
     * --- 普通 GUI 启动及再次启动请求，与 ClickGo 的 onNativeLaunch 独立通知 ---
     * @param event 业务参数、来源、工作目录及请求 ID；不含 CLI/stdio 请求
     * @returns 无，业务可在 Native 或 App 处理
     */
    onLaunch(event) {
        void event;
    }
    /**
     * --- 向 ClickGo 页面发送 Native 事件 ---
     * @param name 事件名称
     * @param param 事件参数
     * @returns 页面是否有对应监听器
     */
    async emit(name, ...param) {
        if (!form || !token || mainNavigating || !name) {
            return false;
        }
        try {
            return (await form.webContents.executeJavaScript(`Boolean(window.clickgoNativeWeb?.invoke(${JSON.stringify(name)}, ...${JSON.stringify(param)}))`)) === true;
        }
        catch {
            return false;
        }
    }
    /**
     * --- 开始运行起来一个主实体窗体，整个进程本方法只能执行一次 ---
     * @param path 实体窗体网页路径
     * @param opt 参数
     */
    run(path, opt = {}) {
        if (opt.frame !== undefined) {
            // --- 默认 true ---
            hasFrame = opt.frame;
        }
        if (opt.quit !== undefined) {
            // --- 默认 true ---
            isNoFormQuit = opt.quit;
        }
        // --- 创建实体窗体 ---
        showMainForm(path, {
            'dev': opt.dev,
            'width': opt.width,
            'height': opt.height,
            'max': opt.max,
            'stateMax': opt.stateMax,
            'background': opt.background,
            'icon': opt.icon,
        });
        // --- 监听所有实体窗体关闭事件 ---
        electron.app.on('window-all-closed', function () {
            if (isNoFormQuit) {
                electron.app.quit();
                return;
            }
            form = undefined;
        });
        // --- 软件被活动性激活的事件 ---
        electron.app.on('activate', function () {
            if (electron.BrowserWindow.getAllWindows().length > 0) {
                return;
            }
            showMainForm(path, {
                'dev': opt.dev,
                'width': opt.width,
                'height': opt.height,
                'max': opt.max,
                'stateMax': opt.stateMax,
                'background': opt.background,
                'icon': opt.icon,
            });
        });
    }
    /**
     * --- 绑定监听网页调用方法的方法 ---
     * @param name 方法名
     * @param handler 要执行的函数
     * @param once 是否只执行一次
     */
    on(name, handler, once = false) {
        methods[name] = {
            'once': once,
            'handler': handler
        };
    }
    /**
     * --- 绑定监听网页调用方法的方法但只会执行一次 ---
     * @param name 方法名
     * @param handler 要执行的函数
     */
    once(name, handler) {
        this.on(name, handler, true);
    }
    /**
     * --- 解绑监听的方法 ---
     * @param name 方法名
     */
    off(name) {
        if (!methods[name]) {
            return;
        }
        delete methods[name];
    }
    /**
     * --- 显示一个 dialog ---
     * @param opt 选项或者一段文字
     */
    dialog(options = {}) {
        if (!form) {
            return -1;
        }
        if (typeof options === 'string') {
            options = {
                'message': options
            };
        }
        options.title ??= 'ClickGo';
        options.message ??= '';
        return electron.dialog.showMessageBoxSync(form, {
            'type': options.type,
            'title': options.title,
            'message': options.message,
            'detail': options.detail,
            'buttons': options.buttons,
        });
    }
}
/**
 * --- 加载本地路径需要使用本函数加载 ---
 * @param importUrl 传入 import.meta.url
 * @param p 要加载的相对路径，如 ./index.html
 */
export function path(importUrl, p) {
    const url = decodeURIComponent(importUrl).replace('file://', '').replace(/^\/(\w:)/, '$1');
    return nodePath.join(url.slice(0, url.lastIndexOf('/') + 1), p);
}
export function showMainForm(path, opt = {}) {
    if (form) {
        // --- 有主窗体了就不能创建了 ---
        return;
    }
    resetMainSession();
    const frm = createForm(path, {
        'width': opt.width,
        'height': opt.height,
        'max': opt.max,
        'stateMax': opt.stateMax,
        'background': opt.background,
        'icon': opt.icon,
    });
    if (opt.dev) {
        // --- 开发模式 ---
        frm.webContents.openDevTools();
    }
}
/**
 * --- 更换主页面文档时撤销旧 token，重新允许一次合法初始化 ---
 * @returns 无
 */
function resetMainSession() {
    token = '';
    methods['cg-init'] = {
        'once': true,
        handler: function (t) {
            // --- t 是网页传来的 token ---
            if ((typeof t !== 'string') || !t || !form || token) {
                return;
            }
            if (hasFrame) {
                form.resizable = true;
            }
            token = t;
        },
    };
}
/**
 * --- MCP 调用固定的页面命令适配器，禁止转发任意 JavaScript ---
 * @param request 已经由 SDK 校验的操作与参数
 * @param signal MCP 客户端取消信号
 * @returns 共享命令结果，页面失效或调用异常时为结构化错误
 */
async function invokeMcp(request, signal) {
    const target = form;
    const sessionToken = token;
    if (!target || target.isDestroyed() || !sessionToken || mainNavigating ||
        getPageUrl(target.webContents.getURL()) !== mainPage) {
        return { 'ok': false, 'error': { 'code': 'unavailable', 'message': 'The app window is not ready' } };
    }
    if (signal.aborted) {
        return { 'ok': false, 'error': { 'code': 'cancelled', 'message': 'Command was cancelled' } };
    }
    const id = randomUUID();
    /** --- 跨进程取消只针对本次调用，并限定在原文档会话 --- */
    let abort;
    const cancelled = new Promise(resolve => {
        abort = () => {
            if (!target.isDestroyed() && form === target && token === sessionToken && !mainNavigating) {
                void target.webContents.executeJavaScript(`window.clickgoNativeWeb?.command(JSON.parse(${JSON.stringify(JSON.stringify({ 'method': 'cancel', 'id': id }))}))`).catch(() => { });
            }
            resolve({ 'ok': false, 'error': { 'code': 'cancelled', 'message': 'Command was cancelled' } });
        };
        signal.addEventListener('abort', abort, { 'once': true });
    });
    // --- Electron 查询可能因网页关闭/崩溃而拒绝，只在这个跨进程边界转换错误 ---
    // --- 按 JSON 解析保留键的语义，不把参数当作 JavaScript 对象字面量 ---
    const payload = JSON.stringify(JSON.stringify({ ...request, 'id': id }));
    // --- 能力检查和调用必须在同一文档脚本中完成，避免旧运行时或导航后误调同名业务命令。 ---
    const fileGuard = request.method === 'execute' && request.name === 'clickgo.file.read'
        ? 'window.clickgoNativeWeb?.commandFileVersion === 1 && ' : '';
    const execution = target.webContents.executeJavaScript(`${fileGuard}window.clickgoNativeWeb?.command(JSON.parse(${payload}))`).then((result) => {
        if (form !== target || target.isDestroyed() || token !== sessionToken || mainNavigating) {
            return { 'ok': false, 'error': { 'code': 'unavailable', 'message': 'The app window has changed' } };
        }
        if (!result || typeof result !== 'object' || !('ok' in result) || typeof result.ok !== 'boolean') {
            return { 'ok': false, 'error': { 'code': 'unavailable', 'message': 'This page needs the updated ClickGo runtime' } };
        }
        return result;
    }).catch(() => ({
        'ok': false, 'error': { 'code': 'unavailable', 'message': 'The app window is no longer available' },
    }));
    // --- 取消可先结束协议响应；业务是否停止仍由共享执行器与 signal 决定 ---
    try {
        return await Promise.race([execution, cancelled]);
    }
    finally {
        signal.removeEventListener('abort', abort);
    }
}
/**
 * --- 为当前 Native 窗体启动本地 Streamable HTTP MCP 服务 ---
 * @param options 监听端口、访问令牌及实例发现；默认临时连接设置并允许本机同用户发现
 * @returns 连接设置，无窗体、重复启动或监听失败时为 false
 */
export async function startMcp(options = {}) {
    const target = form;
    if (!target || target.isDestroyed() || mcpServer || mcpPending) {
        return false;
    }
    const generation = mcpGeneration;
    const discovery = options.discovery !== false;
    const pending = lMcp.start(invokeMcp, options, {
        'id': createHash('sha256').update(electron.app.getPath('userData')).digest('hex').slice(0, 24),
        'name': electron.app.getName(),
        'applicationId': getApplicationId(),
    });
    mcpPending = pending;
    const service = await pending;
    mcpPending = undefined;
    if (service === false) {
        return false;
    }
    if (generation !== mcpGeneration || form !== target || target.isDestroyed()) {
        await service.close();
        return false;
    }
    mcpServer = service;
    mcpDiscovery = discovery;
    return { ...service.info };
}
/**
 * --- 读取当前 Native MCP 服务的连接设置 ---
 * @returns 独立的连接设置，未启用时为 null
 */
export function getMcpInfo() {
    return mcpServer ? { ...mcpServer.info } : null;
}
/**
 * --- 停止接收 MCP 请求并释放在途调用与监听资源 ---
 * @returns 无
 */
export async function stopMcp() {
    ++mcpGeneration;
    const pending = mcpPending;
    const service = mcpServer;
    mcpServer = undefined;
    mcpDiscovery = false;
    await service?.close();
    // --- 停止请求不能被稍后完成的监听覆盖 ---
    const starting = await pending;
    if (starting) {
        await starting.close();
    }
}
/**
 * --- 安装已校验更新，此调用授权关闭软件；失败恢复关闭确认 ---
 * @returns 当前更新状态，业务必须先完成确认和文档保存
 */
export function installUpdate() {
    if (lUpdate.getUpdateState().status === 'restarting') {
        return lUpdate.getUpdateState();
    }
    const previous = closeAllowed;
    updateCloseAllowed = previous;
    closeAllowed = true;
    const result = lUpdate.installUpdate();
    if (result.status !== 'restarting') {
        closeAllowed = previous;
        updateCloseAllowed = undefined;
    }
    return result;
}
// --- 公开状态沿用已验证的主文档会话，不向销毁或导航中的页面投递 ---
lUpdate.onUpdateState((state) => {
    if (state.status === 'error' && updateCloseAllowed !== undefined) {
        closeAllowed = updateCloseAllowed;
        updateCloseAllowed = undefined;
    }
    const target = form;
    if (!target || target.isDestroyed() || mainNavigating || !token) {
        return;
    }
    void target.webContents.executeJavaScript(`window.clickgoNativeWeb?.invoke('update-state', ${JSON.stringify(state)})`).catch(() => { });
});
/**
 * --- 获取当前桌面应用的版本，来自应用 package.json ---
 * @returns 应用版本
 */
export function getAppVersion() {
    return electron.app.getVersion();
}
/**
 * --- 判断当前应用是否为已打包运行 ---
 * @returns 是否已打包
 */
export function isPackaged() {
    return electron.app.isPackaged;
}
/**
 * --- 取得软件自身的可执行文件，AppImage 使用原镜像路径 ---
 * @returns 可执行文件的绝对路径
 */
function getExecutablePath() {
    const appImage = process.env['APPIMAGE'];
    const appDir = process.env['APPDIR'];
    // --- 只识别自己的 AppImage 挂载，不能误用 AI 客户端继承过来的镜像环境 ---
    if (electron.app.isPackaged && process.platform === 'linux' && appImage && appDir &&
        process.execPath.startsWith(`${nodePath.resolve(appDir)}${nodePath.sep}`)) {
        return appImage;
    }
    return process.execPath;
}
/**
 * --- 同一安装的 GUI 与命令进程共用归属，不依赖启动目录或自定义的 MCP ID ---
 * @returns 软件归属标识；AppImage 使用原镜像路径，避免每次挂载位置不同
 */
function getApplicationId() {
    const source = electron.app.isPackaged ? getExecutablePath() : electron.app.getAppPath();
    return createHash('sha256').update(source).digest('hex').slice(0, 24);
}
/**
 * --- 取得软件自身的 CLI/stdio 启动入口，开发模式保留实际入口文件 ---
 * @returns 独立的入口信息；调用方在 args 后追加 --cli 或 --mcp
 */
export function getCommandEntry() {
    const args = [];
    // --- 保留宿主已经显式采用的沙箱启动选项，子进程须在 Chromium 初始化前收到它 ---
    if (electron.app.commandLine.hasSwitch('no-sandbox')) {
        args.push('--no-sandbox');
    }
    if (!electron.app.isPackaged) {
        let entry = electron.app.getAppPath();
        // --- 遵循 Electron 默认启动器的入口选择，调试开关及 require 模块不属于 App 入口 ---
        for (let i = 1; i < process.argv.length; ++i) {
            const arg = process.argv[i];
            if (arg === '--require' || arg === '-r') {
                ++i;
                continue;
            }
            if (arg.startsWith('--app=')) {
                entry = arg.slice(6);
                break;
            }
            if (arg.startsWith('-')) {
                continue;
            }
            entry = arg;
            break;
        }
        args.push(nodePath.resolve(entry));
    }
    return {
        'name': electron.app.getName(), 'platform': platform, 'command': getExecutablePath(),
        'args': args,
        'startup': commandAutoStart ? 'auto' : 'existing',
        'mcp': { 'enabled': mcpServer !== undefined, 'discovery': mcpDiscovery },
    };
}
/**
 * --- 用户调用运行 boot 类 ---
 * @param boot 启动类实例
 * @param options 进程启动选项
 * @returns 无
 */
export function launcher(boot, options = {}) {
    commandAutoStart = options.commandAutoStart ?? false;
    lUpdate.setEnabled(options.updates ?? false);
    const offset = process.defaultApp ? 2 : 1;
    const args = process.argv.slice(offset);
    const modeIndex = args.findIndex(arg => arg === '--cli' || arg === '--mcp');
    if (modeIndex >= 0) {
        // --- 命令进程先分流，不能占用 GUI 的单实例锁、打开文件或执行业务启动方法 ---
        electron.app.disableHardwareAcceleration();
        electron.app.commandLine.appendSwitch('headless');
        const controller = new AbortController();
        // --- Electron 会自行处理进程中断，先取消请求再允许退出，避免结果和取消通知丢失 ---
        const beforeQuit = (event) => {
            event.preventDefault();
            controller.abort();
        };
        electron.app.on('before-quit', beforeQuit);
        const commandArgs = args[modeIndex] === '--mcp' ? ['mcp', ...args.slice(modeIndex + 1)] :
            args.slice(modeIndex + 1);
        void lCli.run(commandArgs, {
            'applicationId': getApplicationId(), 'command': nodePath.basename(process.execPath),
            'signal': controller.signal,
            'startup': commandAutoStart ? getCommandEntry() : undefined,
        }).then(() => {
            // --- 排空 JSON / 协议输出后结束当前接入进程，不能退出原来的 GUI ---
            process.stdout.write('', () => { electron.app.exit(Number(process.exitCode ?? 0)); });
        }).catch(() => {
            process.stderr.write('The command interface failed.\n', () => { electron.app.exit(1); });
        }).finally(() => {
            electron.app.removeListener('before-quit', beforeQuit);
        });
        return;
    }
    (async function () {
        if (options.singleInstance && !electron.app.requestSingleInstanceLock()) {
            electron.app.quit();
            return;
        }
        launchBoot = boot;
        fileOpenBoot = options.openFiles ? boot : undefined;
        if (options.openFiles) {
            electron.app.on('open-file', function (event, path) {
                event.preventDefault();
                activateMainForm();
                dispatchOpenFiles([path], process.cwd(), 'association');
            });
        }
        const offset = process.defaultApp ? 2 : 1;
        dispatchLaunch(process.argv.slice(offset), process.cwd(), 'startup');
        if (options.singleInstance) {
            electron.app.on('second-instance', function (_event, argv, cwd) {
                activateMainForm();
                const offset = process.defaultApp ? 2 : 1;
                dispatchLaunch(argv.slice(offset), cwd, 'second-instance');
            });
        }
        // --- 等到 native 环境装载完毕 ---
        await electron.app.whenReady();
        await lFs.refreshDrives();
        // --- 执行回调 ---
        await boot.main();
    })().catch(function () {
        return;
    });
}
// --- 系统启动 ---
electron.Menu.setApplicationMenu(null);
// --- 实际用来监听网页传输过来的数据 ---
electron.ipcMain.handle('pre', function (e, name, ...param) {
    if (!form || form.isDestroyed() || mainNavigating ||
        (e.sender !== form.webContents) ||
        !e.senderFrame || (e.senderFrame !== form.webContents.mainFrame) ||
        !mainPage || (getPageUrl(e.senderFrame.url) !== mainPage) ||
        (typeof name !== 'string') || !Object.hasOwn(methods, name)) {
        return;
    }
    // --- 无效初始化不能消耗一次性监听 ---
    if ((name === 'cg-init') && ((typeof param[0] !== 'string') || !param[0] || token)) {
        return;
    }
    const method = methods[name];
    if (method.once) {
        delete methods[name];
    }
    return method.handler(...param);
});
// --- 预加载层已用 webUtils 取得真实拖入文件，主进程仍须限制为当前实体窗体 ---
electron.ipcMain.on('drop-files', function (event, paths) {
    if (!form || form.isDestroyed() || mainNavigating || (event.sender !== form.webContents) ||
        event.senderFrame !== form.webContents.mainFrame || !Array.isArray(paths)) {
        return;
    }
    dispatchOpenFiles(paths, process.cwd(), 'drop');
});
// --- 只有显式启用 openFiles 的应用才由预加载层接管文件拖入 ---
electron.ipcMain.on('file-open-enabled', function (event) {
    event.returnValue = Boolean(fileOpenBoot && form && !form.isDestroyed() && (event.sender === form.webContents));
});
/**
 * --- 精确匹配页面地址，允许同一页面改变 hash ---
 * @param value 页面地址
 * @returns 不含 hash 的地址，无效地址返回空字符串
 */
function getPageUrl(value) {
    try {
        const url = new URL(value);
        url.hash = '';
        return url.href;
    }
    catch {
        return '';
    }
}
/**
 * --- 验证 token 是否正确 ---
 * @param t 要验证的 token
 */
export function verifyToken(t) {
    return (typeof t === 'string') && (token !== '') && (t === token);
}
/**
 * --- 内部调用用来创建实体窗体的函数 ---
 * @param p 窗体网页路径
 */
function createForm(p, opt = {}) {
    const url = decodeURIComponent(import.meta.url).replace('file://', '').replace(/^\/(\w:)/, '$1');
    let pre = nodePath.join(url.slice(0, url.lastIndexOf('/') + 1), './pre.js');
    const op = {
        'webPreferences': {
            'nodeIntegration': false,
            'contextIsolation': true,
            'preload': pre,
        },
        'width': opt.width ?? (hasFrame ? 800 : 600),
        'height': opt.height ?? (hasFrame ? 700 : 400),
        'frame': hasFrame,
        'resizable': false,
        'show': false,
        'center': true,
        'maximizable': opt.max ?? true,
        'backgroundColor': opt.background ?? 'rgba(0, 0, 0, 1)',
        'icon': opt.icon,
        'transparent': opt.transparent,
    };
    form = new electron.BrowserWindow(op);
    minimumSize = [0, 0];
    closeAllowed = false;
    const frm = form;
    let closePending = false;
    // --- 沉浸式窗口的系统关闭（如 Alt+F4）交给首个 ClickGo Form 确认 ---
    frm.on('close', (event) => {
        if (hasFrame || closeAllowed || !token || mainNavigating) {
            return;
        }
        event.preventDefault();
        if (closePending) {
            return;
        }
        closePending = true;
        const sessionToken = token;
        frm.webContents.executeJavaScript('Boolean(window.clickgoNativeWeb?.invoke("close-request"))').then((handled) => {
            // --- 尚未挂载 ClickGo 窗体的启动页仍可正常关闭 ---
            if (!handled && !frm.isDestroyed() && (form === frm) && (token === sessionToken)) {
                closeAllowed = true;
                frm.close();
            }
        }).catch(() => {
            // --- 网页异常时不静默丢弃可能尚未保存的文档 ---
        }).finally(() => {
            closePending = false;
        });
    });
    // --- 页面地址由本地主进程确定，不接受网页修改 ---
    const lio = p.indexOf('?');
    // --- 本地相对路径与 Electron loadFile 一样以应用根目录为基准 ---
    const pageUrl = (p.startsWith('https://') || p.startsWith('http://')) ?
        new URL(p) : pathToFileURL(nodePath.resolve(electron.app.getAppPath(), lio === -1 ? p : p.slice(0, lio)));
    if ((pageUrl.protocol === 'file:') && (lio !== -1)) {
        pageUrl.search = p.slice(lio + 1);
    }
    mainPage = getPageUrl(pageUrl.href);
    mainNavigating = true;
    /** --- 主动拦截初始页面重定向产生的加载失败无需再次抛出 --- */
    let redirectBlocked = false;
    form.webContents.on('will-navigate', (event) => {
        if (getPageUrl(event.url) !== mainPage) {
            event.preventDefault();
        }
    });
    form.webContents.on('will-redirect', (event) => {
        if (event.isMainFrame && (getPageUrl(event.url) !== mainPage)) {
            redirectBlocked = true;
            event.preventDefault();
            mainNavigating = false;
        }
    });
    form.webContents.setWindowOpenHandler(() => ({ 'action': 'deny' }));
    form.webContents.on('did-start-navigation', (event) => {
        if (event.isMainFrame && !event.isSameDocument && (getPageUrl(event.url) === mainPage)) {
            mainNavigating = true;
            resetMainSession();
        }
    });
    form.webContents.on('did-navigate', () => {
        mainNavigating = false;
        if (form && (getPageUrl(form.webContents.getURL()) !== mainPage)) {
            token = '';
            delete methods['cg-init'];
        }
    });
    form.webContents.on('did-fail-load', (_event, _code, _description, _url, isMainFrame) => {
        if (isMainFrame) {
            mainNavigating = false;
        }
    });
    form.webContents.on('render-process-gone', () => {
        token = '';
        mainNavigating = true;
    });
    form.webContents.userAgent = 'electron/' + electron.app.getVersion() + ' ' + platform + '/' + process.arch + ' frame/' + (hasFrame ? '1' : '0') + ' chrome/' + process.versions.chrome;
    form.once('ready-to-show', function () {
        if (!form) {
            return;
        }
        if (opt.background) {
            form.setBackgroundColor(opt.transparent ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 1)');
        }
        form.show();
        if (opt.stateMax) {
            form.maximize();
        }
    });
    if (p.startsWith('https://') || p.startsWith('http://')) {
        // --- 加载网页 ---
        form.loadURL(p).catch(function (e) {
            if (redirectBlocked) {
                return;
            }
            throw e;
        });
    }
    else {
        // --- 加载本地文件 ---
        const lio = p.indexOf('?');
        const search = lio === -1 ? '' : p.slice(lio + 1);
        if (lio !== -1) {
            p = p.slice(0, lio);
        }
        form.loadFile(p, {
            'search': search
        }).catch(function (e) {
            throw e;
        });
    }
    form.on('closed', function () {
        stopMcp().catch(() => { });
        form = undefined;
        token = '';
        mainPage = '';
        mainNavigating = false;
        delete methods['cg-init'];
    });
    // --- 最大化事件 ---
    form.on('maximize', function () {
        form?.webContents.executeJavaScript('if(window.clickgoNativeWeb){clickgoNativeWeb.invoke("maximize")}');
    });
    // --- 最大化还原 ---
    form.on('unmaximize', function () {
        form?.webContents.executeJavaScript('if(window.clickgoNativeWeb){clickgoNativeWeb.invoke("unmaximize")}');
    });
    return form;
}
