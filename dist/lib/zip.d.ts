declare class Zip implements ICGZip {
    private _zip;
    private _path;
    constructor(zip: JSZip);
    getContent(path: string): Promise<string | null>;
    getContent<T extends TCGZipOutputType>(path: string, type: T): Promise<ICGZipOutputByType[T] | null>;
    putContent<T extends TCGZipInputType>(path: string, data: ICGZipInputByType[T], options?: {
        'base64'?: boolean;
        'binary'?: boolean;
        'date'?: Date;
    }): void;
    unlink(path: string): void;
    readDir(path?: string, opt?: {
        'hasChildren'?: boolean;
        'hasDir'?: boolean;
        'pathAsKey'?: false;
    }): ICGZipItem[];
    readDir(path?: string, opt?: {
        'hasChildren'?: boolean;
        'hasDir'?: boolean;
        'pathAsKey': true;
    }): Record<string, ICGZipItem>;
    private _readDir;
    private _list;
    private _refreshList;
    pwd(): string;
    cd(dir: string): string;
    generate<T extends TCGZipOutputType>(options?: {
        'type'?: T;
        'level'?: number;
        'onUpdate'?: (percent: number, currentFile: string) => void;
    }): Promise<ICGZipOutputByType[T]>;
}
export declare function getZip(data?: TCGZipInputFileFormat): Promise<Zip | null>;
export {};
