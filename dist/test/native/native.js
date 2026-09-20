import * as electron from 'electron';
import * as nodeFs from 'node:fs';
import * as nodePath from 'path';
import { pathToFileURL } from 'node:url';
import * as lFs from './lib/fs.js';
import * as lTool from './lib/tool.js';
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
/** --- 应用已确认关闭，避免再次进入网页关闭事件 --- */
let closeAllowed = false;
/** --- 当前启用系统文件打开处理的启动类 --- */
let fileOpenBoot;
/** --- 当前系统平台 --- */
const platform = process.platform;
// const platform: NodeJS.Platform = 'darwin';
/** --- 监听前台的执行的方法，内置的方法，用户可调用方法自行添加 --- */
const methods = {
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
 * @returns 无
 */
function dispatchOpenFiles(paths, cwd) {
    if (!fileOpenBoot) {
        return;
    }
    const parsed = normalizeFilePaths(paths, cwd);
    if (parsed.length) {
        fileOpenBoot.onOpenFiles(parsed);
    }
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
     * @returns 无
     */
    onOpenFiles(paths) {
        void paths;
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
 * --- 用户调用运行 boot 类 ---
 * @param boot 启动类实例
 * @param options 进程启动选项
 * @returns 无
 */
export function launcher(boot, options = {}) {
    (async function () {
        if (options.singleInstance && !electron.app.requestSingleInstanceLock()) {
            electron.app.quit();
            return;
        }
        fileOpenBoot = options.openFiles ? boot : undefined;
        if (options.openFiles) {
            electron.app.on('open-file', function (event, path) {
                event.preventDefault();
                activateMainForm();
                dispatchOpenFiles([path], process.cwd());
            });
            const offset = process.defaultApp ? 2 : 1;
            dispatchOpenFiles(process.argv.slice(offset), process.cwd());
        }
        if (options.singleInstance) {
            electron.app.on('second-instance', function (_event, argv, cwd) {
                activateMainForm();
                if (options.openFiles) {
                    const offset = process.defaultApp ? 2 : 1;
                    dispatchOpenFiles(argv.slice(offset), cwd);
                }
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
    if (!form || form.isDestroyed() || (event.sender !== form.webContents) || !Array.isArray(paths)) {
        return;
    }
    dispatchOpenFiles(paths, process.cwd());
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
