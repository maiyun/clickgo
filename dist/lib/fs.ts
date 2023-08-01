/**
 * /clickgo/ ClickGo 系统文件目录，永远只读
 * /storage/ 本地模式可用，用于读取本地用户文件
 * /mounted/ 挂载目录，可挂载第三方，如 /mounted/clouddrive/
 * /package/ 包内文件存在时可用，用于读取包内文件，永远只读
 * /current/ app 运行起来的 task 的当前路径链接，这是个软连接，实际映射到实际的运行目录
*/
import * as types from '../../types';
import * as tool from './tool';
import * as task from './task';
import * as form from './form';
import * as core from './core';
import * as native from './native';

const clickgoFiles = ['/app/', '/app/demo/', '/app/demo/app.js', '/app/demo/config.json', '/app/demo/form/', '/app/demo/form/control/', '/app/demo/form/control/block/', '/app/demo/form/control/block/block.css', '/app/demo/form/control/block/block.xml', '/app/demo/form/control/box/', '/app/demo/form/control/box/box.js', '/app/demo/form/control/box/box.xml', '/app/demo/form/control/button/', '/app/demo/form/control/button/button.css', '/app/demo/form/control/button/button.js', '/app/demo/form/control/button/button.xml', '/app/demo/form/control/check/', '/app/demo/form/control/check/check.js', '/app/demo/form/control/check/check.xml', '/app/demo/form/control/date/', '/app/demo/form/control/date/date.js', '/app/demo/form/control/date/date.xml', '/app/demo/form/control/desc/', '/app/demo/form/control/desc/desc.js', '/app/demo/form/control/desc/desc.xml', '/app/demo/form/control/dialog/', '/app/demo/form/control/dialog/dialog.js', '/app/demo/form/control/dialog/dialog.xml', '/app/demo/form/control/echarts/', '/app/demo/form/control/echarts/echarts.js', '/app/demo/form/control/echarts/echarts.xml', '/app/demo/form/control/file/', '/app/demo/form/control/file/file.js', '/app/demo/form/control/file/file.xml', '/app/demo/form/control/flow/', '/app/demo/form/control/flow/flow.css', '/app/demo/form/control/flow/flow.js', '/app/demo/form/control/flow/flow.xml', '/app/demo/form/control/form/', '/app/demo/form/control/form/form.css', '/app/demo/form/control/form/form.js', '/app/demo/form/control/form/form.xml', '/app/demo/form/control/html/', '/app/demo/form/control/html/html.js', '/app/demo/form/control/html/html.xml', '/app/demo/form/control/iconview/', '/app/demo/form/control/iconview/iconview.js', '/app/demo/form/control/iconview/iconview.xml', '/app/demo/form/control/img/', '/app/demo/form/control/img/img.xml', '/app/demo/form/control/label/', '/app/demo/form/control/label/label.xml', '/app/demo/form/control/layout/', '/app/demo/form/control/layout/layout.js', '/app/demo/form/control/layout/layout.xml', '/app/demo/form/control/link/', '/app/demo/form/control/link/link.js', '/app/demo/form/control/link/link.xml', '/app/demo/form/control/list/', '/app/demo/form/control/list/list.css', '/app/demo/form/control/list/list.js', '/app/demo/form/control/list/list.xml', '/app/demo/form/control/loading/', '/app/demo/form/control/loading/loading.xml', '/app/demo/form/control/map/', '/app/demo/form/control/map/map.js', '/app/demo/form/control/map/map.xml', '/app/demo/form/control/marquee/', '/app/demo/form/control/marquee/marquee.js', '/app/demo/form/control/marquee/marquee.xml', '/app/demo/form/control/menu/', '/app/demo/form/control/menu/menu.js', '/app/demo/form/control/menu/menu.xml', '/app/demo/form/control/monaco/', '/app/demo/form/control/monaco/monaco.js', '/app/demo/form/control/monaco/monaco.xml', '/app/demo/form/control/nav/', '/app/demo/form/control/nav/nav.js', '/app/demo/form/control/nav/nav.xml', '/app/demo/form/control/page/', '/app/demo/form/control/page/page.js', '/app/demo/form/control/page/page.xml', '/app/demo/form/control/panel/', '/app/demo/form/control/panel/panel.js', '/app/demo/form/control/panel/panel.xml', '/app/demo/form/control/panel/test1.js', '/app/demo/form/control/panel/test1.xml', '/app/demo/form/control/panel/test2.xml', '/app/demo/form/control/property/', '/app/demo/form/control/property/property.js', '/app/demo/form/control/property/property.xml', '/app/demo/form/control/radio/', '/app/demo/form/control/radio/radio.js', '/app/demo/form/control/radio/radio.xml', '/app/demo/form/control/scroll/', '/app/demo/form/control/scroll/scroll.js', '/app/demo/form/control/scroll/scroll.xml', '/app/demo/form/control/select/', '/app/demo/form/control/select/select.js', '/app/demo/form/control/select/select.xml', '/app/demo/form/control/svg/', '/app/demo/form/control/svg/svg.js', '/app/demo/form/control/svg/svg.xml', '/app/demo/form/control/tab/', '/app/demo/form/control/tab/tab.js', '/app/demo/form/control/tab/tab.xml', '/app/demo/form/control/table/', '/app/demo/form/control/table/table.js', '/app/demo/form/control/table/table.xml', '/app/demo/form/control/text/', '/app/demo/form/control/text/text.js', '/app/demo/form/control/text/text.xml', '/app/demo/form/control/vflow/', '/app/demo/form/control/vflow/vflow.css', '/app/demo/form/control/vflow/vflow.js', '/app/demo/form/control/vflow/vflow.xml', '/app/demo/form/control/xterm/', '/app/demo/form/control/xterm/xterm.js', '/app/demo/form/control/xterm/xterm.xml', '/app/demo/form/event/', '/app/demo/form/event/form/', '/app/demo/form/event/form/form.css', '/app/demo/form/event/form/form.js', '/app/demo/form/event/form/form.xml', '/app/demo/form/event/other/', '/app/demo/form/event/other/other.js', '/app/demo/form/event/other/other.xml', '/app/demo/form/event/screen/', '/app/demo/form/event/screen/screen.js', '/app/demo/form/event/screen/screen.xml', '/app/demo/form/event/task/', '/app/demo/form/event/task/task.js', '/app/demo/form/event/task/task.xml', '/app/demo/form/main.css', '/app/demo/form/main.js', '/app/demo/form/main.xml', '/app/demo/form/method/', '/app/demo/form/method/aform/', '/app/demo/form/method/aform/aform.js', '/app/demo/form/method/aform/aform.xml', '/app/demo/form/method/aform/sd.js', '/app/demo/form/method/aform/sd.xml', '/app/demo/form/method/core/', '/app/demo/form/method/core/core.js', '/app/demo/form/method/core/core.xml', '/app/demo/form/method/dom/', '/app/demo/form/method/dom/dom.css', '/app/demo/form/method/dom/dom.js', '/app/demo/form/method/dom/dom.xml', '/app/demo/form/method/form/', '/app/demo/form/method/form/form.css', '/app/demo/form/method/form/form.js', '/app/demo/form/method/form/form.xml', '/app/demo/form/method/form/test.xml', '/app/demo/form/method/fs/', '/app/demo/form/method/fs/fs.js', '/app/demo/form/method/fs/fs.xml', '/app/demo/form/method/fs/text.js', '/app/demo/form/method/fs/text.xml', '/app/demo/form/method/native/', '/app/demo/form/method/native/native.js', '/app/demo/form/method/native/native.xml', '/app/demo/form/method/system/', '/app/demo/form/method/system/system.js', '/app/demo/form/method/system/system.xml', '/app/demo/form/method/task/', '/app/demo/form/method/task/locale1.json', '/app/demo/form/method/task/locale2.json', '/app/demo/form/method/task/task.js', '/app/demo/form/method/task/task.xml', '/app/demo/form/method/theme/', '/app/demo/form/method/theme/theme.js', '/app/demo/form/method/theme/theme.xml', '/app/demo/form/method/tool/', '/app/demo/form/method/tool/tool.js', '/app/demo/form/method/tool/tool.xml', '/app/demo/form/method/zip/', '/app/demo/form/method/zip/zip.js', '/app/demo/form/method/zip/zip.xml', '/app/demo/global.css', '/app/demo/res/', '/app/demo/res/icon.svg', '/app/demo/res/img.jpg', '/app/demo/res/r-1.svg', '/app/demo/res/r-2.svg', '/app/demo/res/sql.svg', '/app/demo/res/txt.svg', '/app/demo/res/zip.svg', '/app/task/', '/app/task/app.js', '/app/task/config.json', '/app/task/form/', '/app/task/form/bar/', '/app/task/form/bar/bar.js', '/app/task/form/bar/bar.xml', '/app/task/form/desktop/', '/app/task/form/desktop/desktop.xml', '/app/task/locale/', '/app/task/locale/en.json', '/app/task/locale/ja.json', '/app/task/locale/sc.json', '/app/task/locale/tc.json', '/clickgo.js', '/clickgo.ts', '/control/', '/control/box.cgc', '/control/common.cgc', '/control/desc.cgc', '/control/echarts.cgc', '/control/form.cgc', '/control/html.cgc', '/control/iconview.cgc', '/control/map.cgc', '/control/monaco.cgc', '/control/nav.cgc', '/control/page.cgc', '/control/property.cgc', '/control/table.cgc', '/control/task.cgc', '/control/xterm.cgc', '/global.css', '/icon.png', '/index.js', '/index.ts', '/lib/', '/lib/control.js', '/lib/control.ts', '/lib/core.js', '/lib/core.ts', '/lib/dom.js', '/lib/dom.ts', '/lib/form.js', '/lib/form.ts', '/lib/fs.js', '/lib/fs.ts', '/lib/native.js', '/lib/native.ts', '/lib/task.js', '/lib/task.ts', '/lib/theme.js', '/lib/theme.ts', '/lib/tool.js', '/lib/tool.ts', '/lib/zip.js', '/lib/zip.ts', '/theme/', '/theme/byterun.cgt', '/theme/familiar.cgt', '/theme/light.cgt'];

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
const mounts: Record<string, types.IMountHandler> = {};

/** --- 根据 mounted 的 path 获取挂载点 name --- */
function getMountName(path: string): string {
    const io = path.slice(9).indexOf('/');
    return io === -1 ? path.slice(9) : path.slice(9, io + 9);
}

/**
 * --- 挂载到 mounted 目录下 ---
 * @param name 目录名
 * @param handler 回调相关
 * @param taskId App 模式下无效
 */
export function mount(name: string, handler: types.IMountHandler, taskId?: number): boolean {
    if (mounts[name]) {
        return false;
    }
    if (!/^[a-zA-Z][\w]+$/.test(name)) {
        return false;
    }
    if (taskId) {
        const t = task.list[taskId];
        if (t) {
            const val = 'fs./mounted/' + name + '/w';
            if (!t.runtime.permissions.includes(val)) {
                t.runtime.permissions.push(val);
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
    const loc = localeData[core.config.locale]?.['apply-unmount'] ?? localeData['en']['apply-unmount'];
    if (!await form.superConfirm(loc.replace('?', '/mount/' + name + '/'))) {
        return false;
    }
    delete mounts[name];
    return true;
}

export async function getContent(path: string, options?: {
    'start'?: number;
    'end'?: number;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
}, taskId?: number): Promise<string | Blob | null>;
export async function getContent(path: string, options: BufferEncoding | {
    'encoding': BufferEncoding;
    'start'?: number;
    'end'?: number;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
}, taskId?: number): Promise<string | null>;
/**
 * --- 读取完整文件或一段 ---
 * @param path 文件路径
 * @param options 编码或选项
 * @param taskId App 模式下无效
 */
export async function getContent(path: string, options?: BufferEncoding | {
    'encoding'?: BufferEncoding;
    'start'?: number;
    'end'?: number;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
}, taskId?: number): Promise<Blob | string | null> {
    path = tool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (typeof options === 'string') {
        options = {
            'encoding': options
        };
    }
    else if (!options) {
        options = {};
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
            ourl = tool.urlResolve(__dirname, './').slice(0, -1) + fpath;
        }
        else {
            ourl = path;
        }
        try {
            const rand = Math.random().toString();
            let blob: Blob | null = null;
            const headers: Record<string, string> = {};
            if (start || end) {
                headers['range'] = `bytes=${start === undefined ? '0' : start}-${end === undefined ? '' : end}`;
            }
            if (options.progress) {
                blob = await tool.request(ourl + (!ourl.startsWith(loader.cdn) ? ('?' + rand) : ''), {
                    'headers': headers,
                    'progress': options.progress,
                    'responseType': 'blob'
                });
            }
            else {
                blob = await (await fetch(ourl + (!ourl.startsWith(loader.cdn) ? ('?' + rand) : ''), {
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
                fr.readAsText(blob!, encoding);
            });
        }
        catch {
            return null;
        }
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await task.checkPermission('fs.' + path + 'r', false, undefined, taskId);
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
        const rtn = await native.invoke('cg-fs-getContent', native.getToken(), fpath, options);
        if (!rtn) {
            return null;
        }
        if (typeof rtn === 'string') {
            return rtn;
        }
        return new Blob([rtn], {
            'type': tool.getMimeByPath(path).mime
        });
    }
    else if (path.startsWith('/package/') || path.startsWith('/current/')) {
        if (!taskId) {
            return null;
        }
        if (path.startsWith('/current/')) {
            return getContent(task.list[taskId].current + fpath, options, taskId);
        }
        const file = task.list[taskId].app.files[fpath];
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
 * @param path 文件路径
 * @param data 要写入的内容
 * @param options 选项
 * @param taskId App 模式下无效
 */
export async function putContent(path: string, data: string | Blob, options: {
    'encoding'?: BufferEncoding | null;
    'mode'?: string | number;
    'flag'?: string | number;
} = {}, taskId?: number): Promise<boolean> {
    path = tool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await task.checkPermission('fs.' + path + 'w', false, undefined, taskId);
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
        return native.invoke('cg-fs-putContent', native.getToken(), fpath, buf ?? data, options);
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        if (!taskId) {
            return false;
        }
        return putContent(task.list[taskId].current + fpath, data, options, taskId);
    }
    else {
        return false;
    }
}

/**
 * --- 读取链接的 target ---
 * @param path 要读取的路径
 * @param options 选项
 */
export async function readLink(path: string, encoding?: BufferEncoding, taskId?: number): Promise<string | null> {
    path = tool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return null;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await task.checkPermission('fs.' + path + 'r', false, undefined, taskId);
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
        return native.invoke('cg-fs-readLink', native.getToken(), fpath, encoding);
    }
    else if (path.startsWith('/package/')) {
        return null;
    }
    else if (path.startsWith('/current/')) {
        if (!taskId) {
            return null;
        }
        return task.list[taskId].current;
    }
    else {
        return null;
    }
}

/**
 * --- 把源文件创建一个 link ---
 * @param filePath 源文件
 * @param linkPath 连接路径
 * @param type 选项
 * @param taskId App 模式下无效
 */
export async function symlink(filePath: string, linkPath: string, type?: 'dir' | 'file' | 'junction', taskId?: number): Promise<boolean> {
    filePath = tool.urlResolve('/', filePath);
    linkPath = tool.urlResolve('/', linkPath);
    if (filePath.startsWith('/clickgo/')) {
        return false;
    }
    else if (filePath.startsWith('/storage/') || filePath.startsWith('/mounted/')) {
        const r = await task.checkPermission('fs.' + filePath + 'w', false, undefined, taskId);
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
        return native.invoke('cg-fs-symlink', native.getToken(), filePath.slice(8), linkPath.slice(8), type);
    }
    else if (filePath.startsWith('/package/')) {
        return false;
    }
    else if (filePath.startsWith('/current/')) {
        if (!taskId) {
            return false;
        }
        if (linkPath.startsWith('/current/')) {
            linkPath = task.list[taskId].current + linkPath.slice(8);
        }
        return symlink(task.list[taskId].current + filePath.slice(8), linkPath, type, taskId);
    }
    else {
        return false;
    }
}

/**
 * --- 删除一个文件 ---
 * @param path 要删除的文件路径
 * @param taskId App 模式下无效
 */
export async function unlink(path: string, taskId?: number): Promise<boolean> {
    path = tool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await task.checkPermission('fs.' + path + 'w', false, undefined, taskId);
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
        return native.invoke('cg-fs-unlink', native.getToken(), fpath);
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        if (!taskId) {
            return false;
        }
        return unlink(task.list[taskId].current + fpath, taskId);
    }
    else {
        return false;
    }
}

async function getClickGoStats(path: string): Promise<types.IStats | null> {
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
            const res = await fetch(tool.urlResolve(__dirname, './').slice(0, -1) + path, {
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
 * @param path 对象路径
 * @param taskId App 模式下无效
 */
export async function stats(path: string, taskId?: number): Promise<types.IStats | null> {
    path = tool.urlResolve('/', path);
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
        const r = await task.checkPermission('fs.' + path + 'r', false, undefined, taskId);
        if (!r[0]) {
            return null;
        }
        const item = await native.invoke('cg-fs-stats', native.getToken(), fpath);
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
        const r = await task.checkPermission('fs.' + path + 'r', false, undefined, taskId);
        if (!r[0]) {
            return null;
        }
        return hanlder.stats?.(path.slice(9 + name.length)) ?? null;
    }
    else if (path.startsWith('/package/') || path.startsWith('/current/')) {
        if (!taskId) {
            return null;
        }
        if (path.startsWith('/current/')) {
            return stats(task.list[taskId].current + fpath, taskId);
        }
        if (task.list[taskId].app.files[fpath]) {
            // --- 文件 ---
            const file = task.list[taskId].app.files[fpath];
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
        for (const p in task.list[taskId].app.files) {
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
 * @param path 判断路径woml
 * @param taskId App 模式下无效
 */
export async function isDir(path: string, taskId?: number): Promise<types.IStats | false> {
    const pstats = await stats(path, taskId);
    if (!pstats?.isDirectory()) {
        return false;
    }
    return pstats;
}

/**
 * --- 判断是否是文件或文件是否存在，是的话返回 stats ---
 * @param path 判断路径
 * @param taskId App 模式下无效
 */
export async function isFile(path: string, taskId?: number): Promise<types.IStats | false> {
    const pstats = await stats(path, taskId);
    if (!pstats?.isFile()) {
        return false;
    }
    return pstats;
}

/**
 * --- 深度创建目录，如果最末目录存在，则自动创建成功 ---
 * @param path 要创建的路径，如 /a/b/c/
 * @param mode 权限
 * @param taskId App 模式下无效
 */
export async function mkdir(path: string, mode: number = 0o755, taskId?: number): Promise<boolean> {
    path = tool.urlResolve('/', path);
    if (await isDir(path, taskId)) {
        return true;
    }
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await task.checkPermission('fs.' + path + 'w', false, undefined, taskId);
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
        return native.invoke('cg-fs-mkdir', native.getToken(), fpath, mode);
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        if (!taskId) {
            return false;
        }
        return mkdir(task.list[taskId].current + fpath, mode, taskId);
    }
    else {
        return false;
    }
}

/**
 * --- 删除空目录 ---
 * @param path 要删除的目录
 * @param taskId App 模式下无效
 */
export async function rmdir(path: string, taskId?: number): Promise<boolean> {
    path = tool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await task.checkPermission('fs.' + path + 'w', false, undefined, taskId);
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
        return native.invoke('cg-fs-rmdir', native.getToken(), fpath);
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        if (!taskId) {
            return false;
        }
        return rmdir(task.list[taskId].current + fpath, taskId);
    }
    else {
        return false;
    }
}

/**
 * --- 删除一个非空目录 ---
 * --- [ Danger ] [ 危险 ] ---
 * @param path 目录路径
 * @param taskId App 模式下无效
 */
export async function rmdirDeep(path: string, taskId?: number): Promise<boolean> {
    path = tool.urlResolve('/', path);
    if (!path.endsWith('/')) {
        path += '/';
    }
    const list = await readDir(path, undefined, taskId);
    for (const item of list) {
        const stat = await stats(path + item.name, taskId);
        if (!stat) {
            return false;
        }
        if (stat.isDirectory()) {
            // --- 目录 ---
            const rtn = await rmdirDeep(path + item.name, taskId);
            if (!rtn) {
                return false;
            }
        }
        else {
            const rtn = await unlink(path + item.name, taskId);
            if (!rtn) {
                return false;
            }
        }
    }
    return rmdir(path, taskId);
}

/**
 * --- 修改权限 ---
 * @param path 要修改的路径
 * @param mod 权限
 * @param taskId App 模式下无效
 */
export async function chmod(path: string, mod: string | number, taskId?: number): Promise<boolean> {
    path = tool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
        const r = await task.checkPermission('fs.' + path + 'w', false, undefined, taskId);
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
        return native.invoke('cg-fs-chmod', native.getToken(), fpath, mod);
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        if (!taskId) {
            return false;
        }
        return chmod(task.list[taskId].current + fpath, mod, taskId);
    }
    else {
        return false;
    }
}

/**
 * --- 重命名/移动 文件文件夹 ---
 * @param oldPath 老名
 * @param newPath 新名
 */
export async function rename(oldPath: string, newPath: string, taskId?: number): Promise<boolean> {
    oldPath = tool.urlResolve('/', oldPath);
    newPath = tool.urlResolve('/', newPath);
    if (!oldPath.startsWith(newPath.slice(0, 9))) {
        return false;
    }
    const ofpath = oldPath.slice(8);
    const nfpath = newPath.slice(8);
    if (oldPath.startsWith('/clickgo/')) {
        return false;
    }
    else if (oldPath.startsWith('/storage/') || oldPath.startsWith('/mounted/')) {
        let r = await task.checkPermission('fs.' + oldPath + 'w', false, undefined, taskId);
        if (!r[0]) {
            return false;
        }
        r = await task.checkPermission('fs.' + newPath + 'w', false, undefined, taskId);
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
        return native.invoke('cg-fs-rename', native.getToken(), ofpath, nfpath);
    }
    else if (oldPath.startsWith('/package/')) {
        return false;
    }
    else if (oldPath.startsWith('/current/')) {
        if (!taskId) {
            return false;
        }
        return rename(task.list[taskId].current + ofpath, task.list[taskId].current + nfpath, taskId);
    }
    else {
        return false;
    }
}

/**
 * --- 获取文件夹下文件列表 ---
 * @param path 文件夹路径
 * @param encoding 编码
 * @param taskId App 模式下无效
 */
export async function readDir(path: string, encoding?: BufferEncoding, taskId?: number): Promise<types.IDirent[]> {
    path = tool.urlResolve('/', path);
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
            }
        ];
        if (taskId) {
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
                'name': 'package'
            });
        }
        if (taskId) {
            list.push({
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
            });
        }
        return list;
    }
    if (!path.endsWith('/')) {
        path += '/';
    }
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        const list: types.IDirent[] = [];
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
        const list: types.IDirent[] = [];
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
        const r = await task.checkPermission('fs.' + path + 'r', false, undefined, taskId);
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
        const ls = await native.invoke('cg-fs-readDir', native.getToken(), fpath, encoding);
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
        if (!taskId) {
            return [];
        }
        if (path.startsWith('/current/')) {
            return readDir(task.list[taskId].current + fpath, encoding, taskId);
        }
        const list: types.IDirent[] = [];
        const dirs: string[] = [];
        for (const p in task.list[taskId].app.files) {
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
 * @param from 源，末尾加 /
 * @param to 目标，末尾加 /
 * @param ignore 忽略的文件
 * @param taskId App 模式下无效
 */
export async function copyFolder(from: string, to: string, ignore: RegExp[] = [], taskId?: number): Promise<number> {
    let num = 0;
    // --- 如果源目录不存在或不是目录，则直接成功 :) ---
    if (!await isDir(from, taskId)) {
        return 0;
    }
    // --- 遍历源目录文件和文件夹，准备复制 ---
    const flist = await readDir(from, undefined, taskId);
    /** --- to 目录是否检查是否存在，空目录不复制，所以确定有 item file 的时候才创建 --- */
    let checkTo = false;
    for (const item of flist) {
        if (item.isDirectory()) {
            const r = await copyFolder(from + item.name + '/', to + item.name + '/', ignore, taskId);
            if (r === -1) {
                return r;
            }
            else {
                num += r;
            }
        }
        else if (item.isFile()) {
            // --- 先判断本文件是否被排除 ---
            if (ignore.length > 0 && tool.match(item.name, ignore)) {
                continue;
            }
            if (!checkTo) {
                if (!await mkdir(to, undefined, taskId)) {
                    return -1;
                }
                checkTo = true;
            }
            if (!(await copyFile(from + item.name, to + item.name, taskId))) {
                continue;
            }
            ++num;
        }
    }
    return num;
}

/**
 * --- 复制文件 ---
 * @param src 源文件
 * @param dest 目标文件
 * @param taskId App 模式下无效
 */
export async function copyFile(src: string, dest: string, taskId?: number): Promise<boolean> {
    src = tool.urlResolve('/', src);
    dest = tool.urlResolve('/', dest);
    if (!src.startsWith(dest.slice(0, 9))) {
        return false;
    }
    const sfpath = src.slice(8);
    const dfpath = dest.slice(8);
    if (src.startsWith('/clickgo/')) {
        return false;
    }
    else if (src.startsWith('/storage/') || dest.startsWith('/mounted/')) {
        let r = await task.checkPermission('fs.' + src + 'r', false, undefined, taskId);
        if (!r[0]) {
            return false;
        }
        r = await task.checkPermission('fs.' + dest + 'w', false, undefined, taskId);
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
        return native.invoke('cg-fs-copyFile', native.getToken(), sfpath, dfpath);
    }
    else if (src.startsWith('/package/')) {
        return false;
    }
    else if (src.startsWith('/current/')) {
        if (!taskId) {
            return false;
        }
        return copyFile(task.list[taskId].current + sfpath, task.list[taskId].current + dfpath, taskId);
    }
    else {
        return false;
    }
}
