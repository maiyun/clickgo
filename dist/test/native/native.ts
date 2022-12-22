import * as electron from 'electron';
import * as path from 'path';
import * as fs from 'fs';

/** --- 是否是沉浸式的 --- */
let isImmersion: boolean = false;
// --- windows 下是且只会是沉浸式，其他系统以启动的第一个窗体为准绑定大小最小化最大化关闭等功能 ---

/** --- 窗体是否含有 border 边框，有的话将不是沉浸式，也不会绑定任何窗体的大小和相关事件 --- */
let hasFrame: boolean = false;

/** --- 是否没有物理窗体时就主动退出软件（进程结束），如果不要窗体只有 node 的话，会用到 false 的情况 --- */
let isNoFormQuit: boolean = true;

/** --- 主窗体 --- */
let form: electron.BrowserWindow | undefined;

/** --- 当前设定的通讯 token --- */
let token: string = '';

/** --- 当前系统平台 --- */
const platform: NodeJS.Platform = process.platform;
// const platform: NodeJS.Platform = 'darwin';

/** --- windows 下驱动器列表 --- */
const drives: string[] = [];

/** --- 更新 drives 列表 --- */
async function refreshDrives(): Promise<void> {
    if (platform !== 'win32') {
        return;
    }
    drives.length = 0;
    for (let i = 0; i < 26; ++i) {
        const char = String.fromCharCode(97 + i);
        try {
            await fs.promises.stat(char + ':/');
            drives.push(char + ':');
        }
        catch {
            // --- 无所谓 ---
        }
    }
}

/** --- path 要额外处理一下，因为 windows 下可能有点不一样 --- */
function formatPath(path: string): string {
    if (platform !== 'win32') {
        return path;
    }
    if (path === '/') {
        return path;
    }
    return path.slice(1);
}

/**
 * --- 间隔一段时间 ---
 * @param ms 间隔毫秒
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, ms);
    });
}

/** --- 监听前台的执行的方法，内置的方法，用户可调用方法自行添加 --- */
const methods: Record<string, {
    'once': boolean;
    'handler': (...param: any[]) => any | Promise<any>;
}> = {
    // --- 成功运行一个 task 后 init ---
    'cg-init': {
        'once': true,
        handler: function(t: string) {
            // --- t 是网页传来的 token ---
            if (!t || !form) {
                return;
            }
            form.resizable = true;
            token = t;
        }
    },
    // --- 完全退出软件进程 ---
    'cg-quit': {
        'once': false,
        handler: function(t: string): void {
            if (!t || !form) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            electron.app.quit();
        }
    },
    // --- 设置实体窗体大小，仅非沉浸式可设置 ---
    'cg-set-size': {
        'once': false,
        handler: function(t: string, width: number, height: number): void {
            if (isImmersion || !form || !width || !height) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            form.setSize(width, height);
            form.center();
        }
    },
    // --- 设置窗体最大化、最小化、还原，仅非 frame 可设置 ---
    'cg-set-state': {
        'once': false,
        handler: function(t: string, state: string): void {
            if (hasFrame || !form || !state) {
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
                default: {
                    form.restore();
                }
            }
        }
    },
    // --- 关闭窗体（可能软件进程不会被退出） ---
    'cg-close': {
        'once': false,
        handler: function(t: string): void {
            if (!form) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            form.close();
        }
    },
    // --- 设置 IgnoreMouseEvents，仅限沉浸式 ---
    'cg-mouse-ignore': {
        'once': false,
        handler: function(t: string, val: boolean): void {
            if (!isImmersion || !form) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            if (val) {
                form.setIgnoreMouseEvents(true, { 'forward': true });
            }
            else {
                form.setIgnoreMouseEvents(false);
            }
        }
    },
    // --- 是否允许最大化 ---
    'cg-maximizable': {
        'once': false,
        handler: function(t: string, val: boolean): void {
            if (isImmersion || !form) {
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
        handler: async function(
            t: string,
            path: string,
            options: Record<string, any>
        ): Promise<string | Buffer | null> {
            if (!verifyToken(t)) {
                return null;
            }
            path = formatPath(path);
            const encoding = options.encoding;
            const start = options.start;
            const end = options.end;
            if (start || end) {
                return new Promise(function(resolve) {
                    const rs = fs.createReadStream(path, {
                        'encoding': encoding,
                        'start': start,
                        'end': end
                    });
                    const data: Buffer[] = [];
                    rs.on('data', function(chunk: Buffer) {
                        data.push(chunk);
                    }).on('end', function() {
                        const buf = Buffer.concat(data);
                        if (encoding) {
                            resolve(buf.toString());
                        }
                        else {
                            resolve(buf);
                        }
                    }).on('error', function() {
                        resolve(null);
                    });
                });
            }
            else {
                try {
                    if (encoding) {
                        return await fs.promises.readFile(path, {
                            'encoding': encoding
                        });
                    }
                    else {
                        return await fs.promises.readFile(path);
                    }
                }
                catch {
                    return null;
                }
            }
        }
    },
    'cg-fs-putContent': {
        'once': false,
        handler: async function(
            t: string, path: string, data: string | Buffer, options: Record<string, any>
        ): Promise<boolean> {
            if (!verifyToken(t)) {
                return false;
            }
            path = formatPath(path);
            try {
                await fs.promises.writeFile(path, data, options);
                return true;
            }
            catch {
                return false;
            }
        }
    },
    'cg-fs-readLink': {
        'once': false,
        handler: async function(t: string, path: string, encoding?: BufferEncoding): Promise<string | null> {
            if (!verifyToken(t)) {
                return null;
            }
            path = formatPath(path);
            try {
                return await fs.promises.readlink(path, {
                    'encoding': encoding
                });
            }
            catch {
                return null;
            }
        }
    },
    'cg-fs-symlink': {
        'once': false,
        handler: async function(t: string, filePath: string, linkPath: string, type?: 'dir' | 'file' | 'junction'): Promise<boolean> {
            if (!verifyToken(t)) {
                return false;
            }
            filePath = formatPath(filePath);
            linkPath = formatPath(linkPath);
            try {
                await fs.promises.symlink(filePath, linkPath, type);
                return true;
            }
            catch {
                return false;
            }
        }
    },
    'cg-fs-unlink': {
        'once': false,
        handler: async function(t: string, path: string): Promise<boolean> {
            if (!verifyToken(t)) {
                return false;
            }
            path = formatPath(path);
            for (let i = 0; i <= 2; ++i) {
                try {
                    await fs.promises.unlink(path);
                    return true;
                }
                catch {
                    await sleep(250);
                }
            }
            try {
                await fs.promises.unlink(path);
                return true;
            }
            catch {
                return false;
            }
        }
    },
    'cg-fs-stats': {
        'once': false,
        handler: async function(t: string, path: string): Promise<Record<string, any> | null> {
            if (!verifyToken(t)) {
                return null;
            }
            path = formatPath(path);
            try {
                const item = await fs.promises.lstat(path);
                return {
                    isFile: item.isFile(),
                    isDirectory: item.isDirectory(),
                    isSymbolicLink: item.isSymbolicLink(),
                    'size': item.size,
                    'blksize': item.blksize,
                    'atimeMs': item.atimeMs,
                    'mtimeMs': item.mtimeMs,
                    'ctimeMs': item.ctimeMs,
                    'birthtimeMs': item.birthtimeMs,
                    'atime': item.atime,
                    'mtime': item.mtime,
                    'ctime': item.ctime,
                    'birthtime': item.birthtime
                };
            }
            catch {
                return null;
            }
        }
    },
    'cg-fs-mkdir': {
        'once': false,
        handler: async function(t: string, path: string, mode: number): Promise<boolean> {
            if (!verifyToken(t)) {
                return false;
            }
            path = formatPath(path);
            const stats = await fs.promises.lstat(path);
            if (stats.isDirectory()) {
                return true;
            }
            // --- 深度创建目录 ---
            try {
                await fs.promises.mkdir(path, {
                    'recursive': true,
                    'mode': mode
                });
                return true;
            }
            catch {
                return false;
            }
        }
    },
    'cg-fs-rmdir': {
        'once': false,
        handler: async function(t: string, path: string): Promise<boolean> {
            if (!verifyToken(t)) {
                return false;
            }
            path = formatPath(path);
            const stats = await fs.promises.lstat(path);
            if (!stats.isDirectory()) {
                return true;
            }
            try {
                await fs.promises.rmdir(path);
                return true;
            }
            catch {
                return false;
            }
        }
    },
    'cg-fs-chmod': {
        'once': false,
        handler: async function(t: string, path: string, mod: string | number): Promise<boolean> {
            if (!verifyToken(t)) {
                return false;
            }
            path = formatPath(path);
            try {
                await fs.promises.chmod(path, mod);
                return true;
            }
            catch {
                return false;
            }
        }
    },
    'cg-fs-rename': {
        'once': false,
        handler: async function(t: string, oldPath: string, newPath: string): Promise<boolean> {
            if (!verifyToken(t)) {
                return false;
            }
            oldPath = formatPath(oldPath);
            newPath = formatPath(newPath);
            try {
                await fs.promises.rename(oldPath, newPath);
                return true;
            }
            catch {
                return false;
            }
        }
    },
    'cg-fs-readDir': {
        'once': false,
        handler: async function(t: string, path: string, options: Record<string, any>): Promise<any[]> {
            if (!verifyToken(t)) {
                return [];
            }
            try {
                const list: any[] = [];
                if (platform === 'win32') {
                    // --- 此处不能用 formatPath，因为还要读 drives ---
                    if (path === '/') {
                        for (const item of drives) {
                            list.push({
                                isFile: false,
                                isDirectory: true,
                                isSymbolicLink: false,
                                'name': item
                            });
                        }
                        return list;
                    }
                    else {
                        path = path.slice(1);
                    }
                }
                const dlist = await fs.promises.readdir(path, {
                    'encoding': options.encoding,
                    'withFileTypes': true
                });
                for (const item of dlist) {
                    if (item.name === '.' || item.name === '..') {
                        continue;
                    }
                    list.push({
                        isFile: item.isFile(),
                        isDirectory: item.isDirectory(),
                        isSymbolicLink: item.isSymbolicLink(),
                        'name': item.name
                    });
                }
                return list;
            }
            catch {
                return [];
            }
        }
    },
    'cg-fs-copyFile': {
        'once': false,
        handler: async function(t: string, src: string, dest: string): Promise<boolean> {
            if (!verifyToken(t)) {
                return false;
            }
            src = formatPath(src);
            dest = formatPath(dest);
            try {
                await fs.promises.copyFile(src, dest);
                return true;
            }
            catch {
                return false;
            }
        }
    },

    // --- 无需校验码 ---

    // --- 测试与 native 的连通性 ---
    'cg-ping': {
        'once': false,
        handler: function(t: string): string {
            // --- t 不是 token，传过来什么就会传回去 ---
            return 'pong: ' + t;
        }
    },
    // --- 判断窗体是否是最大化状态 ---
    'cg-is-max': {
        'once': false,
        handler: function(): boolean {
            return form?.isMaximized ? true : false;
        }
    }
};

/** --- 全局类 --- */
export abstract class AbstractBoot {

    /**
     * --- 是否是沉浸式运行 ---
     */
    public get isImmersion(): boolean {
        return isImmersion;
    }

    /**
     * --- 是否含有实体窗体边框和标题 ---
     */
    public get hasFrame(): boolean {
        return hasFrame;
    }

    /**
     * --- 没有实体窗体时整个实体进程是不是会被结束 ---
     */
    public get isNoFormQuit(): boolean {
        return isNoFormQuit;
    }

    /**
     * --- 当前系统代号 ---
     */
    public get platform(): NodeJS.Platform {
        return platform;
    }

    /**
     * --- 当前的通讯 token ---
     */
    public get token(): string {
        return token;
    }

    /** --- 入口方法 --- */
    public abstract main(): void | Promise<void>;

    /**
     * --- 开始运行起来一个主实体窗体，整个进程本方法只能执行一次 ---
     * @param path 实体窗体网页路径
     * @param opt 参数
     */
    public run(path: string, opt: { 'frame'?: boolean; 'quit'?: boolean; } = {}): void {
        if (opt.frame !== undefined) {
            // --- 默认 false ---
            hasFrame = opt.frame;
        }
        if (opt.quit !== undefined) {
            // --- 默认 true ---
            isNoFormQuit = opt.quit;
        }
        // --- 判断是否是沉浸式 ---
        if (platform === 'win32') {
            // --- 是 Windows 才有可能是沉浸式 ---
            if (!hasFrame) {
                // --- 实体窗体没有边框，一定是沉浸式 ---
                isImmersion = true;
            }
        }
        // --- 创建实体窗体 ---
        createForm(path);
        // --- 监听所有实体窗体关闭事件 ---
        electron.app.on('window-all-closed', function(): void {
            if (isNoFormQuit) {
                electron.app.quit();
            }
        });
        // --- 软件被活动性激活的事件 ---
        electron.app.on('activate', function(): void {
            if (electron.BrowserWindow.getAllWindows().length > 0) {
                return;
            }
            createForm(path);
            // --- 成功运行一个 task 后再次添加 init ---
            methods['cg-init'] = {
                'once': true,
                handler: function(t: string) {
                    // --- t 是网页传来的 token ---
                    if (!t || !form) {
                        return;
                    }
                    form.resizable = true;
                    token = t;
                }
            };
        });
    }

    /**
     * --- 绑定监听网页调用方法的方法 ---
     * @param name 方法名
     * @param handler 要执行的函数
     * @param once 是否只执行一次
     */
    public on(
        name: string,
        handler: (...param: any[]) => any | Promise<any>,
        once: boolean = false
    ): void {
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
    public once(name: string, handler: (...param: any[]) => any | Promise<any>): void {
        this.on(name, handler, true);
    }

    /**
     * --- 解绑监听的方法 ---
     * @param name 方法名
     */
    public off(name: string): void {
        if (!methods[name]) {
            return;
        }
        delete methods[name];
    }

}

/** --- 用户调用运行 boot 类 --- */
export function launcher(boot: AbstractBoot): void {
    (async function() {
        // --- 等到 native 环境装载完毕 ---
        await electron.app.whenReady();
        await refreshDrives();
        // --- 执行回调 ---
        await boot.main();
    })().catch(function() {
        return;
    });
}

// --- 系统启动 ---

electron.Menu.setApplicationMenu(null);

// --- 实际用来监听网页传输过来的数据 ---
electron.ipcMain.handle('pre', function(e: electron.IpcMainInvokeEvent, name: string, ...param: any[]): any {
    if (!methods[name]) {
        return;
    }
    const r = methods[name].handler(...param);
    if (methods[name].once) {
        delete methods[name];
    }
    return r;
});

/**
 * --- 验证 token 是否正确 ---
 * @param t 要验证的 token
 */
export function verifyToken(t: string): boolean {
    if (t !== token) {
        return false;
    }
    return true;
}

/**
 * --- 内部调用用来创建实体窗体的函数 ---
 * @param p 窗体网页路径
 */
function createForm(p: string): void {
    const op: Electron.BrowserWindowConstructorOptions = {
        'webPreferences': {
            'nodeIntegration': false,
            'contextIsolation': true,
            'preload': path.join(__dirname, '/pre.js')
        },
        'width': hasFrame ? 800 : 500,
        'height': hasFrame ? 600 : 300,
        'frame': hasFrame,
        'resizable': false,
        'show': false,
        'center': true,
        'transparent': isImmersion ? true : false
    };
    form = new electron.BrowserWindow(op);
    form.webContents.userAgent = 'electron/' + electron.app.getVersion() + ' ' + platform + '/' + process.arch + ' immersion/' + (isImmersion ? '1' : '0') + ' frame/' + (hasFrame ? '1' : '0');
    // form.webContents.openDevTools();
    form.once('ready-to-show', function(): void {
        if (!form) {
            return;
        }
        if (isImmersion) {
            // --- 沉浸式默认最大化 ---
            form.maximize();
            form.setIgnoreMouseEvents(true, { 'forward': true });
        }
        else {
            // --- 设置为第一个窗体的大小 ---
        }
        form.show();
    });
    const lio = p.indexOf('?');
    const search = lio === -1 ? '' : p.slice(lio + 1);
    if (lio !== -1) {
        p = p.slice(0, lio);
    }
    form.loadFile(p, {
        'search': search
    }).catch(function(e): void {
        throw e;
    });
    form.on('close', function() {
        form = undefined;
    });
    // --- 最大化事件 ---
    form.on('maximize', function() {
        form?.webContents.executeJavaScript('if(window.clickgoNativeWeb){clickgoNativeWeb.invoke("maximize")}') as any;
    });
    // --- 最大化还原 ---
    form.on('unmaximize', function() {
        form?.webContents.executeJavaScript('if(window.clickgoNativeWeb){clickgoNativeWeb.invoke("unmaximize")}') as any;
    });
}
