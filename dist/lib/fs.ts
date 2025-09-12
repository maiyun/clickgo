/**
 * /clickgo/ ClickGo 系统文件目录，永远只读
 * /storage/ 本地模式可用，用于读取本地用户文件
 * /mounted/ 挂载目录，可挂载第三方，如 /mounted/clouddrive/
 * /package/ 包内文件存在时可用，用于读取包内文件，永远只读
 * /current/ app 运行起来的 task 的当前路径链接，这是个软连接，实际映射到实际的运行目录
*/
import * as clickgo from '../clickgo';
import * as lTool from './tool';
import * as lTask from './task';
import * as lForm from './form';
import * as lCore from './core';
import * as lNative from './native';

/** --- 系统级 ID --- */
let sysId = '';

/**
 * --- 初始化系统级 ID，仅能设置一次 ---
 * @param id 系统级 ID
 */
export function initSysId(id: string): void {
    if (sysId) {
        return;
    }
    sysId = id;
}

const clickgoFiles = ['/app/', '/app/demo.cga', '/app/task.cga', '/control/', '/control/arteditor.cgc', '/control/box.cgc', '/control/captcha.cgc', '/control/common.cgc', '/control/desc.cgc', '/control/drawer.cgc', '/control/echarts.cgc', '/control/form.cgc', '/control/iconview.cgc', '/control/jodit.cgc', '/control/map.cgc', '/control/monaco.cgc', '/control/mpegts.cgc', '/control/nav.cgc', '/control/novnc.cgc', '/control/page.cgc', '/control/pdf.cgc', '/control/property.cgc', '/control/qrcode.cgc', '/control/table.cgc', '/control/task.cgc', '/control/tplink.cgc', '/control/tuieditor.cgc', '/control/tuiviewer.cgc', '/control/tums.cgc', '/control/web.cgc', '/control/xterm.cgc', '/ext/', '/ext/toastui-editor-all.min.js', '/ext/tplinkhd.min.js', '/ext/tums-player/', '/ext/tums-player/audio.wasm', '/ext/tums-player/decoder.worker.js', '/ext/tums-player/libaudio.js', '/ext/tums-player/libaudio.wasm', '/ext/tums-player/libffmpeg.js', '/ext/tums-player/libffmpeg.wasm', '/ext/tums-player/libs.worker.js', '/ext/tums-player/tums-player.umd.min.js', '/ext/tums-player/webgl.js', '/ext/tums-player/webgl.worker.js', '/global.css', '/icon.png', '/index.js', '/notosans-regular.ttf', '/theme/', '/theme/dark.cgt', '/theme/light.cgt'];

/** --- fs lib 用到的语言包 --- */
const localeData: Record<string, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'apply-unmount': string;
}> = {
    'en': {
        'apply-unmount': 'Are you sure to unmount the "?" mount point?',
    },
    'sc': {
        'apply-unmount': '确定卸载“?”挂载点吗？'
    },
    'tc': {
        'apply-unmount': '確定卸載「?」掛載點嗎？'
    },
    'ja': {
        'apply-unmount': '「?」マウントポイントをアンマウントしてよろしいですか？'
    },
    'ko': {
        'apply-unmount': '"?" 마운트 지점을 언마운트하시겠습니까?'
    },
    'th': {
        'apply-unmount': 'คุณแน่ใจหรือว่าต้องการยกเลิกการติดตั้งจุดติดตั้ง "?"'
    },
    'es': {
        'apply-unmount': '¿Está seguro de que desea desmontar el punto de montaje "?"'
    },
    'de': {
        'apply-unmount': 'Möchten Sie den Einhängepunkt "?" wirklich demontieren?'
    },
    'fr': {
        'apply-unmount': 'Voulez-vous vraiment démonter le point de montage "?"'
    },
    'pt': {
        'apply-unmount': 'Tem certeza de que deseja desmontar o ponto de montagem "?"'
    },
    'ru': {
        'apply-unmount': 'Вы уверены, что хотите отмонтировать точку монтирования "?"'
    },
    'vi': {
        'apply-unmount': 'Bạn có chắc chắn muốn tháo dỡ điểm gắn "?" không?'
    }
};

/** --- 已经挂载的列表 --- */
const mounts: Record<string, IMountHandler> = {};

/** --- 根据 mounted 的 path 获取挂载点 name --- */
function getMountName(path: string): string {
    const io = path.slice(9).indexOf('/');
    return io === -1 ? path.slice(9) : path.slice(9, io + 9);
}

/**
 * --- 挂载到 mounted 目录下 ---
 * @param current 当前任务 id
 * @param name 目录名
 * @param handler 回调相关
 */
export function mount(current: lCore.TCurrent, name: string, handler: IMountHandler): boolean {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (mounts[name]) {
        return false;
    }
    if (!/^[a-zA-Z][\w]+$/.test(name)) {
        return false;
    }
    if ((current !== sysId) && lTask.getOrigin(current)) {
        const val = 'fs./mounted/' + name + '/w';
        const runtime = lTask.getRuntime(sysId, current);
        if (runtime) {
            if (!runtime.permissions.includes(val)) {
                runtime.permissions.push(val);
            }
        }
    }
    handler.date = new Date();
    mounts[name] = handler;
    return true;
}

/**
 * --- 卸载 mounted ---
 * @param name 目录名
 */
export async function unmount(name: string): Promise<boolean> {
    if (!mounts[name]) {
        return true;
    }
    const loc = localeData[lCore.config.locale]?.['apply-unmount'] ?? localeData['en']['apply-unmount'];
    if (!await lForm.superConfirm(sysId, loc.replace('?', '/mount/' + lTool.escapeHTML(name) + '/'))) {
        return false;
    }
    delete mounts[name];
    return true;
}

export async function getContent(current: lCore.TCurrent, path: string, options?: {
    'start'?: number;
    'end'?: number;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
    /** --- 网络模式下携带后缀，如 ?123 --- */
    'after'?: string;
}): Promise<string | Blob | null>;
export async function getContent(current: lCore.TCurrent, path: string, options: BufferEncoding | {
    'encoding': BufferEncoding;
    'start'?: number;
    'end'?: number;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
}): Promise<string | null>;
/**
 * --- 读取完整文件或一段 ---
 * @param current 当前任务 id
 * @param path 文件路径
 * @param options 编码或选项
 */
export async function getContent(current: lCore.TCurrent, path: string, options?: BufferEncoding | {
    'encoding'?: BufferEncoding;
    'start'?: number;
    'end'?: number;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
    /** --- 如果是网络加载的，则会附带后缀，如 ?123 --- */
    'after'?: string;
}): Promise<Blob | string | null> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    path = lTool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (typeof options === 'string') {
        options = {
            'encoding': options,
        };
    }
    else {
        options ??= {};
    }
    const encoding = options.encoding;
    const start = options.start;
    const end = options.end;
    if (path.startsWith('/clickgo/') || path.startsWith('http:') || path.startsWith('https:') || path.startsWith('file:')) {
        let ourl: string = '';
        if (path.startsWith('/clickgo/')) {
            if (!clickgoFiles.includes(fpath)) {
                return null;
            }
            ourl = clickgo.getDirname() + fpath;
        }
        else {
            ourl = path + (options.after ?? '');
        }
        try {
            let blob: Blob | null = null;
            const headers: Record<string, string> = {};
            if (start ?? end) {
                headers['range'] = `bytes=${start ?? '0'}-${end ?? ''}`;
            }
            if (options.progress) {
                blob = await lTool.request(ourl, {
                    'headers': headers,
                    'progress': options.progress,
                    'responseType': 'blob'
                });
            }
            else {
                blob = await (await fetch(ourl, {
                    'headers': headers
                })).blob();
            }
            if (!blob) {
                return null;
            }
            if (!encoding) {
                return blob;
            }
            return await new Promise(function(resolve) {
                const fr = new FileReader();
                fr.addEventListener('load', function() {
                    resolve(fr.result as string | null);
                });
                fr.readAsText(blob, encoding);
            });
        }
        catch {
            return null;
        }
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await lTask.checkPermission(current, 'fs.' + path + 'r', false, undefined);
        if (!r[0]) {
            return null;
        }
        if (path.startsWith('/mounted/')) {
            const name = getMountName(path);
            const hanlder = mounts[name];
            if (!hanlder) {
                return null;
            }
            return hanlder.getContent?.(path.slice(9 + name.length), options) ?? null;
        }
        // --- storage ---
        if (options.progress) {
            // --- native 暂不支持 progress ---
            delete options.progress;
        }
        const rtn = await lNative.invokeSys(sysId, 'cg-fs-getContent', fpath, options);
        if (!rtn) {
            return null;
        }
        if (typeof rtn === 'string') {
            return rtn;
        }
        return new Blob([rtn], {
            'type': lTool.getMimeByPath(path).mime
        });
    }
    else if (path.startsWith('/package/') || path.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return null;
        }
        if (path.startsWith('/current/')) {
            return getContent(current, task.current + fpath, options);
        }
        const file = task.app.files[fpath];
        if (!file) {
            return null;
        }
        if (typeof file === 'string') {
            // --- 是文本直接返回 ---
            return file;
        }
        if (!options.encoding) {
            // --- 没有编码则返回 blob ---
            if (start === undefined && end === undefined) {
                return file;
            }
            return file.slice(start, end, file.type);
        }
        const encoding = options.encoding;
        return new Promise(function(resolve) {
            const fr = new FileReader();
            fr.addEventListener('load', function() {
                resolve(fr.result as string | null);
            });
            fr.readAsText(file, encoding);
        });
    }
    else {
        return null;
    }
}

/**
 * --- 写入文件内容 ---
 * @param current 当前任务 id
 * @param path 文件路径
 * @param data 要写入的内容
 * @param options 选项
 */
export async function putContent(current: lCore.TCurrent, path: string, data: string | Blob, options: {
    'encoding'?: BufferEncoding | null;
    'mode'?: string | number;
    'flag'?: string | number;
} = {}): Promise<boolean> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    path = lTool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await lTask.checkPermission(current, 'fs.' + path + 'w', false, undefined);
        if (!r[0]) {
            return false;
        }
        if (path.startsWith('/mounted/')) {
            const name = getMountName(path);
            const hanlder = mounts[name];
            if (!hanlder) {
                return false;
            }
            return hanlder.putContent?.(path.slice(9 + name.length), data, options) ?? false;
        }
        // --- storage ---
        let buf: Uint8Array | undefined = undefined;
        if (data instanceof Blob) {
            buf = new Uint8Array(await data.arrayBuffer());
        }
        return lNative.invokeSys(sysId, 'cg-fs-putContent', fpath, buf ?? data, options);
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return false;
        }
        return putContent(current, task.current + fpath, data, options);
    }
    else {
        return false;
    }
}

/**
 * --- 读取链接的 target ---
 * @param current 当前任务 id
 * @param path 要读取的路径
 * @param options 选项
 */
export async function readLink(
    current: lCore.TCurrent, path: string, encoding?: BufferEncoding
): Promise<string | null> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    path = lTool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return null;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await lTask.checkPermission(current, 'fs.' + path + 'r', false);
        if (!r[0]) {
            return null;
        }
        if (path.startsWith('/mounted/')) {
            const name = getMountName(path);
            const hanlder = mounts[name];
            if (!hanlder) {
                return null;
            }
            return hanlder.readLink?.(path.slice(9 + name.length), encoding) ?? null;
        }
        // --- storage ---
        return lNative.invokeSys(sysId, 'cg-fs-readLink', fpath, encoding);
    }
    else if (path.startsWith('/package/')) {
        return null;
    }
    else if (path.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return null;
        }
        return task.current;
    }
    else {
        return null;
    }
}

/**
 * --- 把源文件创建一个 link ---
 * @param current 当前任务 id
 * @param filePath 源文件
 * @param linkPath 连接路径
 * @param type 选项
 */
export async function symlink(current: lCore.TCurrent, filePath: string, linkPath: string, type?: 'dir' | 'file' | 'junction'): Promise<boolean> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    filePath = lTool.urlResolve('/', filePath);
    linkPath = lTool.urlResolve('/', linkPath);
    if (filePath.startsWith('/clickgo/')) {
        return false;
    }
    else if (filePath.startsWith('/storage/') || filePath.startsWith('/mounted/')) {
        const r = await lTask.checkPermission(current, 'fs.' + filePath + 'w', false);
        if (!r[0]) {
            return false;
        }
        if (filePath.startsWith('/mounted/')) {
            const fname = getMountName(filePath);
            const lname = getMountName(linkPath);
            if (fname !== lname) {
                return false;
            }
            const hanlder = mounts[fname];
            if (!hanlder) {
                return false;
            }
            return hanlder.symlink?.(filePath.slice(9 + fname.length), linkPath.slice(9 + fname.length), type) ?? false;
        }
        // --- storage ---
        return lNative.invokeSys(sysId, 'cg-fs-symlink', filePath.slice(8), linkPath.slice(8), type);
    }
    else if (filePath.startsWith('/package/')) {
        return false;
    }
    else if (filePath.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return false;
        }
        if (linkPath.startsWith('/current/')) {
            linkPath = task.current + linkPath.slice(8);
        }
        return symlink(current, task.current + filePath.slice(8), linkPath, type);
    }
    else {
        return false;
    }
}

/**
 * --- 删除一个文件 ---
 * @param current 当前任务 id
 * @param path 要删除的文件路径
 */
export async function unlink(current: lCore.TCurrent, path: string): Promise<boolean> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    path = lTool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await lTask.checkPermission(current, 'fs.' + path + 'w', false);
        if (!r[0]) {
            return false;
        }
        if (path.startsWith('/mounted/')) {
            const name = getMountName(path);
            const hanlder = mounts[name];
            if (!hanlder) {
                return false;
            }
            return hanlder.unlink?.(path.slice(9 + name.length)) ?? false;
        }
        // --- storage ---
        return lNative.invokeSys(sysId, 'cg-fs-unlink', fpath);
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return false;
        }
        return unlink(current, task.current + fpath);
    }
    else {
        return false;
    }
}

async function getClickGoStats(path: string): Promise<IStats | null> {
    if (path.endsWith('/')) {
        // --- 文件夹 ---
        const date = new Date();
        const ms = date.getTime();
        return {
            isFile: function() {
                return false;
            },
            isDirectory: function() {
                return true;
            },
            isSymbolicLink: function() {
                return false;
            },
            'size': 0,
            'blksize': 0,
            'atimeMs': ms,
            'mtimeMs': ms,
            'ctimeMs': ms,
            'birthtimeMs': ms,
            'atime': date,
            'mtime': date,
            'ctime': date,
            'birthtime': date
        };
    }
    else {
        // --- 文件 ---
        try {
            const res = await fetch(clickgo.getDirname() + path, {
                'headers': {
                    'range': `bytes=0-1`
                }
            });
            const hdate = res.headers.get('date');
            const hmdate = res.headers.get('last-modified');
            let hlength = res.headers.get('content-range');
            if (hlength) {
                const lio = hlength.lastIndexOf('/');
                hlength = hlength.slice(lio + 1);
            }
            let date = new Date();
            let mdate = date;
            if (hdate) {
                date = new Date(hdate);
            }
            if (hmdate) {
                mdate = new Date(hmdate);
            }
            const ms = date.getTime();
            const mms = mdate.getTime();
            return {
                isFile: function() {
                    return true;
                },
                isDirectory: function() {
                    return false;
                },
                isSymbolicLink: function() {
                    return false;
                },
                'size': hlength ? parseInt(hlength) : 0,
                'blksize': hlength ? parseInt(hlength) : 0,
                'atimeMs': ms,
                'mtimeMs': mms,
                'ctimeMs': mms,
                'birthtimeMs': ms,
                'atime': date,
                'mtime': mdate,
                'ctime': mdate,
                'birthtime': date
            };
        }
        catch {
            return null;
        }
    }
}

/**
 * --- 获取对象是否存在，存在则返回 stats 对象，否则返回 null ---
 * @param current 当前任务 id
 * @param path 对象路径
 */
export async function stats(current: lCore.TCurrent, path: string): Promise<IStats | null> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    path = lTool.urlResolve('/', path);
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    if (['', '/clickgo', '/storage', '/mounted', '/package'].includes(path)) {
        const date = new Date();
        const ms = date.getTime();
        return {
            isFile: function() {
                return false;
            },
            isDirectory: function() {
                return true;
            },
            isSymbolicLink: function() {
                return false;
            },
            'size': 0,
            'blksize': 0,
            'atimeMs': ms,
            'mtimeMs': ms,
            'ctimeMs': ms,
            'birthtimeMs': ms,
            'atime': date,
            'mtime': date,
            'ctime': date,
            'birthtime': date
        };
    }
    if (path === '/current') {
        const date = new Date();
        const ms = date.getTime();
        return {
            isFile: function() {
                return false;
            },
            isDirectory: function() {
                return false;
            },
            isSymbolicLink: function() {
                return true;
            },
            'size': 0,
            'blksize': 0,
            'atimeMs': ms,
            'mtimeMs': ms,
            'ctimeMs': ms,
            'birthtimeMs': ms,
            'atime': date,
            'mtime': date,
            'ctime': date,
            'birthtime': date
        };
    }
    let fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        if (!clickgoFiles.includes(fpath)) {
            if (!clickgoFiles.includes(fpath + '/')) {
                return null;
            }
            fpath += '/';
        }
        return getClickGoStats(fpath);
    }
    else if (path.startsWith('/storage/')) {
        const r = await lTask.checkPermission(current, 'fs.' + path + 'r', false);
        if (!r[0]) {
            return null;
        }
        const item = await lNative.invokeSys(sysId, 'cg-fs-stats', fpath);
        if (!item) {
            return null;
        }
        return {
            isFile: function() {
                return item.isFile;
            },
            isDirectory: function() {
                return item.isDirectory;
            },
            isSymbolicLink: function() {
                return item.isSymbolicLink;
            },
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
    else if (path.startsWith('/mounted/')) {
        const name = getMountName(path);
        const hanlder = mounts[name];
        if (!hanlder) {
            return null;
        }
        if (path === '/mounted/' + name) {
            const ms = hanlder.date!.getTime();
            return {
                isFile: function() {
                    return false;
                },
                isDirectory: function() {
                    return true;
                },
                isSymbolicLink: function() {
                    return false;
                },
                'size': 0,
                'blksize': 0,
                'atimeMs': ms,
                'mtimeMs': ms,
                'ctimeMs': ms,
                'birthtimeMs': ms,
                'atime': hanlder.date!,
                'mtime': hanlder.date!,
                'ctime': hanlder.date!,
                'birthtime': hanlder.date!
            };
        }
        const r = await lTask.checkPermission(current, 'fs.' + path + 'r', false);
        if (!r[0]) {
            return null;
        }
        return hanlder.stats?.(path.slice(9 + name.length)) ?? null;
    }
    else if (path.startsWith('/package/') || path.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return null;
        }
        if (path.startsWith('/current/')) {
            return stats(current, task.current + fpath);
        }
        if (task.app.files[fpath]) {
            // --- 文件 ---
            const file = task.app.files[fpath];
            const date = new Date();
            const ms = date.getTime();
            let size = 0;
            if (typeof file !== 'string') {
                size = file.size;
            }
            else {
                size = new Blob([file]).size;
            }
            return {
                isFile: function() {
                    return true;
                },
                isDirectory: function() {
                    return false;
                },
                isSymbolicLink: function() {
                    return false;
                },
                'size': size,
                'blksize': size,
                'atimeMs': ms,
                'mtimeMs': ms,
                'ctimeMs': ms,
                'birthtimeMs': ms,
                'atime': date,
                'mtime': date,
                'ctime': date,
                'birthtime': date
            };
        }
        // --- 检测是否是文件夹 ---
        if (!fpath.endsWith('/')) {
            fpath += '/';
        }
        for (const p in task.app.files) {
            if (!p.startsWith(fpath)) {
                continue;
            }
            // --- 文件夹 ---
            const date = new Date();
            const ms = date.getTime();
            return {
                isFile: function() {
                    return false;
                },
                isDirectory: function() {
                    return true;
                },
                isSymbolicLink: function() {
                    return false;
                },
                'size': 0,
                'blksize': 0,
                'atimeMs': ms,
                'mtimeMs': ms,
                'ctimeMs': ms,
                'birthtimeMs': ms,
                'atime': date,
                'mtime': date,
                'ctime': date,
                'birthtime': date
            };
        }
        return null;
    }
    else {
        return null;
    }
}

/**
 * --- 判断是否是目录或目录是否存在，是的话返回 stats ---
 * @param current 当前任务 id
 * @param path 判断路径
 */
export async function isDir(current: lCore.TCurrent, path: string): Promise<IStats | false> {
    const pstats = await stats(current, path);
    if (!pstats?.isDirectory()) {
        return false;
    }
    return pstats;
}

/**
 * --- 判断是否是文件或文件是否存在，是的话返回 stats ---
 * @param current 当前任务 id
 * @param path 判断路径
 */
export async function isFile(current: lCore.TCurrent, path: string): Promise<IStats | false> {
    const pstats = await stats(current, path);
    if (!pstats?.isFile()) {
        return false;
    }
    return pstats;
}

/**
 * --- 深度创建目录，如果最末目录存在，则自动创建成功 ---
 * @param current 当前任务 id
 * @param path 要创建的路径，如 /a/b/c/
 * @param mode 权限
 */
export async function mkdir(current: lCore.TCurrent, path: string, mode: number = 0o755): Promise<boolean> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    path = lTool.urlResolve('/', path);
    if (await isDir(current, path)) {
        return true;
    }
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await lTask.checkPermission(current, 'fs.' + path + 'w', false);
        if (!r[0]) {
            return false;
        }
        if (path.startsWith('/mounted/')) {
            const name = getMountName(path);
            const hanlder = mounts[name];
            if (!hanlder) {
                return false;
            }
            return hanlder.mkdir?.(path.slice(9 + name.length), mode) ?? false;
        }
        // --- storage ---
        return lNative.invokeSys(sysId, 'cg-fs-mkdir', fpath, mode);
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return false;
        }
        return mkdir(current, task.current + fpath, mode);
    }
    else {
        return false;
    }
}

/**
 * --- 删除空目录 ---
 * @param current 当前任务 id
 * @param path 要删除的目录
 */
export async function rmdir(current: lCore.TCurrent, path: string): Promise<boolean> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    path = lTool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await lTask.checkPermission(current, 'fs.' + path + 'w', false);
        if (!r[0]) {
            return false;
        }
        if (path.startsWith('/mounted/')) {
            const name = getMountName(path);
            const hanlder = mounts[name];
            if (!hanlder) {
                return false;
            }
            return hanlder.rmdir?.(path.slice(9 + name.length)) ?? false;
        }
        // --- storage ---
        return lNative.invokeSys(sysId, 'cg-fs-rmdir', fpath);
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return false;
        }
        return rmdir(current, task.current + fpath);
    }
    else {
        return false;
    }
}

/**
 * --- 删除一个非空目录 ---
 * --- [ Danger ] [ 危险 ] ---
 * @param current 当前任务 id
 * @param path 目录路径
 */
export async function rmdirDeep(current: lCore.TCurrent, path: string): Promise<boolean> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    path = lTool.urlResolve('/', path);
    if (!path.endsWith('/')) {
        path += '/';
    }
    const list = await readDir(current, path);
    for (const item of list) {
        const stat = await stats(current, path + item.name);
        if (!stat) {
            return false;
        }
        if (stat.isDirectory()) {
            // --- 目录 ---
            const rtn = await rmdirDeep(current, path + item.name);
            if (!rtn) {
                return false;
            }
        }
        else {
            const rtn = await unlink(current, path + item.name);
            if (!rtn) {
                return false;
            }
        }
    }
    return rmdir(current, path);
}

/**
 * --- 修改权限 ---
 * @param current 当前任务 id
 * @param path 要修改的路径
 * @param mod 权限
 */
export async function chmod(current: lCore.TCurrent, path: string, mod: string | number): Promise<boolean> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    path = lTool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await lTask.checkPermission(current, 'fs.' + path + 'w', false);
        if (!r[0]) {
            return false;
        }
        if (path.startsWith('/mounted/')) {
            const name = getMountName(path);
            const hanlder = mounts[name];
            if (!hanlder) {
                return false;
            }
            return hanlder.chmod?.(path.slice(9 + name.length), mod) ?? false;
        }
        // --- storage ---
        return lNative.invokeSys(sysId, 'cg-fs-chmod', fpath, mod);
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return false;
        }
        return chmod(current, task.current + fpath, mod);
    }
    else {
        return false;
    }
}

/**
 * --- 重命名/移动 文件文件夹 ---
 * @param current 当前任务 id
 * @param oldPath 老名
 * @param newPath 新名
 */
export async function rename(current: lCore.TCurrent, oldPath: string, newPath: string): Promise<boolean> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    oldPath = lTool.urlResolve('/', oldPath);
    newPath = lTool.urlResolve('/', newPath);
    if (!oldPath.startsWith(newPath.slice(0, 9))) {
        return false;
    }
    const ofpath = oldPath.slice(8);
    const nfpath = newPath.slice(8);
    if (oldPath.startsWith('/clickgo/')) {
        return false;
    }
    else if (oldPath.startsWith('/storage/') || oldPath.startsWith('/mounted/')) {
        let r = await lTask.checkPermission(current, 'fs.' + oldPath + 'w', false);
        if (!r[0]) {
            return false;
        }
        r = await lTask.checkPermission(current, 'fs.' + newPath + 'w', false, undefined);
        if (!r[0]) {
            return false;
        }
        if (oldPath.startsWith('/mounted/')) {
            const fname = getMountName(oldPath);
            const lname = getMountName(newPath);
            if (fname !== lname) {
                return false;
            }
            const hanlder = mounts[fname];
            if (!hanlder) {
                return false;
            }
            return hanlder.rename?.(oldPath.slice(9 + fname.length), newPath.slice(9 + fname.length)) ?? false;
        }
        // --- storage ---
        return lNative.invokeSys(sysId, 'cg-fs-rename', ofpath, nfpath);
    }
    else if (oldPath.startsWith('/package/')) {
        return false;
    }
    else if (oldPath.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return false;
        }
        return rename(current, task.current + ofpath, task.current + nfpath);
    }
    else {
        return false;
    }
}

/**
 * --- 获取文件夹下文件列表 ---
 * @param current 当前任务 id
 * @param path 文件夹路径
 * @param encoding 编码
 */
export async function readDir(current: lCore.TCurrent, path: string, encoding?: BufferEncoding): Promise<IDirent[]> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    path = lTool.urlResolve('/', path);
    if (path === '/') {
        const list = [
            {
                isFile: function() {
                    return false;
                },
                isDirectory: function() {
                    return true;
                },
                isSymbolicLink: function() {
                    return false;
                },
                'name': 'clickgo'
            },
            {
                isFile: function() {
                    return false;
                },
                isDirectory: function() {
                    return true;
                },
                isSymbolicLink: function() {
                    return false;
                },
                'name': 'storage'
            },
            {
                isFile: function() {
                    return false;
                },
                isDirectory: function() {
                    return true;
                },
                isSymbolicLink: function() {
                    return false;
                },
                'name': 'mounted'
            },
            {
                isFile: function() {
                    return false;
                },
                isDirectory: function() {
                    return true;
                },
                isSymbolicLink: function() {
                    return false;
                },
                'name': 'package'
            },
            {
                isFile: function() {
                    return false;
                },
                isDirectory: function() {
                    return false;
                },
                isSymbolicLink: function() {
                    return true;
                },
                'name': 'current'
            },
        ];
        return list;
    }
    if (!path.endsWith('/')) {
        path += '/';
    }
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        const list: IDirent[] = [];
        for (const item of clickgoFiles) {
            if (!item.startsWith(fpath)) {
                continue;
            }
            if (fpath === item) {
                // --- 是自己 ---
                continue;
            }
            const rpath = item.slice(fpath.length);
            if (rpath.includes('/')) {
                // --- 可能是下级 ---
                if (rpath.endsWith('/')) {
                    // --- 是个文件夹 ---
                    if (rpath.slice(0, -1).includes('/')) {
                        // --- 是好几层下面的文件夹了 ---
                        continue;
                    }
                    list.push({
                        isFile: function() {
                            return false;
                        },
                        isDirectory: function() {
                            return true;
                        },
                        isSymbolicLink: function() {
                            return false;
                        },
                        'name': rpath.slice(0, -1)
                    });
                }
                continue;
            }
            // --- 本层文件 ---
            list.push({
                isFile: function() {
                    return true;
                },
                isDirectory: function() {
                    return false;
                },
                isSymbolicLink: function() {
                    return false;
                },
                'name': rpath
            });
        }
        return list;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const list: IDirent[] = [];
        if (path === '/mounted/') {
            for (const name in mounts) {
                list.push({
                    isFile: function() {
                        return false;
                    },
                    isDirectory: function() {
                        return true;
                    },
                    isSymbolicLink: function() {
                        return false;
                    },
                    'name': name
                });
            }
            return list;
        }
        const r = await lTask.checkPermission(current, 'fs.' + path + 'r', false);
        if (!r[0]) {
            return [];
        }
        if (path.startsWith('/mounted/')) {
            const name = getMountName(path);
            const hanlder = mounts[name];
            if (!hanlder) {
                return [];
            }
            return hanlder.readDir?.(path.slice(9 + name.length), encoding) ?? [];
        }
        // --- storage ---
        const ls = await lNative.invokeSys(sysId, 'cg-fs-readDir', fpath, encoding);
        for (const item of ls) {
            list.push({
                isFile: function() {
                    return item.isFile;
                },
                isDirectory: function() {
                    return item.isDirectory;
                },
                isSymbolicLink: function() {
                    return item.isSymbolicLink;
                },
                'name': item.name
            });
        }
        return list;
    }
    else if (path.startsWith('/package/') || path.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return [];
        }
        if (path.startsWith('/current/')) {
            return readDir(current, task.current + fpath, encoding);
        }
        const list: IDirent[] = [];
        const dirs: string[] = [];
        for (const p in task.app.files) {
            if (!p.startsWith(fpath)) {
                continue;
            }
            const rpath = p.slice(fpath.length);
            const sio = rpath.indexOf('/');
            if (sio !== -1) {
                // --- 一定是下级文件，因此加入文件夹项目到 dirs ---
                const name = rpath.slice(0, sio);
                if (!dirs.includes(name)) {
                    dirs.push(name);
                    list.push({
                        isFile: function() {
                            return false;
                        },
                        isDirectory: function() {
                            return true;
                        },
                        isSymbolicLink: function() {
                            return false;
                        },
                        'name': name
                    });
                }
                continue;
            }
            // --- 本层文件 ---
            list.push({
                isFile: function() {
                    return true;
                },
                isDirectory: function() {
                    return false;
                },
                isSymbolicLink: function() {
                    return false;
                },
                'name': rpath
            });
        }
        return list;
    }
    else {
        return [];
    }
}

/**
 * --- 复制文件夹里的内容到另一个地方，失败不会回滚 ---
 * @param current 当前任务 id
 * @param from 源，末尾加 /
 * @param to 目标，末尾加 /
 * @param ignore 忽略的文件
 */
export async function copyFolder(
    current: lCore.TCurrent, from: string, to: string, ignore: RegExp[] = []
): Promise<number> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    let num = 0;
    // --- 如果源目录不存在或不是目录，则直接成功 :) ---
    if (!await isDir(current, from)) {
        return 0;
    }
    // --- 遍历源目录文件和文件夹，准备复制 ---
    const flist = await readDir(current, from);
    /** --- to 目录是否检查是否存在，空目录不复制，所以确定有 item file 的时候才创建 --- */
    let checkTo = false;
    for (const item of flist) {
        if (item.isDirectory()) {
            const r = await copyFolder(current, from + item.name + '/', to + item.name + '/', ignore);
            if (r === -1) {
                return r;
            }
            else {
                num += r;
            }
        }
        else if (item.isFile()) {
            // --- 先判断本文件是否被排除 ---
            if (ignore.length > 0 && lTool.match(item.name, ignore)) {
                continue;
            }
            if (!checkTo) {
                if (!await mkdir(current, to)) {
                    return -1;
                }
                checkTo = true;
            }
            if (!(await copyFile(current, from + item.name, to + item.name))) {
                continue;
            }
            ++num;
        }
    }
    return num;
}

/**
 * --- 复制文件 ---
 * @param current 当前任务 id
 * @param src 源文件
 * @param dest 目标文件
 */
export async function copyFile(current: lCore.TCurrent, src: string, dest: string): Promise<boolean> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    src = lTool.urlResolve('/', src);
    dest = lTool.urlResolve('/', dest);
    if (!src.startsWith(dest.slice(0, 9))) {
        return false;
    }
    const sfpath = src.slice(8);
    const dfpath = dest.slice(8);
    if (src.startsWith('/clickgo/')) {
        return false;
    }
    else if (src.startsWith('/storage/') || dest.startsWith('/mounted/')) {
        let r = await lTask.checkPermission(current, 'fs.' + src + 'r', false);
        if (!r[0]) {
            return false;
        }
        r = await lTask.checkPermission(current, 'fs.' + dest + 'w', false);
        if (!r[0]) {
            return false;
        }
        if (src.startsWith('/mounted/')) {
            const fname = getMountName(src);
            const lname = getMountName(dest);
            if (fname !== lname) {
                return false;
            }
            const hanlder = mounts[fname];
            if (!hanlder) {
                return false;
            }
            return hanlder.copyFile?.(src.slice(9 + fname.length), dest.slice(9 + fname.length)) ?? false;
        }
        // --- storage ---
        return lNative.invokeSys(sysId, 'cg-fs-copyFile', sfpath, dfpath);
    }
    else if (src.startsWith('/package/')) {
        return false;
    }
    else if (src.startsWith('/current/')) {
        const task = lTask.getOrigin(current);
        if (!task) {
            return false;
        }
        return copyFile(current, task.current + sfpath, task.current + dfpath);
    }
    else {
        return false;
    }
}

// --- 类型 ---

export interface IMountHandler {
    /** --- 挂载时间，无需设置 --- */
    'date'?: Date;
    getContent?: (path: string, options?: BufferEncoding | {
        'encoding'?: BufferEncoding;
        'start'?: number;
        'end'?: number;
        'progress'?: (loaded: number, total: number) => void | Promise<void>;
    }) => Blob | string | null | Promise<Blob | string | null>;
    putContent?: (path: string, data: string | Blob, options?: {
        'encoding'?: BufferEncoding | null;
        'mode'?: string | number;
        'flag'?: string | number;
    }) => boolean | Promise<boolean>;
    readLink?: (path: string, encoding?: BufferEncoding) => string | null | Promise<string | null>;
    symlink?: (filePath: string, linkPath: string, type?: 'dir' | 'file' | 'junction') => boolean | Promise<boolean>;
    unlink?: (path: string) => boolean | Promise<boolean>;
    stats?: (path: string) => IStats | null | Promise<IStats | null>;
    mkdir?: (path: string, mode?: number) => boolean | Promise<boolean>;
    rmdir?: (path: string) => boolean | Promise<boolean>;
    chmod?: (path: string, mod: string | number) => boolean | Promise<boolean>;
    rename?: (oldPath: string, newPath: string) => boolean | Promise<boolean>;
    readDir?: (path: string, encoding?: BufferEncoding) => IDirent[] | Promise<IDirent[]>;
    copyFile?: (src: string, dest: string) => boolean | Promise<boolean>;
}

/** --- 文件/文件夹信息对象 --- */
export interface IStats {
    isFile(): boolean;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
    'size': number;
    'blksize': number;
    'atimeMs': number;
    'mtimeMs': number;
    'ctimeMs': number;
    'birthtimeMs': number;
    'atime': Date;
    'mtime': Date;
    'ctime': Date;
    'birthtime': Date;
}

/** --- 目录下项目 ---  */
export interface IDirent {
    isFile(): boolean;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
    'name': string;
}
