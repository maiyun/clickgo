interface ICGZipLib {
    get: (data?: TCGZipInputFileFormat) => Promise<ICGZip | null>;
}

interface ICGZip {
    getContent(path: string): Promise<string | null>;
    getContent<T extends TCGZipOutputType>(path: string, type: T): Promise<ICGZipOutputByType[T] | null>;
    unlink(path: string): void;
    readDir(path?: string, opt?: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey'?: false; }): ICGZipItem[];
    readDir(path?: string, opt?: { 'hasChildren'?: boolean; 'hasDir'?: boolean; 'pathAsKey': true; }): Record<string, ICGZipItem>;
    pwd(): string;
    cd(dir: string): string;
    generate<T extends TCGZipOutputType>(options?: { 'type'?: T; 'level'?: number; 'onUpdate'?: (percent: number, currentFile: string) => void; }): Promise<ICGZipOutputByType[T]>;
}

interface ICGZipItem {
    'name': string;
    'date': Date;
    'isFile': boolean;
    'isDirectory': boolean;
    'path': string;
}

interface ICGZipOutputByType {
    'base64': string;
    'string': string;
    'array': number[];
    'uint8array': Uint8Array;
    'arraybuffer': ArrayBuffer;
    'blob': Blob;
}

type TCGZipOutputType = keyof ICGZipOutputByType;

interface ICGZipInputByType {
    'base64': string;
    'string': string;
    'array': number[];
    'uint8array': Uint8Array;
    'arraybuffer': ArrayBuffer;
    'blob': Blob;
}

type TCGZipInputType = keyof ICGZipInputByType;

type TCGZipInputFileFormat = ICGZipInputByType[keyof ICGZipInputByType];
