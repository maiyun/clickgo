/**
 * /clickgo/ ClickGo 系统文件目录，永远只读
 * /storage/ 本地模式可用，用于读取本地用户文件
 * /mounted/ 挂载目录，可挂载第三方，如 /mounted/clouddrive/
 * /package/ 包内文件存在时可用，用于读取包内文件，永远只读
 * /current/ app 运行起来的 task 的当前路径链接，这是个软连接，实际映射到实际的运行目录
*/
import * as types from '../../types';
import * as tool from './tool';

const clickgoFiles = ['/app/', '/app/demo/', '/app/demo/config.json', '/app/demo/form/', '/app/demo/form/control/', '/app/demo/form/control/block/', '/app/demo/form/control/block/block.css', '/app/demo/form/control/block/block.xml', '/app/demo/form/control/button/', '/app/demo/form/control/button/button.css', '/app/demo/form/control/button/button.js', '/app/demo/form/control/button/button.xml', '/app/demo/form/control/check/', '/app/demo/form/control/check/check.js', '/app/demo/form/control/check/check.xml', '/app/demo/form/control/dialog/', '/app/demo/form/control/dialog/dialog.js', '/app/demo/form/control/dialog/dialog.xml', '/app/demo/form/control/file/', '/app/demo/form/control/file/file.js', '/app/demo/form/control/file/file.xml', '/app/demo/form/control/form/', '/app/demo/form/control/form/form.css', '/app/demo/form/control/form/form.js', '/app/demo/form/control/form/form.xml', '/app/demo/form/control/greatview/', '/app/demo/form/control/greatview/greatview.css', '/app/demo/form/control/greatview/greatview.js', '/app/demo/form/control/greatview/greatview.xml', '/app/demo/form/control/img/', '/app/demo/form/control/img/img.xml', '/app/demo/form/control/label/', '/app/demo/form/control/label/label.xml', '/app/demo/form/control/list/', '/app/demo/form/control/list/list.css', '/app/demo/form/control/list/list.js', '/app/demo/form/control/list/list.xml', '/app/demo/form/control/loading/', '/app/demo/form/control/loading/loading.xml', '/app/demo/form/control/marquee/', '/app/demo/form/control/marquee/marquee.js', '/app/demo/form/control/marquee/marquee.xml', '/app/demo/form/control/menu/', '/app/demo/form/control/menu/menu.js', '/app/demo/form/control/menu/menu.xml', '/app/demo/form/control/monaco/', '/app/demo/form/control/monaco/monaco.js', '/app/demo/form/control/monaco/monaco.xml', '/app/demo/form/control/overflow/', '/app/demo/form/control/overflow/overflow.css', '/app/demo/form/control/overflow/overflow.js', '/app/demo/form/control/overflow/overflow.xml', '/app/demo/form/control/property/', '/app/demo/form/control/property/property.js', '/app/demo/form/control/property/property.xml', '/app/demo/form/control/radio/', '/app/demo/form/control/radio/radio.js', '/app/demo/form/control/radio/radio.xml', '/app/demo/form/control/scroll/', '/app/demo/form/control/scroll/scroll.js', '/app/demo/form/control/scroll/scroll.xml', '/app/demo/form/control/select/', '/app/demo/form/control/select/select.js', '/app/demo/form/control/select/select.xml', '/app/demo/form/control/tab/', '/app/demo/form/control/tab/tab.js', '/app/demo/form/control/tab/tab.xml', '/app/demo/form/control/text/', '/app/demo/form/control/text/text.js', '/app/demo/form/control/text/text.xml', '/app/demo/form/control/view/', '/app/demo/form/control/view/view.css', '/app/demo/form/control/view/view.js', '/app/demo/form/control/view/view.xml', '/app/demo/form/event/', '/app/demo/form/event/form/', '/app/demo/form/event/form/form.css', '/app/demo/form/event/form/form.js', '/app/demo/form/event/form/form.xml', '/app/demo/form/event/screen/', '/app/demo/form/event/screen/screen.js', '/app/demo/form/event/screen/screen.xml', '/app/demo/form/event/task/', '/app/demo/form/event/task/task.js', '/app/demo/form/event/task/task.xml', '/app/demo/form/main.css', '/app/demo/form/main.js', '/app/demo/form/main.xml', '/app/demo/form/method/', '/app/demo/form/method/core/', '/app/demo/form/method/core/core.js', '/app/demo/form/method/core/core.xml', '/app/demo/form/method/dom/', '/app/demo/form/method/dom/dom.css', '/app/demo/form/method/dom/dom.js', '/app/demo/form/method/dom/dom.xml', '/app/demo/form/method/form/', '/app/demo/form/method/form/form.css', '/app/demo/form/method/form/form.js', '/app/demo/form/method/form/form.xml', '/app/demo/form/method/form/test.xml', '/app/demo/form/method/fs/', '/app/demo/form/method/fs/fs.js', '/app/demo/form/method/fs/fs.xml', '/app/demo/form/method/fs/text.js', '/app/demo/form/method/fs/text.xml', '/app/demo/form/method/task/', '/app/demo/form/method/task/locale1.json', '/app/demo/form/method/task/locale2.json', '/app/demo/form/method/task/task.js', '/app/demo/form/method/task/task.xml', '/app/demo/form/method/theme/', '/app/demo/form/method/theme/theme.js', '/app/demo/form/method/theme/theme.xml', '/app/demo/form/method/tool/', '/app/demo/form/method/tool/tool.js', '/app/demo/form/method/tool/tool.xml', '/app/demo/form/method/zip/', '/app/demo/form/method/zip/zip.js', '/app/demo/form/method/zip/zip.xml', '/app/demo/global.css', '/app/demo/res/', '/app/demo/res/icon.svg', '/app/demo/res/img.jpg', '/app/demo/res/r-1.svg', '/app/demo/res/r-2.svg', '/app/demo/res/sql.svg', '/app/demo/res/txt.svg', '/app/demo/res/zip.svg', '/app/task/', '/app/task/config.json', '/app/task/form/', '/app/task/form/bar/', '/app/task/form/bar/bar.js', '/app/task/form/bar/bar.xml', '/app/task/form/desktop/', '/app/task/form/desktop/desktop.xml', '/app/task/locale/', '/app/task/locale/en.json', '/app/task/locale/ja.json', '/app/task/locale/sc.json', '/app/task/locale/tc.json', '/clickgo.js', '/clickgo.ts', '/control/', '/control/common.cgc', '/control/form.cgc', '/control/monaco.cgc', '/control/property.cgc', '/control/task.cgc', '/global.css', '/icon.png', '/index.js', '/index.ts', '/lib/', '/lib/control.js', '/lib/control.ts', '/lib/core.js', '/lib/core.ts', '/lib/dom.js', '/lib/dom.ts', '/lib/form.js', '/lib/form.ts', '/lib/fs.js', '/lib/fs.ts', '/lib/native.js', '/lib/native.ts', '/lib/task.js', '/lib/task.ts', '/lib/theme.js', '/lib/theme.ts', '/lib/tool.js', '/lib/tool.ts', '/lib/zip.js', '/lib/zip.ts', '/theme/', '/theme/familiar.cgt'];

export async function getContent(path: string, options?: {
    'start'?: number;
    'end'?: number;
    'files'?: Record<string, Blob | string>;
    'current'?: string;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
}): Promise<string | Blob | null>;
export async function getContent(path: string, options: BufferEncoding | {
    'encoding': BufferEncoding;
    'start'?: number;
    'end'?: number;
    'files'?: Record<string, Blob | string>;
    'current'?: string;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
}): Promise<string | null>;
/**
 * --- 读取完整文件或一段 ---
 * @param path 文件路径
 * @param options 编码或选项
 */
export async function getContent(path: string, options?: BufferEncoding | {
    'encoding'?: BufferEncoding;
    'start'?: number;
    'end'?: number;
    'files'?: Record<string, Blob | string>;
    'current'?: string;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
}): Promise<Blob | string | null> {
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
    if (path.startsWith('/clickgo/') || path.startsWith('http:') || path.startsWith('https:')) {
        let ourl: string = '';
        if (path.startsWith('/clickgo/')) {
            if (!clickgoFiles.includes(fpath)) {
                return null;
            }
            ourl = tool.urlResolve(__dirname, './').slice(0, -1) + fpath;
        }
        else  {
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
                blob = await tool.request(ourl + '?' + rand, {
                    'headers': headers,
                    'progress': options.progress,
                    'responseType': 'blob'
                });
            }
            else {
                blob = await (await fetch(ourl + '?' + rand, {
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
    else if (path.startsWith('/storage/')) {
        // --- TODO ---
        return null;
    }
    else if (path.startsWith('/mounted/')) {
        // --- TODO ---
        return null;
    }
    else if (path.startsWith('/package/')) {
        if (!options.files) {
            return null;
        }
        const file = options.files[fpath];
        if (!file) {
            return null;
        }
        if (typeof file === 'string') {
            // --- 是文本直接返回 ---
            return file;
        }
        if (!options.encoding) {
            // --- 没有编码则返回 blob ---
            return file;
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
    else if (path.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return null;
        }
        options.current = options.current.slice(0, -1);
        return getContent(options.current + fpath, options);
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
 */
export async function putContent(path: string, data: string | Buffer, options: {
    'encoding'?: BufferEncoding | null;
    'mode'?: string | number;
    'flag'?: string | number;
    'current'?: string;
} = {}): Promise<boolean> {
    path = tool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/')) {
        // --- TODO ---
        return false;
    }
    else if (path.startsWith('/mounted/')) {
        // --- TODO ---
        return false;
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return false;
        }
        options.current = options.current.slice(0, -1);
        return putContent(options.current + fpath, data, options);
    }
    else {
        return false;
    }
}

/**
 * --- 读取链接的 target ---
 * @param path 要读取的路径
 * @param encoding 编码
 */
export async function readLink(path: string, options?: BufferEncoding | {
    'encoding'?: BufferEncoding;
    'current'?: string;
}): Promise<string | null> {
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
    if (path.startsWith('/clickgo/')) {
        return null;
    }
    else if (path.startsWith('/storage/')) {
        // --- TODO ---
        return null;
    }
    else if (path.startsWith('/mounted/')) {
        // --- TODO ---
        return null;
    }
    else if (path.startsWith('/package/')) {
        return null;
    }
    else if (path.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return null;
        }
        return options.current;
    }
    else {
        return null;
    }
}

/**
 * --- 把源文件创建一个 link ---
 * @param filePath 源文件
 * @param linkPath 连接路径
 * @param type 仅 Windows，类型，默认 file
 */
export async function symlink(filePath: string, linkPath: string, options: {
    'type'?: 'dir' | 'file' | 'junction';
    'current'?: string;
} = {}): Promise<boolean> {
    filePath = tool.urlResolve('/', filePath);
    linkPath = tool.urlResolve('/', linkPath);
    if (filePath.startsWith('/clickgo/')) {
        return false;
    }
    else if (filePath.startsWith('/storage/')) {
        // --- TODO ---
        return false;
    }
    else if (filePath.startsWith('/mounted/')) {
        // --- TODO ---
        return false;
    }
    else if (filePath.startsWith('/package/')) {
        return false;
    }
    else if (filePath.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return false;
        }
        options.current = options.current.slice(0, -1);
        if (linkPath.startsWith('/current/')) {
            linkPath = options.current + linkPath.slice(8);
        }
        return symlink(options.current + filePath.slice(8), linkPath, options);
    }
    else {
        return false;
    }
}

/**
 * --- 删除一个文件 ---
 * @param path 要删除的文件路径
 */
export async function unlink(path: string, options: {
    'current'?: string;
} = {}): Promise<boolean> {
    path = tool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/')) {
        // --- TODO ---
        return false;
    }
    else if (path.startsWith('/mounted/')) {
        // --- TODO ---
        return false;
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return false;
        }
        options.current = options.current.slice(0, -1);
        return unlink(options.current + fpath, options);
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
            const res = await fetch(tool.urlResolve(__dirname, './').slice(0, -1) + path + '?' + Math.random().toString(), {
                'headers': {
                    'range': `bytes=0-1`
                }
            });
            const hdate = res.headers.get('date');
            const hmdate = res.headers.get('last-modified');
            const hlength = res.headers.get('content-length');
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
 * @param options 选项
 */
export async function stats(path: string, options: {
    'files'?: Record<string, Blob | string>;
    'current'?: string;
} = {}): Promise<types.IStats | null> {
    path = tool.urlResolve('/', path);
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
        // --- TODO ---
        return null;
    }
    else if (path.startsWith('/mounted/')) {
        // --- TODO ---
        return null;
    }
    else if (path.startsWith('/package/')) {
        if (!options.files) {
            return null;
        }
        if (options.files[fpath]) {
            // --- 文件 ---
            const file = options.files[fpath];
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
        for (const p in options.files) {
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
    else if (path.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return null;
        }
        options.current = options.current.slice(0, -1);
        return stats(options.current + fpath, options);
    }
    else {
        return null;
    }
}

/**
 * --- 判断是否是目录或目录是否存在，是的话返回 stats ---
 * @param path 判断路径
 * @param options 选项
 */
export async function isDir(path: string, options: {
    'files'?: Record<string, Blob | string>;
    'current'?: string;
} = {}): Promise<types.IStats | false> {
    const pstats = await stats(path, options);
    if (!pstats || !pstats.isDirectory()) {
        return false;
    }
    return pstats;
}

/**
 * --- 判断是否是文件或文件是否存在，是的话返回 stats ---
 * @param path 判断路径
 */
export async function isFile(path: string, options: {
    'files'?: Record<string, Blob | string>;
    'current'?: string;
} = {}): Promise<types.IStats | false> {
    const pstats = await stats(path, options);
    if (!pstats || !pstats.isFile()) {
        return false;
    }
    return pstats;
}

/**
 * --- 深度创建目录，如果最末目录存在，则自动创建成功 ---
 * @param path 要创建的路径，如 /a/b/c/
 * @param mode 权限
 */
export async function mkdir(path: string, mode: number = 0o755, options: {
    'current'?: string;
} = {}): Promise<boolean> {
    path = tool.urlResolve('/', path);
    if (await isDir(path, options)) {
        return true;
    }
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/')) {
        // --- TODO ---
        return false;
    }
    else if (path.startsWith('/mounted/')) {
        // --- TODO ---
        return false;
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return false;
        }
        options.current = options.current.slice(0, -1);
        return mkdir(options.current + fpath, mode, options);
    }
    else {
        return false;
    }
}

/**
 * --- 删除空目录 ---
 * @param path 要删除的目录
 */
export async function rmdir(path: string, options: {
    'current'?: string;
} = {}): Promise<boolean> {
    path = tool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/')) {
        // --- TODO ---
        return false;
    }
    else if (path.startsWith('/mounted/')) {
        // --- TODO ---
        return false;
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return false;
        }
        options.current = options.current.slice(0, -1);
        return rmdir(options.current + fpath, options);
    }
    else {
        return false;
    }
}

/**
 * --- 删除一个非空目录 ---
 * --- [ Danger ] [ 危险 ] ---
 */
export async function rmdirDeep(path: string, options: {
    'current'?: string;
} = {}): Promise<boolean> {
    path = tool.urlResolve('/', path);
    if (!path.endsWith('/')) {
        path += '/';
    }
    const list = await readDir(path, options);
    for (const item of list) {
        const stat = await stats(path + item.name, options);
        if (!stat) {
            return false;
        }
        if (stat.isDirectory()) {
            // --- 目录 ---
            const rtn = await rmdirDeep(path + item.name, options);
            if (!rtn) {
                return false;
            }
        }
        else {
            const rtn = await unlink(path + item.name, options);
            if (!rtn) {
                return false;
            }
        }
    }
    return rmdir(path, options);
}

/**
 * --- 修改权限
 * @param path 要修改的路径
 * @param mod 权限
 */
export async function chmod(path: string, mod: string | number, options: {
    'current'?: string;
} = {}): Promise<boolean> {
    path = tool.urlResolve('/', path);
    const fpath = path.slice(8);
    if (path.startsWith('/clickgo/')) {
        return false;
    }
    else if (path.startsWith('/storage/')) {
        // --- TODO ---
        return false;
    }
    else if (path.startsWith('/mounted/')) {
        // --- TODO ---
        return false;
    }
    else if (path.startsWith('/package/')) {
        return false;
    }
    else if (path.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return false;
        }
        options.current = options.current.slice(0, -1);
        return chmod(options.current + fpath, mod, options);
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
export async function rename(oldPath: string, newPath: string, options: {
    'current'?: string;
} = {}): Promise<boolean> {
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
    else if (oldPath.startsWith('/storage/')) {
        // --- TODO ---
        return false;
    }
    else if (oldPath.startsWith('/mounted/')) {
        // --- TODO ---
        return false;
    }
    else if (oldPath.startsWith('/package/')) {
        return false;
    }
    else if (oldPath.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return false;
        }
        options.current = options.current.slice(0, -1);
        return rename(options.current + ofpath, options.current + nfpath, options);
    }
    else {
        return false;
    }
}

/**
 * --- 获取文件夹下文件列表 ---
 * @param path 文件夹路径
 */
export async function readDir(path: string, options: {
    'encoding'?: BufferEncoding;
    'files'?: Record<string, Blob | string>;
    'current'?: string;
} = {}): Promise<types.IDirent[]> {
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
        if (options.files) {
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
        if (options.current) {
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
    else if (path.startsWith('/storage/')) {
        // --- TODO ---
        return [];
    }
    else if (path.startsWith('/mounted/')) {
        // --- TODO ---
        return [];
    }
    else if (path.startsWith('/package/')) {
        if (!options.files) {
            return [];
        }
        const list: types.IDirent[] = [];
        const dirs: string[] = [];
        for (const p in options.files) {
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
    else if (path.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return [];
        }
        options.current = options.current.slice(0, -1);
        return readDir(options.current + fpath, options);
    }
    else {
        return [];
    }
}

/**
 * --- 复制文件夹里的内容到另一个地方，失败不会回滚 ---
 * @param from 源，末尾加 /
 * @param to 目标，末尾加 /
 * @param options 选项
 */
export async function copyFolder(from: string, to: string, options: {
    'ignore'?: RegExp[];
    'current'?: string;
} = {}): Promise<number> {
    from = tool.urlResolve('/', from);
    to = tool.urlResolve('/', to);
    if (!from.startsWith(to.slice(0, 9))) {
        return 0;
    }
    const ffpath = from.slice(8);
    const tfpath = from.slice(8);
    if (from.startsWith('/clickgo/')) {
        return 0;
    }
    else if (from.startsWith('/storage/')) {
        // --- TODO ---
        return 0;
    }
    else if (from.startsWith('/mounted/')) {
        // --- TODO ---
        return 0;
    }
    else if (from.startsWith('/package/')) {
        return 0;
    }
    else if (from.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return 0;
        }
        options.current = options.current.slice(0, -1);
        return copyFolder(options.current + ffpath, options.current + tfpath, options);
    }
    else {
        return 0;
    }
}

/**
 * --- 复制文件 ---
 * @param src 源文件
 * @param dest 目标文件
 */
export async function copyFile(src: string, dest: string, options: {
    'current'?: string;
} = {}): Promise<boolean> {
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
    else if (src.startsWith('/storage/')) {
        // --- TODO ---
        return false;
    }
    else if (src.startsWith('/mounted/')) {
        // --- TODO ---
        return false;
    }
    else if (src.startsWith('/package/')) {
        return false;
    }
    else if (src.startsWith('/current/')) {
        if (!options.current || !options.current.endsWith('/')) {
            return false;
        }
        options.current = options.current.slice(0, -1);
        return copyFile(options.current + sfpath, options.current + dfpath, options);
    }
    else {
        return false;
    }
}
