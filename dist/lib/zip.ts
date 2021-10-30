class Zip implements ICGZip {

    /** --- zip 对象 --- */
    private _zip!: JSZip;

    /** --- 当前路径，以 / 开头以 / 结尾 --- */
    private _path: string = '/';

    public constructor(zip: JSZip) {
        this._zip = zip;
        this._refreshList();
    }

    public async getContent(path: string): Promise<string | null>;
    public async getContent<T extends TCGZipOutputType>(path: string, type: T): Promise<ICGZipOutputByType[T] | null>;
    /**
     * --- 读取完整文件 ---
     * @param path 文件路径
     * @param encoding 编码或选项
     */
    public async getContent<T extends TCGZipOutputType>(path: string, type: T = 'string' as T): Promise<ICGZipOutputByType[T] | string | null> {
        path = clickgo.tool.urlResolve(this._path, path);
        let f = this._zip.file(path.slice(1));
        if (!f) {
            return null;
        }
        if (type === 'string') {
            return await f.async('string');
        }
        else {
            return await f.async(type);
        }
    }

    /**
     * --- 写入文件内容 ---
     * @param path 文件路径
     * @param data 要写入的内容
     * @param options 选项
     */
    public putContent<T extends TCGZipInputType>(path: string, data: ICGZipInputByType[T], options: { 'base64'?: boolean; 'binary'?: boolean; 'date'?: Date; } = {}): void {
        path = clickgo.tool.urlResolve(this._path, path);
        this._zip.file(path.slice(1), data as InputByType[T], {
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
        path = clickgo.tool.urlResolve(this._path, path);
        this._zip.remove(path.slice(1));
        this._refreshList();
    }

    public readDir(path?: string, opt?: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey'?: false; }): ICGZipItem[];
    public readDir(path?: string, opt?: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey': true; }): Record<string, ICGZipItem>;
    /**
     * --- 获取文件夹下文件列表 ---
     * @param path 文件夹路径
     * @param opt 选项
     */
    public readDir(path?: string, opt: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey'?: boolean; } = {}): Record<string, ICGZipItem> | ICGZipItem[] {
        if (opt.hasChildren === undefined) {
            opt.hasChildren = false;
        }
        if (opt.hasDir === undefined) {
            opt.hasDir = true;
        }
        if (opt.pathAsKey === undefined) {
            opt.pathAsKey = false;
        }

        if (!path) {
            path = this._path;
        }
        else {
            path = clickgo.tool.urlResolve(this._path, path);
        }
        if (!path.endsWith('/')) {
            path += '/';
        }
        let folder = this._zip.folder(path.slice(1));
        if (!folder) {
            return [];
        }
        if (!this._list[path]) {
            return [];
        }
        if (!opt.hasChildren) {
            return this._list[path];
        }
        // --- 定义 list ---
        if (opt.pathAsKey) {
            let list: Record<string, ICGZipItem> = {};
            // --- 遍历子项 ---
            for (let item of this._list[path]) {
                if (item.isFile || opt.hasDir) {
                    list[item.path + item.name] = item;
                }
                if (item.isDirectory) {
                    Object.assign(list, this._readDir(item, {
                        'hasChildren': opt.hasChildren,
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
        else {
            let list: ICGZipItem[] = [];
            // --- 遍历子项 ---
            for (let item of this._list[path]) {
                if (item.isFile || opt.hasDir) {
                    list.push(item);
                }
                if (item.isDirectory) {
                    list = list.concat(this._readDir(item, {
                        'hasChildren': opt.hasChildren,
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
    }

    private _readDir(item: ICGZipItem, opt: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey'?: false; }): ICGZipItem[];
    private _readDir(item: ICGZipItem, opt: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey': true; }): Record<string, ICGZipItem>;
    /**
     * --- 根据 item 文件夹读取子层及所有子层项 ---
     * @param item 文件夹
     */
    private _readDir(item: ICGZipItem, opt: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey'?: boolean; }): Record<string, ICGZipItem> | ICGZipItem[] {
        if (opt.pathAsKey) {
            let list: Record<string, ICGZipItem> = {};
            if (!this._list[item.path + item.name + '/']) {
                return {};
            }
            for (let it of this._list[item.path + item.name + '/']) {
                if (it.isFile || opt.hasDir) {
                    list[it.path + it.name] = it;
                }
                if (it.isDirectory) {
                    Object.assign(list, this._readDir(it, {
                        'hasChildren': opt.hasChildren,
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
        else {
            let list: ICGZipItem[] = [];
            if (!this._list[item.path + item.name + '/']) {
                return [];
            }
            for (let it of this._list[item.path + item.name + '/']) {
                if (it.isFile || opt.hasDir) {
                    list.push(it);
                }
                if (it.isDirectory) {
                    list = list.concat(this._readDir(it, {
                        'hasChildren': opt.hasChildren,
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
    }

    /** --- 目录列表缓存 --- */
    private _list: Record<string, ICGZipItem[]> = {};
    /**
     * --- 重建目录列表缓存 ---
     */
    private _refreshList(): void {
        let list: Record<string, ICGZipItem[]> = {};
        this._zip.forEach(function(relativePath, item) {
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
                list[parentPath] = [];
            }
            list[parentPath].push({
                'name': name,
                'date': item.date,
                'isFile': !item.dir,
                'isDirectory': item.dir,
                'path': parentPath
            });
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
        this._path = clickgo.tool.urlResolve(this._path, dir);
        if (!this._path.endsWith('/')) {
            this._path += '/';
        }
        return this._path;
    }

    /**
     * --- 打包 zip ---
     * @param options 选项
     */
    public async generate<T extends TCGZipOutputType>(options: { 'type'?: T; 'level'?: number; 'onUpdate'?: (percent: number, currentFile: string) => void; } = {}): Promise<ICGZipOutputByType[T]> {
        let opt: JSZip.JSZipGeneratorOptions<T> = {};
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
        return await this._zip.generateAsync(opt, function(meta: Metadata): void {
            options.onUpdate?.(meta.percent, meta.currentFile);
        });
    }

    /**
     * --- 获取 path 和 string/Blob 对应的文件列表 ---
     */
    public getList(): Promise<Record<string, Blob | string>> {
        return new Promise((resolve) => {
            let files: Record<string, Blob | string> = {};
            let list = this.readDir('/', {
                'hasChildren': true,
                'hasDir': false
            });
            let loaded = 0;
            for (let file of list) {
                let mime = clickgo.tool.getMimeByPath(file.name);
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
export async function get(data?: TCGZipInputFileFormat): Promise<Zip | null> {
    let z = JSZip();
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
