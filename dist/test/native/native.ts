import * as electron from 'electron';
electron.Menu.setApplicationMenu(null);

/** --- 环境是否已经准备好了 --- */
let isReady: boolean = false;
/** --- 窗体是否显示边框 --- */
let isFrame: boolean = false;
/** --- 是否关闭窗口就退出 --- */
let isQuit: boolean = true;

// const platform: NodeJS.Platform = process.platform;
const platform: NodeJS.Platform = 'darwin';

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
    const op: Electron.BrowserWindowConstructorOptions = {
        'width': 500,
        'height': 400,
        'frame': isFrame,
        'resizable': false,
        'show': false,
        // 'hasShadow': false,
        'center': true,
        'transparent': isFrame ? undefined : true
    };
    /*
    if (platform === 'win32') {
        op.transparent = true;
    }
    */
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
                        if (!win) {
                            return;
                        }
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
    const lio = path.indexOf('?');
    const search = lio === -1 ? '' : path.slice(lio + 1);
    if (lio !== -1) {
        path = path.slice(0, lio);
    }
    win.loadFile(path, {
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
    // --- 成功运行一个 task 后 init ---
    once('cg-init', function(t): void {
        if (!t || !win) {
            return;
        }
        win.resizable = true;
        token = t;
    });
    // --- 退出软件 ---
    on('cg-quit', function(j): void {
        if (!win || !j) {
            return;
        }
        try {
            const rtn = JSON.parse(j);
            if (!verifyToken(rtn.token)) {
                return;
            }
            electron.app.quit();
        }
        catch (e) {
            console.log(e);
        }
    });
    // --- 设置窗体大小 ---
    on('cg-set-size', function(j) {
        if (!win || !j) {
            return;
        }
        try {
            const rtn = JSON.parse(j);
            if (!verifyToken(rtn.token)) {
                return;
            }
            if (!rtn.width || !rtn.height) {
                return;
            }
            win.setSize(rtn.width, rtn.height);
            win.center();
        }
        catch (e) {
            console.log(e);
        }
    });
    // --- 设置窗体最大化、最小化、还原 ---
    on('cg-set-state', function(j) {
        if (!win || !j) {
            return;
        }
        try {
            const rtn = JSON.parse(j);
            if (!verifyToken(rtn.token)) {
                return;
            }
            switch (rtn.state) {
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
        catch (e) {
            console.log(e);
        }
    });
    // --- 响应主 task 被关闭的情况 ---
    on('cg-main-close', function(j) {
        if (!win || !j) {
            return;
        }
        try {
            const rtn = JSON.parse(j);
            if (!verifyToken(rtn.token)) {
                return;
            }
            if (isQuit) {
                electron.app.quit();
            }
            else {
                win.close();
            }
        }
        catch (e) {
            console.log(e);
        }
    });
    // --- 设置 IgnoreMouseEvents，仅限 windows ---
    on('cg-mouse-ignore', function(j) {
        if (!win || !j) {
            return;
        }
        try {
            const rtn = JSON.parse(j);
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
        if (electron.BrowserWindow.getAllWindows().length === 0) {
            createForm(path);
            // --- 成功运行一个 task 后 init ---
            once('cg-init', function(t): void {
                if (!t || !win) {
                    return;
                }
                win.resizable = true;
                token = t;
            });
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
