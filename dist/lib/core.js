import * as clickgo from '../clickgo';
import * as lFs from './fs';
import * as lForm from './form';
import * as lTask from './task';
import * as lTool from './tool';
import * as lZip from './zip';
/** --- 系统级 ID --- */
let sysId = '';
/**
 * --- 初始化系统级 ID，仅能设置一次 ---
 * @param id 系统级 ID
 */
export function initSysId(id) {
    if (sysId) {
        return;
    }
    sysId = id;
}
/** --- Config 原始参考对象 --- */
const configOrigin = {
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null,
    'launcher.list': [],
};
/** --- Config 配置对象 --- */
export let config;
/** --- App 抽象类 --- */
export class AbstractApp {
    /** --- 当前 js 文件在包内的完整路径 --- */
    filename = '';
    /** --- 系统会自动设置本项 --- */
    taskId = '';
    /**
     * --- 以某个窗体进行正式启动这个 app（入口 form），不启动则任务也启动失败 ---
     * @param form 窗体对象
     */
    async run(form) {
        await form.show();
    }
    onError() {
        return;
    }
    onScreenResize() {
        return;
    }
    onConfigChanged() {
        return;
    }
    onFormCreated() {
        return;
    }
    onFormRemoved() {
        return;
    }
    onFormTitleChanged() {
        return;
    }
    onFormIconChanged() {
        return;
    }
    onFormStateMinChanged() {
        return;
    }
    onFormStateMaxChanged() {
        return;
    }
    onFormShowChanged() {
        return;
    }
    onFormFocused() {
        return;
    }
    onFormBlurred() {
        return;
    }
    onFormFlash() {
        return;
    }
    onFormShowInSystemTaskChange() {
        return;
    }
    onFormHashChange() {
        return;
    }
    onTaskStarted() {
        return;
    }
    onTaskEnded() {
        return;
    }
    onLauncherFolderNameChanged() {
        return;
    }
    onHashChanged() {
        return;
    }
    onKeydown() {
        return;
    }
    onKeyup() {
        return;
    }
}
/** --- boot 类 --- */
let boot;
export function setBoot(b) {
    if (boot) {
        return;
    }
    b.setSysId(sysId);
    boot = b;
}
/** --- 系统要处理的全局响应事件 --- */
const globalEvents = {
    screenResize: function () {
        lForm.refreshMaxPosition();
    },
    formRemoved: function (taskId, formId) {
        if (!lForm.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        delete lForm.simpleSystemTaskRoot.forms[formId];
    },
    formTitleChanged: function (taskId, formId, title) {
        if (!lForm.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        lForm.simpleSystemTaskRoot.forms[formId].title = title;
    },
    formIconChanged: function (taskId, formId, icon) {
        if (!lForm.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        lForm.simpleSystemTaskRoot.forms[formId].icon = icon;
    },
    formStateMinChanged: function (taskId, formId, state) {
        if (lTask.systemTaskInfo.taskId) {
            return;
        }
        if (state) {
            const item = lForm.get(formId);
            if (!item) {
                return;
            }
            lForm.simpleSystemTaskRoot.forms[formId] = {
                'title': item.title,
                'icon': item.icon
            };
        }
        else {
            if (!lForm.simpleSystemTaskRoot.forms[formId]) {
                return;
            }
            delete lForm.simpleSystemTaskRoot.forms[formId];
        }
    }
};
/**
 * --- 主动触发系统级事件，用 this.trigger 替代 ---
 */
export async function trigger(name, taskId = '', formId = '', param1 = '', param2 = '', param3 = true) {
    const taskList = await lTask.getOriginList(sysId);
    const eventName = 'on' + name[0].toUpperCase() + name.slice(1);
    switch (name) {
        case 'error': {
            // --- boot 是抽象类，具体实现的方法是动态的 ---
            boot?.[eventName](taskId, formId, param1, param2);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if (!taskId || (taskId === tid) || rt?.permissions.includes('root')) {
                    // --- 动态调用 app 实例的方法 ---
                    t.class?.[eventName](taskId, formId, param1, param2);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2);
                    }
                }
            }
            break;
        }
        case 'screenResize': {
            globalEvents.screenResize();
            // --- boot 是抽象类，具体实现的方法是动态的 ---
            boot?.[eventName]();
            for (const tid in taskList) {
                const t = taskList[tid];
                // --- 动态调用 app 实例的方法 ---
                t.class?.[eventName]();
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.();
                }
            }
            break;
        }
        case 'configChanged': {
            // --- boot 是抽象类，具体实现的方法是动态的 ---
            boot?.[eventName]();
            for (const tid in taskList) {
                const t = taskList[tid];
                // --- 动态调用 app 实例的方法 ---
                t.class?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            globalEvents[name]?.(taskId, formId, param1, param2, param3);
            boot?.[eventName](taskId, formId, param1, param2, param3);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1, param2, param3);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2, param3);
                    }
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            globalEvents[name]?.(taskId, formId, param1);
            boot?.[eventName](taskId, formId, param1);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                    }
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            globalEvents[name]?.(taskId, formId, param1);
            boot?.[eventName](taskId, formId, param1);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                    }
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            globalEvents[name]?.(taskId, formId);
            boot?.[eventName](taskId, formId);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId);
                    }
                }
            }
            break;
        }
        case 'formShowInSystemTaskChange': {
            globalEvents[name]?.(taskId, formId, param1);
            boot?.[eventName](taskId, formId, param1);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                    }
                }
            }
            break;
        }
        case 'formHashChange': {
            globalEvents[name]?.(taskId, formId, param1, param2);
            boot?.[eventName](taskId, formId, param1, param2);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1, param2);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2);
                    }
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            globalEvents[name]?.(taskId, formId);
            boot?.[eventName](taskId, formId);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId);
                    }
                }
            }
            break;
        }
        case 'launcherFolderNameChanged': {
            boot?.[eventName](taskId, formId);
            for (const tid in taskList) {
                const t = taskList[tid];
                t.class?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'hashChanged': {
            boot?.[eventName](taskId);
            for (const tid in taskList) {
                const t = taskList[tid];
                t.class?.[eventName](taskId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId);
                }
            }
            break;
        }
        case 'keydown':
        case 'keyup': {
            globalEvents[name]?.(taskId);
            boot?.[eventName](taskId);
            for (const tid in taskList) {
                const t = taskList[tid];
                t.class?.[eventName](taskId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId);
                }
            }
            break;
        }
    }
}
/** --- CGA 文件头标识 --- */
const cgaMagic = '-CGA-';
/** --- CGA 内部格式版本 --- */
const cgaVersion = 1;
/** --- CGA 固定文件头长度 --- */
const cgaHeaderLength = 106;
/** --- CGA 密钥派生上下文 --- */
const cgaKeyContext = new TextEncoder().encode('ClickGo/Application/Package');
/** --- CGA 应用包读取器 --- */
class AppPackage {
    _blob;
    _dataOffset;
    _key;
    _packageId;
    _manifest;
    /** --- 已解密数据块缓存 --- */
    _blockCache = new Map();
    constructor(_blob, _dataOffset, _key, _packageId, _manifest) {
        this._blob = _blob;
        this._dataOffset = _dataOffset;
        this._key = _key;
        this._packageId = _packageId;
        this._manifest = _manifest;
    }
    /**
     * --- 从 CGA 创建应用包读取器 ---
     * @param blob CGA 文件
     */
    static async create(blob) {
        if (blob.size < cgaHeaderLength) {
            return false;
        }
        try {
            const header = new Uint8Array(await blob.slice(0, cgaHeaderLength).arrayBuffer());
            if (new TextDecoder().decode(header.slice(0, 5)) !== cgaMagic) {
                return false;
            }
            const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
            if (view.getUint8(5) !== cgaVersion) {
                return false;
            }
            const iconLength = view.getUint32(6);
            const manifestLength = view.getUint32(10);
            const manifestOffset = cgaHeaderLength + iconLength;
            const dataOffset = manifestOffset + manifestLength;
            if ((manifestOffset > blob.size) || (dataOffset > blob.size)) {
                return false;
            }
            const packageId = header.slice(14, 30);
            const salt = header.slice(30, 62);
            const maskedSeed = header.slice(62, 94);
            const manifestNonce = header.slice(94, 106);
            const seed = unmaskCgaSeed(maskedSeed, salt, packageId);
            const key = await deriveCgaKey(seed, salt, packageId);
            const encryptedManifest = await blob.slice(manifestOffset, dataOffset).arrayBuffer();
            const manifestBuffer = await decryptCga(encryptedManifest, key, manifestNonce, getCgaAad(packageId, 'manifest'));
            const manifest = JSON.parse(new TextDecoder().decode(manifestBuffer));
            if (!manifest.b || !manifest.f) {
                return false;
            }
            const icon = iconLength ? await lTool.blob2DataUrl(blob.slice(cgaHeaderLength, cgaHeaderLength + iconLength)) : '';
            return {
                'icon': icon,
                'package': new AppPackage(blob, dataOffset, key, packageId, manifest),
            };
        }
        catch {
            return false;
        }
    }
    /**
     * --- 读取包内文件 ---
     * @param path 文件路径
     */
    async getContent(path) {
        path = normalizeCgaPath(path);
        const file = this._manifest.f[path];
        if (!file) {
            return null;
        }
        const block = await this._getBlock(file.b);
        if (!block) {
            return null;
        }
        if (file.t) {
            const content = await block.getContent(file.e, 'string');
            return content?.replace(/^\ufeff/, '') ?? null;
        }
        const content = await block.getContent(file.e, 'arraybuffer');
        if (!content) {
            return null;
        }
        return new Blob([content], {
            'type': lTool.getMimeByPath(path).mime,
        });
    }
    /**
     * --- 获取包内文件或目录信息 ---
     * @param path 文件或目录路径
     */
    stats(path) {
        path = normalizeCgaPath(path);
        const file = this._manifest.f[path];
        if (file) {
            return {
                'isDirectory': false,
                'isFile': true,
                'size': file.s,
            };
        }
        const dir = path.endsWith('/') ? path : `${path}/`;
        for (const filePath in this._manifest.f) {
            if (filePath.startsWith(dir)) {
                return {
                    'isDirectory': true,
                    'isFile': false,
                    'size': 0,
                };
            }
        }
        return null;
    }
    /**
     * --- 读取包内目录 ---
     * @param path 目录路径
     */
    readDir(path) {
        path = normalizeCgaPath(path);
        if (!path.endsWith('/')) {
            path += '/';
        }
        const entries = new Map();
        for (const filePath in this._manifest.f) {
            if (!filePath.startsWith(path)) {
                continue;
            }
            const relative = filePath.slice(path.length);
            const split = relative.indexOf('/');
            const name = split === -1 ? relative : relative.slice(0, split);
            if (!name || entries.has(name)) {
                continue;
            }
            entries.set(name, {
                'isDirectory': split !== -1,
                'isFile': split === -1,
                'name': name,
            });
        }
        return [...entries.values()].sort((a, b) => a.name.localeCompare(b.name));
    }
    /** --- 清除已解密数据块缓存 --- */
    clear() {
        this._blockCache.clear();
    }
    /**
     * --- 解密并打开指定数据块 ---
     * @param id 数据块 ID
     */
    _getBlock(id) {
        const cached = this._blockCache.get(id);
        if (cached) {
            return cached;
        }
        const preparing = (async () => {
            const block = this._manifest.b[id];
            if (!block || (block.o < 0) || (block.l <= 16)) {
                return null;
            }
            const start = this._dataOffset + block.o;
            const end = start + block.l;
            if ((start < this._dataOffset) || (end > this._blob.size)) {
                return null;
            }
            try {
                const data = await this._blob.slice(start, end).arrayBuffer();
                const decrypted = await decryptCga(data, this._key, base64ToBytes(block.n), getCgaAad(this._packageId, id));
                return await lZip.get(new Blob([decrypted]));
            }
            catch {
                return null;
            }
        })();
        this._blockCache.set(id, preparing);
        return preparing;
    }
}
/**
 * --- 还原包级密钥种子 ---
 * @param masked 已打散种子
 * @param salt 随机盐
 * @param packageId 包 ID
 */
function unmaskCgaSeed(masked, salt, packageId) {
    const seed = new Uint8Array(masked.length);
    const shift = packageId[0] % seed.length;
    for (let i = 0; i < seed.length; ++i) {
        seed[(i + shift) % seed.length] = masked[i] ^ salt[i]
            ^ packageId[i % packageId.length] ^ ((i * 29 + 17) & 0xff);
    }
    return seed;
}
/**
 * --- 派生应用内容解密密钥 ---
 * @param seed 包级随机种子
 * @param salt 随机盐
 * @param packageId 包 ID
 */
async function deriveCgaKey(seed, salt, packageId) {
    const material = concatCgaBytes(seed, salt, packageId, cgaKeyContext);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', material);
    return globalThis.crypto.subtle.importKey('raw', digest, {
        'name': 'AES-GCM',
    }, false, ['decrypt']);
}
/**
 * --- 解密 CGA 数据块 ---
 * @param data 密文及认证标签
 * @param key 解密密钥
 * @param nonce 随机数
 * @param aad 附加认证数据
 */
function decryptCga(data, key, nonce, aad) {
    return globalThis.crypto.subtle.decrypt({
        'name': 'AES-GCM',
        'iv': nonce,
        'additionalData': aad,
        'tagLength': 128,
    }, key, data);
}
/**
 * --- 获取 CGA 数据块附加认证数据 ---
 * @param packageId 包 ID
 * @param name 数据块名
 */
function getCgaAad(packageId, name) {
    return concatCgaBytes(packageId, new TextEncoder().encode(name));
}
/**
 * --- 合并 Uint8Array ---
 * @param items 字节数组列表
 */
function concatCgaBytes(...items) {
    const length = items.reduce((total, item) => total + item.length, 0);
    const result = new Uint8Array(length);
    let offset = 0;
    for (const item of items) {
        result.set(item, offset);
        offset += item.length;
    }
    return result;
}
/**
 * --- Base64 转字节数组 ---
 * @param value Base64 字符串
 */
function base64ToBytes(value) {
    const text = atob(value);
    const result = new Uint8Array(text.length);
    for (let i = 0; i < text.length; ++i) {
        result[i] = text.charCodeAt(i);
    }
    return result;
}
/**
 * --- 标准化 CGA 包内路径 ---
 * @param path 包内路径
 */
function normalizeCgaPath(path) {
    return '/' + path.replace(/^\/+/, '');
}
/**
 * --- cga blob 文件解包 ---
 * @param blob blob 对象
 */
export async function readApp(blob) {
    const packageData = await AppPackage.create(blob);
    if (!packageData) {
        return false;
    }
    const configContent = await packageData.package.getContent('/config.json');
    if (!configContent) {
        return false;
    }
    if (typeof configContent !== 'string') {
        return false;
    }
    const config = JSON.parse(configContent);
    return {
        'type': 'app',
        'config': config,
        'icon': packageData.icon,
        'package': packageData.package,
    };
}
/**
 * --- 从网址下载应用 ---
 * @param taskId 所属任务 ID
 * @param url 对于当前网页的相对、绝对路径，以 .cga 结尾的文件
 * @param opt 选项
 */
export async function fetchApp(taskId, url, opt = {}) {
    /** --- notify 配置项 --- */
    const notify = opt.notify ?
        (typeof opt.notify === 'number' ?
            {
                'id': opt.notify,
                'loaded': 0,
                'total': 0,
            } :
            opt.notify) :
        {
            'id': undefined,
            'loaded': 0,
            'total': 0,
        };
    const notifyId = notify.id;
    const notifyLoaded = notify.loaded ?? 0;
    const notifyTotal = notify.total ?? 0;
    if (!url.endsWith('.cga')) {
        return null;
    }
    if (!url.startsWith('/clickgo/') &&
        !url.startsWith('/storage/') &&
        !url.startsWith('/mounted/') &&
        !url.startsWith('/package/') &&
        !url.startsWith('/current/') &&
        !url.startsWith('http:') &&
        !url.startsWith('https:') &&
        !url.startsWith('file:')) {
        url = lTool.urlResolve(window.location.href, url);
    }
    try {
        const blob = await lFs.getContent(taskId, url, {
            progress: (loaded, total) => {
                let per = loaded / total;
                per = notifyTotal ?
                    Math.min((notifyLoaded / notifyTotal) + (1 / notifyTotal * per), 1) :
                    per;
                if (notifyId) {
                    lForm.notifyProgress(notifyId, per);
                }
                if (opt.progress) {
                    opt.progress(loaded, total, per);
                }
            },
            'after': opt.after,
        });
        if ((blob === null) || typeof blob === 'string') {
            return null;
        }
        if (notifyId) {
            lForm.notifyProgress(notifyId, notifyTotal ? ((notifyLoaded + 1) / notifyTotal) : 1);
        }
        return await readApp(blob) || null;
    }
    catch {
        return null;
    }
}
/**
 * --- 获取屏幕可用区域 ---
 */
export function getAvailArea() {
    if (Object.keys(lForm.simpleSystemTaskRoot.forms).length > 0) {
        return {
            'left': 0,
            'top': 0,
            'width': window.innerWidth,
            'height': window.innerHeight - 46,
            'owidth': window.innerWidth,
            'oheight': window.innerHeight
        };
    }
    else {
        let left = 0;
        let top = 0;
        let width = 0;
        let height = 0;
        switch (config['task.position']) {
            case 'left': {
                left = lTask.systemTaskInfo.length;
                top = 0;
                width = window.innerWidth - lTask.systemTaskInfo.length;
                height = window.innerHeight;
                break;
            }
            case 'right': {
                left = 0;
                top = 0;
                width = window.innerWidth - lTask.systemTaskInfo.length;
                height = window.innerHeight;
                break;
            }
            case 'top': {
                left = 0;
                top = lTask.systemTaskInfo.length;
                width = window.innerWidth;
                height = window.innerHeight - lTask.systemTaskInfo.length;
                break;
            }
            case 'bottom': {
                left = 0;
                top = 0;
                width = window.innerWidth;
                height = window.innerHeight - lTask.systemTaskInfo.length;
            }
        }
        return {
            'left': left,
            'top': top,
            'width': width,
            'height': height,
            'owidth': window.innerWidth,
            'oheight': window.innerHeight
        };
    }
}
/**
 * --- 修改浏览器 hash ---
 * @param current 当前任务 id
 * @param hash 修改的值，不含 #
 */
export async function hash(current, hash) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const p = await lTask.checkPermission(current, 'hash');
    if (!p[0]) {
        return false;
    }
    window.location.hash = hash;
    return true;
}
/**
 * --- 获取当前浏览器的 hash ---
 */
export function getHash() {
    return window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '';
}
/**
 * --- 获取当前浏览器的 host ---
 */
export function getHost() {
    const match = /https?:\/\/([-a-zA-Z0-9:.]+)/.exec(window.location.href);
    if (!match) {
        return '';
    }
    return match[1];
}
/**
 * --- 对浏览器做跳转操作 ---
 * @param current 当前任务 id
 * @param url 要跳转的新 URL
 */
export async function location(current, url) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const p = await lTask.checkPermission(current, 'location');
    if (!p[0]) {
        return false;
    }
    window.location.href = url;
    return true;
}
/**
 * --- 获取当前的浏览器的 url ---
 */
export function getLocation() {
    return window.location.href;
}
/**
 * --- 对浏览器做返回操作 ---
 * @param current 当前任务 id
 */
export async function back(current) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const p = await lTask.checkPermission(current, 'location');
    if (!p[0]) {
        return false;
    }
    window.history.back();
    return true;
}
/**
 * --- 打开新的标签页
 * @param url 要访问的网址
 */
export function open(url) {
    window.open(url);
}
window.addEventListener('hashchange', function () {
    trigger('hashChanged', window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '').catch(() => { });
});
/** --- 注册的模块列表 --- */
const modules = {
    'monaco-editor': {
        func: async function () {
            return new Promise(resolve => {
                fetch(clickgo.getCdn() + '/npm/monaco-editor@0.52.2/min/vs/loader.js')
                    .then(r => r.blob())
                    .then(b => lTool.blob2DataUrl(b))
                    .then(d => {
                    resolve(d);
                })
                    .catch(() => {
                    resolve(null);
                });
            });
        },
        'loading': false,
        'resolve': [],
    },
    'xterm': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/xterm@5.3.0/lib/xterm.js`,
                `${clickgo.getCdn()}/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js`,
                `${clickgo.getCdn()}/npm/xterm-addon-webgl@0.16.0/lib/xterm-addon-webgl.js`
            ]);
            if (!window.Terminal) {
                throw Error('Xterm load failed.');
            }
            await lTool.loadLinks([
                `${clickgo.getCdn()}/npm/xterm@5.3.0/css/xterm.min.css`
            ]);
            lTool.loadStyle('.xterm-viewport::-webkit-scrollbar{display:none;}');
            return {
                'Terminal': window.Terminal,
                'FitAddon': window.FitAddon.FitAddon,
                'WebglAddon': window.WebglAddon.WebglAddon,
            };
        },
        'loading': false,
        'resolve': [],
    },
    'echarts': {
        func: async function () {
            await lTool.loadScript(`${clickgo.getCdn()}/npm/echarts@6.0.0/dist/echarts.min.js`);
            if (!window.echarts) {
                throw Error('Echarts load failed.');
            }
            return window.echarts;
        },
        'loading': false,
        'resolve': [],
    },
    '@toast-ui/editor': {
        func: async function () {
            await lTool.loadScripts([
                lTool.urlResolve(clickgo.getDirname() + '/', './ext/toastui-editor-all.min.js'),
            ]);
            if (!window.toastui.Editor) {
                throw Error('Tuieditor load failed.');
            }
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/zh-cn.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/zh-tw.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/ja-jp.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/ko-kr.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/es-es.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/de-de.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/fr-fr.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/pt-br.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/ru-ru.min.js`,
            ]);
            await lTool.loadLinks([
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/toastui-editor.min.css`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/theme/toastui-editor-dark.css`,
            ]);
            lTool.loadStyle('.toastui-editor-defaultUI-toolbar,.ProseMirror{box-sizing:initial !important}.toastui-editor-main{background:var(--g-plain-background);border-radius:0 0 3px 3px}.ProseMirror{cursor:text}.jodit ::-webkit-scrollbar{width:6px;cursor:default;}.jodit ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:3px;}.jodit ::-webkit-scrollbar-thumb:hover{background: rgba(0,0,0,.2);}');
            return window.toastui;
        },
        'loading': false,
        'resolve': []
    },
    'konva': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/konva@10.2.3/konva.min.js`,
            ]);
            if (!window.Konva) {
                throw Error('Konva load failed.');
            }
            return window.Konva;
        },
        'loading': false,
        'resolve': []
    },
    'jodit': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/jodit@4.2.27/es2015/jodit.fat.min.js`,
            ]);
            await lTool.loadLinks([
                `${clickgo.getCdn()}/npm/jodit@4.2.27/es2015/jodit.fat.min.css`,
            ]);
            lTool.loadStyle('.jodit-container:not(.jodit_inline){border:none;display:flex;flex-direction:column;}.jodit-container:not(.jodit_inline) .jodit-workplace{cursor:text;flex:1;}.jodit-wysiwyg a{color:unset;}');
            return window.Jodit;
        },
        'loading': false,
        'resolve': [],
    },
    'fabric': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/fabric@7.2.0/dist/index.min.js`
            ]);
            if (!window.fabric) {
                throw Error('fabric load failed.');
            }
            return window.fabric;
        },
        'loading': false,
        'resolve': [],
    },
    'pdfjs': {
        func: async function () {
            try {
                const m = await import(`${clickgo.getCdn()}/npm/pdfjs-dist@5.4.54/+esm`);
                m.GlobalWorkerOptions.workerSrc = `${clickgo.getCdn()}/npm/pdfjs-dist@5.4.54/build/pdf.worker.min.mjs`;
                return m;
            }
            catch {
                throw Error('pdf.js load failed.');
            }
        },
        'loading': false,
        'resolve': [],
    },
    'qrcode': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/qrcode@1.5.1/build/qrcode.js`,
            ]);
            if (!window.QRCode) {
                throw Error('QRCode load failed.');
            }
            return window.QRCode;
        },
        'loading': false,
        'resolve': [],
    },
    'mpegts': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/mpegts.js@1.7.3/dist/mpegts.min.js`,
            ]);
            if (!window.mpegts) {
                throw Error('mpegts load failed.');
            }
            window.mpegts.LoggingControl.enableAll = false;
            return window.mpegts;
        },
        'loading': false,
        'resolve': [],
    },
    'tums-player': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getDirname()}/ext/tums-player/tums-player.umd.min.js`,
            ]);
            if (!window['tums-player']) {
                throw Error('Tums load failed.');
            }
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = '-9999px';
            div.style.top = '-9999px';
            div.style.width = '200px';
            div.style.height = '100px';
            document.body.appendChild(div);
            /** --- tums-player 原生对象 --- */
            const tp = window['tums-player'].default;
            /** --- 对讲对象，一个页面只能有一个 --- */
            let client = null;
            return {
                'default': tp,
                startTalk: (opt) => {
                    return new Promise(resolve => {
                        if (client) {
                            client.stopVoiceIntercom();
                            client.destroy();
                            client = null;
                        }
                        client = new tp(div, {
                            'type': 'relay',
                            'url': 'none',
                            'pluginPath': clickgo.getDirname() + '/ext',
                            'talkEnable': true,
                            'appKey': opt.sid,
                            'appSecret': opt.skey,
                        });
                        client.on('ready', () => {
                            client.startVoiceIntercom({
                                'url': opt.url,
                                'mode': opt.mode,
                            });
                            resolve();
                        });
                    });
                },
                stopTalk: () => {
                    if (!client) {
                        return;
                    }
                    client.stopVoiceIntercom();
                    client.destroy();
                    client = null;
                },
            };
        },
        'loading': false,
        'resolve': [],
    },
    // --- 腾讯云验证码 ---
    'tjcaptcha': {
        func: async function () {
            await lTool.loadScripts([
                'https://turing.captcha.qcloud.com/TJCaptcha.js',
            ]);
            if (!window.TencentCaptcha) {
                throw Error('TJCaptcha load failed.');
            }
            return window.TencentCaptcha;
        },
        'loading': false,
        'resolve': [],
    },
    // --- cf 验证码 ---
    'turnstile': {
        func: async function () {
            await lTool.loadScripts([
                'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
            ]);
            if (!window.turnstile) {
                throw Error('cft load failed.');
            }
            return window.turnstile;
        },
        'loading': false,
        'resolve': [],
    },
    // --- noVNC ---
    '@novnc/novnc': {
        'version': '1.6.0',
        'loading': false,
        'resolve': [],
    },
    // --- marked ---
    'marked': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/marked@17.0.0/lib/marked.umd.min.js`
            ]);
            if (!window.marked) {
                throw Error('marked load failed.');
            }
            return window.marked;
        },
        'loading': false,
        'resolve': [],
    },
    // --- pdf-lib ---
    'pdf-lib': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js`
            ]);
            if (!window.PDFLib) {
                throw Error('pdf-lib load failed.');
            }
            return window.PDFLib;
        },
        'loading': false,
        'resolve': [],
    },
};
/**
 * --- 注册模块 ---
 * @param current 当前任务 id
 * @param name 模块名
 * @param opt 选项
 */
export async function regModule(current, name, opt) {
    if (!(await lTask.checkPermission(current, 'root'))[0]) {
        return false;
    }
    if (modules[name]) {
        return false;
    }
    if (clickgo.modules[name]) {
        // --- 已经加载过的也不能注册了 ---
        return false;
    }
    modules[name] = {
        'version': opt.version,
        'func': opt.func,
        'loading': false,
        'resolve': [],
    };
    return true;
}
/**
 * --- 检查特殊模块是否注册 ---
 * @param name 模块名
 */
export function checkModule(name) {
    return modules[name] !== undefined;
}
/**
 * --- 获取模块内容，通常用于异步加载模块时使用 ---
 * @param name 模块名
 * @returns 模块对象
 */
export async function getModule(name) {
    if (!(await loadModule(name))) {
        return null;
    }
    return clickgo.modules[name];
}
/**
 * --- 加载模块，返回 true / false ---
 * @param name 模块名
 */
export async function loadModule(name) {
    if (!modules[name]) {
        // --- 未注册的，加载啥 ---
        return false;
    }
    if (clickgo.modules[name]) {
        // --- 已经加载过了 ---
        return true;
    }
    try {
        if (modules[name].loading) {
            // --- 加载中，等待 ---
            await new Promise(resolve => {
                modules[name].resolve.push(() => {
                    resolve();
                });
            });
            return true;
        }
        // --- 未加载，走加载流程 ---
        modules[name].loading = true;
        if (modules[name].version) {
            // --- ESM 模块 ---
            const r = await import(`${clickgo.getCdn()}/npm/${name}@${modules[name].version}/+esm`);
            clickgo.modules[name] = r;
        }
        if (modules[name].func) {
            const r = await modules[name].func();
            clickgo.modules[name] = r;
        }
        modules[name].loading = false;
        for (const r of modules[name].resolve) {
            r();
        }
        modules[name].resolve.length = 0;
        return true;
    }
    catch {
        return false;
    }
}
// --- 需要初始化 ---
let inited = false;
export function init() {
    if (inited) {
        return;
    }
    inited = true;
    config = clickgo.modules.vue.reactive({
        'locale': lTool.lang.getCodeByAccept(),
        'task.position': 'bottom',
        'task.pin': {},
        'desktop.icon.storage': true,
        'desktop.icon.recycler': true,
        'desktop.wallpaper': null,
        'desktop.path': null,
        'launcher.list': [],
    });
    clickgo.modules.vue.watch(config, async function () {
        // --- 检测有没有缺少的 config key ---
        for (const key in configOrigin) {
            if (config[key] !== undefined) {
                continue;
            }
            lForm.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously removed the system config item.\nKey: ' + key,
                'type': 'warning'
            });
            config[key] = configOrigin[key];
        }
        // --- 有没有多余的或值有问题的 ---
        for (const key in config) {
            if (!Object.keys(configOrigin).includes(key)) {
                lForm.notify({
                    'title': 'Warning',
                    'content': 'There is a software that maliciously modifies the system config.\nKey: ' + key,
                    'type': 'warning'
                });
                delete config[key];
                continue;
            }
            if (key === 'task.pin') {
                // --- 如果是 pin，要检查老的和新的的 path 是否相等 ---
                const paths = Object.keys(config['task.pin']).sort().toString();
                const originPaths = Object.keys(configOrigin['task.pin']).sort().toString();
                if (paths === originPaths) {
                    continue;
                }
                configOrigin['task.pin'] = {};
                for (const path in config['task.pin']) {
                    configOrigin['task.pin'][path] = config['task.pin'][path];
                }
                await trigger('configChanged', 'task.pin', config['task.pin']);
            }
            else {
                // --- 别的要判断值是否和比对组一样 ---
                if (config[key] === configOrigin[key]) {
                    continue;
                }
                configOrigin[key] = config[key];
                if (key === 'task.position') {
                    lTask.refreshSystemPosition();
                }
                await trigger('configChanged', key, config[key]);
            }
        }
    }, {
        'deep': true
    });
    // --- 绑定 resize 事件 ---
    window.addEventListener('resize', function () {
        // --- 触发 screenResize 事件 ---
        lTask.refreshSystemPosition(); // --- 会在里面自动触发 screenResize 事件 ---
    });
}
