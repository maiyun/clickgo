interface IConfig {
    "after"?: string;
    "paths"?: IPaths;
}
interface IPaths {
    [key: string]: string;
}
interface IModule {
    "first": boolean;
    "func": string;
    "object": any;
}
declare namespace loader {
    export function ready(callback: () => void): void;
    export function config(config: IConfig): void;
    export function setAfter(after: string): void;
    export function setPaths(paths: IPaths): void;
    export function addPath(name: string, path: string): void;
    export function getLoadedPaths(): string[];
    export function require(paths: string | string[], callback?: (...input: any[]) => void, error?: (path: string) => void): Promise<any[] | null>;
    export function requireMemory(paths: string | string[], files: Record<string, Blob | string>, config?: {
        "after"?: string;
        "paths"?: IPaths;
    }): Promise<any[] | null>;
    export function fetchGet(url: string, init?: RequestInit): Promise<string | null>;
    export function loadScript(el: HTMLElement, path: string): Promise<boolean>;
}

