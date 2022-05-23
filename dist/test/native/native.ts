import * as electron from 'electron';

let isReady: boolean = false;

export async function ready(): Promise<void> {
    await electron.app.whenReady();
    isReady = true;
}

/** --- node 监听前台消息列表 --- */
const listeners: Record<string, Array<{
    'once': boolean;
    'handler': (param?: string) => any | Promise<any>;
}>> = {};
// --- 添加前台监听 ---
export function on(
    name: string,
    handler: (param?: string) => any | Promise<any>,
    once: boolean = false
): void {
    if (!listeners[name]) {
        listeners[name] = [];
    }
    listeners[name].push({
        'once': once,
        'handler': handler
    });
}
export function once(name: string, handler: (param?: string) => any | Promise<any>): void {
    on(name, handler, true);
}

// --- 移除前台监听 ---
export function off(name: string, handler: (param?: string) => any | Promise<any>): void {
    if (!listeners[name]) {
        return;
    }
    for (let i = 0; i < listeners[name].length; ++i) {
        if (listeners[name][i].handler !== handler) {
            continue;
        }
        listeners[name].splice(i, 1);
        if (listeners[name].length === 0) {
            delete listeners[name];
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
        const timerFunc = async function(): Promise<void> {
            if (!win) {
                return;
            }
            try {
                await win.webContents.executeJavaScript('clickGoNative.isReady');
            }
            catch {
                // --- 下一次循环 ---
                setTimeout(function() {
                    timerFunc().catch(function(e) {
                        console.log(e);
                    });
                }, 100);
                return;
            }
            // --- 检测浏览器是否有要执行的内容 ---
            const list = JSON.parse(await win.webContents.executeJavaScript('clickGoNative.cgInnerGetSends()')) as Array<{ 'id': number; 'name': string; 'param': string | undefined; }>;
            for (const item of list) {
                // --- 根据 name 执行相关函数 ---
                for (const it of listeners[item.name]) {
                    const result = it.handler(item.param);
                    if (result instanceof Promise) {
                        result.then(function(result) {
                            if (!win) {
                                return;
                            }
                            win.webContents.executeJavaScript(`clickGoNative.cgInnerReceive(${item.id}, "${item.name}", ${result !== undefined ? (', "' + (result as string).replace(/"/g, '\\"') + '"') : ''})`).catch(function(e) {
                                console.log(e);
                            });
                        }).catch(function(e) {
                            console.log(e);
                        });
                    }
                    else {
                        win.webContents.executeJavaScript(`clickGoNative.cgInnerReceive(${item.id}, "${item.name}", ${result !== undefined ? (', "' + (result as string).replace(/"/g, '\\"') + '"') : ''})`).catch(function(e) {
                            console.log(e);
                        });
                    }
                }
            }
            // --- 下一次循环 ---
            setTimeout(function() {
                timerFunc().catch(function(e) {
                    console.log(e);
                });
            }, 100);
        };
        timerFunc().catch(function(e) {
            console.log(e);
        });
    });
    win.loadFile(path).catch(function(e): void {
        throw e;
    });
    win.on('close', function() {
        win = undefined;
    });
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
