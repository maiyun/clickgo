import * as fs from 'fs';
import * as tool from './tool';

/** --- 当前系统平台 --- */
const platform: NodeJS.Platform = process.platform;

/** --- path 要额外处理一下，因为 windows 下可能有点不一样 --- */
function formatPath(path: string): string {
    if (platform !== 'win32') {
        return path;
    }
    if (path === '/') {
        return path;
    }
    return path[1] + ':' + path.slice(2);
}

/** --- windows 下驱动器列表 --- */
const drives: string[] = [];

/** --- 更新 drives 列表 --- */
export async function refreshDrives(): Promise<void> {
    if (platform !== 'win32') {
        return;
    }
    drives.length = 0;
    for (let i = 0; i < 26; ++i) {
        const char = String.fromCharCode(97 + i);
        try {
            await fs.promises.stat(char + ':/');
            drives.push(char);
        }
        catch {
            // --- 无所谓 ---
        }
    }
}

export async function getContent(
    path: string,
    options: {
        'encoding'?: BufferEncoding;
        'start'?: number;
        'end'?: number;
    }
): Promise<string | Buffer | null> {
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
            rs.on('data', function(chunk) {
                if (!(chunk instanceof Buffer)) {
                    return;
                }
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

export async function putContent(path: string, data: string | Buffer, options: {
    'encoding'?: BufferEncoding;
    'mode'?: number;
    'flag'?: string;
}): Promise<boolean> {
    path = formatPath(path);
    try {
        await fs.promises.writeFile(path, data, options);
        return true;
    }
    catch {
        return false;
    }
}

export async function readLink(path: string, encoding?: BufferEncoding): Promise<string | null> {
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

export async function symlink(filePath: string, linkPath: string, type?: 'dir' | 'file' | 'junction'): Promise<boolean> {
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

export async function unlink(path: string): Promise<boolean> {
    path = formatPath(path);
    for (let i = 0; i <= 2; ++i) {
        try {
            await fs.promises.unlink(path);
            return true;
        }
        catch {
            await tool.sleep(250);
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

export async function stats(path: string): Promise<Record<string, any> | null> {
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

export async function mkdir(path: string, mode: number): Promise<boolean> {
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

export async function rmdir(path: string): Promise<boolean> {
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

export async function chmod(path: string, mod: string | number): Promise<boolean> {
    path = formatPath(path);
    try {
        await fs.promises.chmod(path, mod);
        return true;
    }
    catch {
        return false;
    }
}

export async function rename(oldPath: string, newPath: string): Promise<boolean> {
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

export async function readDir(path: string, encoding?: BufferEncoding): Promise<any[]> {
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
                path = path[1] + ':' + path.slice(2);
            }
        }
        const dlist = await fs.promises.readdir(path, {
            'encoding': encoding,
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

export async function copyFile(src: string, dest: string): Promise<boolean> {
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
