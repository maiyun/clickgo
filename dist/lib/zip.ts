import jszip from 'jszip';
import * as clickgo from '../clickgo';
import * as lTool from './tool';

export class Zip {

    /** --- zip 对象 --- */
    private readonly _zip!: jszip;

    /** --- 当前路径，以 / 开头以 / 结尾 --- */
    private _path: string = '/';

    public constructor(zip: jszip) {
        this._zip = zip;
        this._refreshList();
    }

    public async getContent(path: string): Promise<string | null>;
    public async getContent<T extends TZipOutputType>(
        path: string,
        type: T): Promise<IZipOutputByType[T] | null>;
    /**
     * --- 读取完整文件 ---
     * @param path 文件路径
     * @param type 返回类型
     */
    public async getContent<T extends TZipOutputType>(path: string, type: T = 'string' as T): Promise<IZipOutputByType[T] | string | null> {
        path = lTool.urlResolve(this._path, path);
        const f = this._zip.file(path.slice(1));
        if (!f) {
            return null;
        }
        if (type === 'string') {
            return f.async('string');
        }
        else {
            return f.async(type);
        }
    }

    /**
     * --- 写入文件内容 ---
     * @param path 文件路径
     * @param data 要写入的内容
     * @param options 选项
     */
    public putContent<T extends TZipInputType>(path: string, data: IZipInputByType[T], options: { 'base64'?: boolean; 'binary'?: boolean; 'date'?: Date; } = {}): void {
        path = lTool.urlResolve(this._path, path);
        this._zip.file(path.slice(1), data as jszip.InputType, {
            'base64': options.base64,
            'binary': options.binary,
            'date': options.date
        });
        this._refreshList();
    }

    /**
     * --- 删除一个文件/文件夹（深度删除） ---
     * @param path 要删除的文件路径
     */
    public unlink(path: string): void {
        path = lTool.urlResolve(this._path, path);
        this._zip.remove(path.slice(1));
        this._refreshList();
    }

    /**
     * --- 获取对象是否存在，存在则返回 stats 对象，否则返回 null ---
     * @param path 对象路径
     * @param options 选项
     */
    public stats(path: string): IZipStats | null {
        path = lTool.urlResolve(this._path, path);
        let dirpath = path.endsWith('/') ? path : path + '/';
        if (!this._list[dirpath]) {
            // --- 可能是文件 ---
            if (path.endsWith('/')) {
                // --- 不可能是文件 ---
                return null;
            }
            const lio = path.lastIndexOf('/') + 1;
            const dpath = path.slice(0, lio);
            const fname = path.slice(lio);
            if (!this._list[dpath]) {
                // --- 上层目录不存在 ---
                return null;
            }
            const file = this._list[dpath][fname];
            if (!file) {
                return null;
            }
            return {
                'compressedSize': file.compressedSize,
                'uncompressedSize': file.uncompressedSize,
                'date': file.date,
                'isFile': true,
                'isDirectory': false
            };
        }
        else {
            // --- 文件夹 ---
            if (dirpath === '/') {
                return {
                    'compressedSize': 0,
                    'uncompressedSize': 0,
                    'date': new Date(),
                    'isFile': false,
                    'isDirectory': true
                };
            }
            dirpath = dirpath.slice(0, -1);
            const lio = dirpath.lastIndexOf('/') + 1;
            const dpath = dirpath.slice(0, lio);
            const fname = dirpath.slice(lio);
            const pfolder = this._list[dpath];
            const folder = pfolder[fname];
            return {
                'compressedSize': 0,
                'uncompressedSize': 0,
                'date': folder.date,
                'isFile': false,
                'isDirectory': true
            };
        }
    }

    /**
     * --- 判断是否是目录或目录是否存在，是的话返回 stats ---
     * @param path 判断路径
     */
    public isDir(path: string): IZipStats | false {
        const pstats = this.stats(path);
        if (!pstats?.isDirectory) {
            return false;
        }
        return pstats;
    }

    /**
     * --- 判断是否是文件或文件是否存在，是的话返回 stats ---
     * @param path 判断路径
     */
    public isFile(path: string): IZipStats | false {
        const pstats = this.stats(path);
        if (!pstats?.isFile) {
            return false;
        }
        return pstats;
    }

    /** --- 读取目录，hasChildren: false, hasDir: true, pathAsKey: false --- */
    public readDir(path?: string, opt?: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey'?: false; }): IZipItem[];
    public readDir(path?: string, opt?: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey': true; }): Record<string, IZipItem>;
    /**
     * --- 获取文件夹下文件列表 ---
     * @param path 文件夹路径
     * @param opt 选项
     */
    public readDir(path?: string, opt: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey'?: boolean; } = {}): Record<string, IZipItem> | IZipItem[] {
        opt.hasChildren ??= false;
        opt.hasDir ??= true;
        opt.pathAsKey ??= false;

        if (!path) {
            path = this._path;
        }
        else {
            path = lTool.urlResolve(this._path, path);
        }
        if (!path.endsWith('/')) {
            path += '/';
        }
        const folder = this._zip.folder(path.slice(1));
        if (!folder) {
            return opt.pathAsKey ? {} : [];
        }
        if (!this._list[path]) {
            return opt.pathAsKey ? {} : [];
        }
        if (!opt.hasChildren) {
            if (opt.pathAsKey) {
                return this._list[path];
            }
            const list: IZipItem[] = [];
            for (const k in this._list[path]) {
                list.push(this._list[path][k]);
            }
            return list;
        }
        // --- 定义 list ---
        if (opt.pathAsKey) {
            const list: Record<string, IZipItem> = {};
            // --- 遍历子项 ---
            for (const k in this._list[path]) {
                const item = this._list[path][k];
                if (item.isFile || opt.hasDir) {
                    list[item.path + item.name] = item;
                }
                if (item.isDirectory) {
                    Object.assign(list, this._readDir(item, {
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
        else {
            let list: IZipItem[] = [];
            // --- 遍历子项 ---
            for (const k in this._list[path]) {
                const item = this._list[path][k];
                if (item.isFile || opt.hasDir) {
                    list.push(item);
                }
                if (item.isDirectory) {
                    list = list.concat(this._readDir(item, {
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
    }

    private _readDir(item: IZipItem, opt: { 'hasDir'?: boolean; 'pathAsKey'?: false; }): IZipItem[];
    private _readDir(item: IZipItem, opt: { 'hasDir'?: boolean; 'pathAsKey': true; }): Record<string, IZipItem>;
    /**
     * --- 根据 item 文件夹读取子层及所有子层项 ---
     * @param item 文件夹
     */
    private _readDir(item: IZipItem, opt: { 'hasDir'?: boolean; 'pathAsKey'?: boolean; }): Record<string, IZipItem> | IZipItem[] {
        if (opt.pathAsKey) {
            const list: Record<string, IZipItem> = {};
            if (!this._list[item.path + item.name + '/']) {
                return {};
            }
            for (const k in this._list[item.path + item.name + '/']) {
                const it = this._list[item.path + item.name + '/'][k];
                if (it.isFile || opt.hasDir) {
                    list[it.path + it.name] = it;
                }
                if (it.isDirectory) {
                    Object.assign(list, this._readDir(it, {
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
        else {
            let list: IZipItem[] = [];
            if (!this._list[item.path + item.name + '/']) {
                return [];
            }
            for (const k in this._list[item.path + item.name + '/']) {
                const it = this._list[item.path + item.name + '/'][k];
                if (it.isFile || opt.hasDir) {
                    list.push(it);
                }
                if (it.isDirectory) {
                    list = list.concat(this._readDir(it, {
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
    }

    /** --- 目录列表缓存 --- */
    private _list: Record<string, Record<string, IZipItem>> = {};

    /**
     * --- 重建目录列表缓存 ---
     */
    private _refreshList(): void {
        const list: Record<string, Record<string, IZipItem>> = {};
        // eslint-disable-next-line @litert/disable-for-each-method
        this._zip.forEach(function(relativePath: string, item: jszip.JSZipObject) {
            if (relativePath.startsWith('/')) {
                relativePath = relativePath.slice(1);
            }
            let parentPath = '/';
            let name = '';
            let s: number;
            if (item.dir) {
                s = relativePath.slice(0, -1).lastIndexOf('/');
            }
            else {
                s = relativePath.lastIndexOf('/');
            }
            if (s !== -1) {
                parentPath = '/' + relativePath.slice(0, s + 1);
                name = relativePath.slice(s + 1);
            }
            else {
                name = relativePath;
            }
            if (item.dir) {
                name = name.slice(0, -1);
            }
            if (!list[parentPath]) {
                list[parentPath] = {};
            }
            list[parentPath][name] = {
                'name': name,
                'compressedSize': (item as any)._data.compressedSize ?? 0,
                'uncompressedSize': (item as any)._data.uncompressedSize ?? 0,
                'date': item.date,
                'isFile': !item.dir,
                'isDirectory': item.dir,
                'path': parentPath
            };
        });
        this._list = list;
    }

    /**
     * --- 获取当前目录，末尾不带 / ---
     * @return string
     */
    public pwd(): string {
        return this._path.slice(0, -1);
    }

    /**
     * --- 进入一个目录（不存在也能进入，需要自行判断） ---
     * --- 返回进入后的路径值 ---
     * @param dir 相对路径或绝对路径
     */
    public cd(dir: string): string {
        this._path = lTool.urlResolve(this._path, dir);
        if (!this._path.endsWith('/')) {
            this._path += '/';
        }
        return this._path;
    }

    /**
     * --- 打包 zip ---
     * @param options 选项
     */
    public generate<T extends TZipOutputType>(options: { 'type'?: T; 'level'?: number; 'onUpdate'?: (percent: number, currentFile: string | null) => void; } = {}): Promise<IZipOutputByType[T]> {
        const opt: any = {};
        if (options.type === undefined) {
            opt.type = 'blob' as T;
        }
        else {
            opt.type = options.type;
        }
        if (options.level === undefined) {
            options.level = 9;
        }
        else if (options.level > 9) {
            options.level = 9;
        }
        if (options.level > 0) {
            opt.compression = 'DEFLATE';
        }
        return this._zip.generateAsync(opt, function(meta: IZipMetadata): void {
            options.onUpdate?.(meta.percent, meta.currentFile);
        });
    }

    /**
     * --- 获取 path 和 string/Blob 对应的文件列表 ---
     */
    public getList(): Promise<Record<string, Blob | string>> {
        return new Promise((resolve) => {
            const files: Record<string, Blob | string> = {};
            const list = this.readDir('/', {
                'hasChildren': true,
                'hasDir': false
            });
            let loaded = 0;
            for (const file of list) {
                const mime = lTool.getMimeByPath(file.name);
                if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                    this.getContent(file.path + file.name, 'string').then(function(fb) {
                        if (fb) {
                            files[file.path + file.name] = fb;
                        }
                        ++loaded;
                        if (loaded === list.length) {
                            resolve(files);
                        }
                    }).catch(function() {
                        ++loaded;
                        if (loaded === list.length) {
                            resolve(files);
                        }
                    });
                }
                else {
                    this.getContent(file.path + file.name, 'arraybuffer').then(function(fb) {
                        if (fb) {
                            files[file.path + file.name] = new Blob([fb], {
                                'type': mime.mime
                            });
                        }
                        ++loaded;
                        if (loaded === list.length) {
                            resolve(files);
                        }
                    }).catch(function() {
                        ++loaded;
                        if (loaded === list.length) {
                            resolve(files);
                        }
                    });
                }
            }
            return files;
        });
    }

}

/**
 * --- 获取 zip 对象 ---
 * @param data 对象数据
 */
export async function get(data?: TZipInputFileFormat): Promise<Zip | null> {
    const z = clickgo.modules.jszip();
    try {
        if (data) {
            await z.loadAsync(data);
        }
        return new Zip(z);
    }
    catch {
        return null;
    }
}

// --- 类型 ---

export interface IZipItem {
    'name': string;
    'compressedSize': number;
    'uncompressedSize': number;
    'date': Date;
    'isFile': boolean;
    'isDirectory': boolean;
    'path': string;
}

export interface IZipStats {
    'compressedSize': number;
    'uncompressedSize': number;
    'date': Date;
    'isFile': boolean;
    'isDirectory': boolean;
}

export interface IZipOutputByType {
    'base64': string;
    'string': string;
    'array': number[];
    'uint8array': Uint8Array;
    'arraybuffer': ArrayBuffer;
    'blob': Blob;
}

export type TZipOutputType = keyof IZipOutputByType;

export interface IZipInputByType {
    'base64': string;
    'string': string;
    'array': number[];
    'uint8array': Uint8Array;
    'arraybuffer': ArrayBuffer;
    'blob': Blob;
}

export type TZipInputType = keyof IZipInputByType;

export type TZipInputFileFormat = IZipInputByType[keyof IZipInputByType];

export interface IZipMetadata {
    percent: number;
    currentFile: string | null;
}
