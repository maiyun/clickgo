import * as electron from 'electron';

/** --- 环境是否已经准备好了 --- */
let isReady: boolean = false;

let token: string = '';
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
        'width': 500,
        'height': 400,
        'frame': false,
        // 'resizable': false,
        'show': false,
        'transparent': true,
        'hasShadow': false,
        'center': true
    });
    win.webContents.userAgent = 'electron/' + electron.app.getVersion() + ' s' + process.platform + '/' + process.arch;
    win.once('ready-to-show', function(): void {
        if (!win) {
            return;
        }
        if (process.platform === 'win32') {
            win.maximize();
            win.setIgnoreMouseEvents(true, { 'forward': true });
        }
        win.resizable = false;
        win.show();
        // --- timer ---
        const timerFunc = async function(): Promise<void> {
            if (!win) {
                return;
            }
            try {
                const rtn = await win.webContents.executeJavaScript('window.clickGoNative && clickGoNative.isReady');
                if (!rtn) {
                    // --- 下一次循环 ---
                    setTimeout(function() {
                        timerFunc().catch(function(e) {
                            console.log(e);
                        });
                    }, 100);
                    return;
                }
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
                if (!listeners[item.name]) {
                    continue;
                }
                // --- 根据 name 执行相关函数 ---
                for (let i = 0; i < listeners[item.name].length; ++i) {
                    const it = listeners[item.name][i];
                    const result = it.handler(item.param);
                    if (it.once) {
                        listeners[item.name].splice(i, 1);
                        --i;
                    }
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
                    if (it.once) {
                        listeners[item.name].splice(i, 1);
                        if (listeners[item.name].length === 0) {
                            delete listeners[item.name];
                            break;
                        }
                        --i;
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
    // --- 设置 token，仅限一次 ---
    once('cg-set-token', function(t): void {
        if (!t) {
            return;
        }
        token = t;
    });
    // --- 设置 IgnoreMouseEvents，仅限 windows ---
    on('cg-mouse-ignore', function(b) {
        if (!win || !b) {
            return;
        }
        try {
            const rtn = JSON.parse(b);
            if (!verifyToken(rtn.token)) {
                return;
            }
            if (rtn.param) {
                win.setIgnoreMouseEvents(true, { 'forward': true });
            }
            else {
                win.setIgnoreMouseEvents(false);
            }
        }
        catch (e) {
            console.log(e);
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

// --- listeners 监视 ---
setInterval(function() {
    const keysCount: Record<string, number> = {};
    let count: number = 0;
    for (const key in listeners) {
        keysCount[key] = listeners[key].length;
        count += keysCount[key];
    }
    console.log('keysCount', keysCount);
    console.log(`All count: ${count}`);
}, 5000);
