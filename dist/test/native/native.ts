import * as electron from 'electron';
import * as path from 'path';

electron.Menu.setApplicationMenu(null);

/** --- 环境是否已经准备好了 --- */
let isReady: boolean = false;
/** --- 窗体是否显示边框 --- */
let isFrame: boolean = false;
/** --- 是否关闭窗口就退出 --- */
let isQuit: boolean = true;
/** --- 主窗体 --- */
let win: electron.BrowserWindow | undefined;
/** --- 当前系统平台 --- */
// const platform: NodeJS.Platform = process.platform;
const platform: NodeJS.Platform = 'darwin';
/** --- 当前设定的 token --- */
let token: string = '';

/** --- 监听前台的执行的方法 --- */
const methods: Record<string, {
    'once': boolean;
    'handler': (...param: any[]) => any | Promise<any>;
}> = {
    // --- 成功运行一个 task 后 init ---
    'cg-init': {
        'once': true,
        handler: function(t: string) {
            if (!t || !win) {
                return;
            }
            win.resizable = true;
            token = t;
        }
    },
    // --- 完全退出软件 ---
    'cg-quit': {
        'once': false,
        handler: function(t: string): void {
            if (!win || !t) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            electron.app.quit();
        }
    },
    // --- 设置实体窗体大小，推荐仅限非 windows ---
    'cg-set-size': {
        'once': false,
        handler: function(t: string, width: number, height: number): void {
            if (!win || !width || !height) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            win.setSize(width, height);
            win.center();
        }
    },
    // --- 设置窗体最大化、最小化、还原 ---
    'cg-set-state': {
        'once': false,
        handler: function(t: string, state: string): void {
            if (!win || !state) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            switch (state) {
                case 'max': {
                    win.maximize();
                    break;
                }
                case 'min': {
                    win.minimize();
                    break;
                }
                default: {
                    win.restore();
                }
            }
        }
    },
    // --- 关闭窗体但不退出软件 ---
    'cg-close': {
        'once': false,
        handler: function(t: string): void {
            if (!win) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            win.close();
        }
    },
    // --- 设置 IgnoreMouseEvents，仅限 windows ---
    'cg-mouse-ignore': {
        'once': false,
        handler: function(t: string, val: boolean): void {
            if (!win) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            if (val) {
                win.setIgnoreMouseEvents(true, { 'forward': true });
            }
            else {
                win.setIgnoreMouseEvents(false);
            }
        }
    }
};

/**
 * --- node 端绑定前端来调用的方法 ---
 * @param name 方法名
 * @param handler 执行的函数
 * @param once 是否只执行一次
 */
export function bind(
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
 * --- node 端绑定前端来调用的方法只执行一次 ---
 * @param name 方法名
 * @param handler 执行的函数
 */
export function once(name: string, handler: (...param: any[]) => any | Promise<any>): void {
    bind(name, handler, true);
}

/**
 * --- 解绑 node 方法 ---
 * @param name 方法名
 */
export function unbind(name: string): void {
    if (!methods[name]) {
        return;
    }
    delete methods[name];
}

electron.ipcMain.handle('pre', function(e: electron.IpcMainInvokeEvent, name: string, ...param: any[]): any | Promise<any> {
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
 * --- 等到 native 环境装载完毕 ---
 */
export async function ready(): Promise<void> {
    await electron.app.whenReady();
    isReady = true;
}

function createForm(p: string): void {
    const op: Electron.BrowserWindowConstructorOptions = {
        'webPreferences': {
            'nodeIntegration': false,
            'contextIsolation': true,
            'preload': path.join(__dirname, '/pre.js')
        },
        'width': 500,
        'height': 400,
        'frame': isFrame,
        'resizable': false,
        'show': false,
        'center': true,
        'transparent': isFrame ? undefined : true
    };
    win = new electron.BrowserWindow(op);
    win.webContents.userAgent = 'electron/' + electron.app.getVersion() + ' ' + platform + '/' + process.arch;
    // win.webContents.openDevTools();
    win.once('ready-to-show', function(): void {
        if (!win) {
            return;
        }
        if (platform === 'win32') {
            win.maximize();
            win.setIgnoreMouseEvents(true, { 'forward': true });
        }
        else {
            // --- 设置为第一个窗体的大小 ---
        }
        win.show();
    });
    const lio = p.indexOf('?');
    const search = lio === -1 ? '' : p.slice(lio + 1);
    if (lio !== -1) {
        p = p.slice(0, lio);
    }
    win.loadFile(p, {
        'search': search
    }).catch(function(e): void {
        throw e;
    });
    win.on('close', function() {
        win = undefined;
    });
}

export function run(path: string, opt: { 'frame'?: boolean; 'quit'?: boolean; } = {}): void {
    if (!isReady) {
        return;
    }
    if (opt.frame !== undefined) {
        isFrame = opt.frame;
    }
    if (opt.quit !== undefined) {
        isQuit = opt.quit;
    }
    createForm(path);
    electron.app.on('window-all-closed', function(): void {
        /*
        // --- MAC ---
        if (platform !== 'darwin') {
            electron.app.quit();
        }
        */
        if (isQuit) {
            electron.app.quit();
        }
    });
    electron.app.on('activate', function(): void {
        if (electron.BrowserWindow.getAllWindows().length > 0) {
            return;
        }
        createForm(path);
        // --- 成功运行一个 task 后 init ---
        methods['cg-init'] = {
            'once': true,
            handler: function(t: string) {
                if (!t || !win) {
                    return;
                }
                win.resizable = true;
                token = t;
            }
        };
    });
}
