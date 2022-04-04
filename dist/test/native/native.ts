import * as electron from 'electron';

let isReady: boolean = false;

export async function ready(): Promise<void> {
    await electron.app.whenReady();
    isReady = true;
}

/** --- node 监听前台消息列表 --- */
let listeners: Record<string, Array<{
    'once': boolean;
    'handler': (param?: string) => string | void | Promise<string | void>;
}>> = {};
// --- 添加前台监听 ---
export function on(name: string, handler: (param?: string) => string | void | Promise<string | void>, once: boolean = false): void {
    if (!listeners[name]) {
        listeners[name] = [];
    }
    listeners[name].push({
        'once': once,
        'handler': handler
    });
}
export function once(name: string, handler: (param?: string) => string | void | Promise<string | void>): void {
    on(name, handler, true);
}

// --- 移除前台监听 ---
export function off(name: string, handler: (param?: string) => string | void | Promise<string | void>): void {
    if (!listeners[name]) {
        return;
    }
    for (let i = 0; i < listeners[name].length; ++i) {
        if (listeners[name][i].handler !== handler) {
            continue;
        }
        listeners[name].splice(i, 1);
        if (listeners[name].length === 0) {
            delete(listeners[name]);
            break;
        }
        --i;
    }
}

let win: electron.BrowserWindow | undefined;
function createForm(path: string): void {
    win = new electron.BrowserWindow({
        'width': 400,
        'height': 400,
        'frame': false,
        'resizable': false,
        'show': false,
        'transparent': true
    });
    win.once('ready-to-show', function(): void {
        if (!win) {
            return;
        }
        win.maximize();
        win.show();
        win.setIgnoreMouseEvents(true, { 'forward': true });
        // --- timer ---
        let timerFunc = async function() {
            if (!win) {
                return;
            }
            let isReady = await win.webContents.executeJavaScript('clickgo.isReady');
            if (!isReady) {
                // --- 下一次循环 ---
                setTimeout(function() {
                    timerFunc();
                }, 100);
                return;
            }
            // --- 检测浏览器是否有要执行的内容 ---
            let list = JSON.parse(await win.webContents.executeJavaScript('clickgo.core.__nativeGetSends()')) as Array<{ 'id': number; 'name': string; 'param': string | undefined; }>;
            for (let item of list) {
                // --- 根据 name 执行相关函数 ---
                for (let it of listeners[item.name]) {
                    let result = it.handler(item.param);
                    if (result instanceof Promise) {
                        result.then(function(result) {
                            if (!win) {
                                return;
                            }
                            win.webContents.executeJavaScript(`clickgo.core.__nativeReceive(${item.id}, "${item.name}", ${result !== undefined ? (', "' + result.replace(/"/g, '\"') + '"') : ''})`);
                        });
                    }
                    else {
                        win.webContents.executeJavaScript(`clickgo.core.__nativeReceive(${item.id}, "${item.name}", ${result !== undefined ? (', "' + result.replace(/"/g, '\"') + '"') : ''})`);
                    }
                }
            }
            // --- 下一次循环 ---
            setTimeout(function() {
                timerFunc();
            }, 100);
        };
        timerFunc();
    });
    win.loadFile(path).catch(function(e): void {
        throw e;
    });
    win.on('close', function() {
        win = undefined;
    })
}

export function run(path: string): void {
    if (!isReady) {
        return;
    }
    createForm(path);
    on('cg-mouse-ignore', function(b) {
        if (!win) {
            return;
        }
        if (b === 'true') {
            win.setIgnoreMouseEvents(true, { 'forward': true });
        }
        else {
            win.setIgnoreMouseEvents(false);
        }
    });
    electron.app.on('window-all-closed', function(): void {
        if (process.platform !== 'darwin') {
            electron.app.quit();
        }
    });
    electron.app.on('activate', function(): void {
        if (electron.BrowserWindow.getAllWindows().length === 0) {
            createForm(path);
        }
    });    
}