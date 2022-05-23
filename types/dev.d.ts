declare module 'clickgo' {
    export const control: typeof import('../dist/lib/control');
    export const core: typeof import('../dist/lib/core');
    export const dom: typeof import('../dist/lib/Dom');
    export const form: typeof import('../dist/lib/Form');
    export const fs: typeof import('../dist/lib/fs');
    export const native: typeof import('../dist/lib/native');
    export const task: typeof import('../dist/lib/task');
    export const theme: typeof import('../dist/lib/theme');
    export const tool: typeof import('../dist/lib/tool');
    export const zip: typeof import('../dist/lib/zip');

    export function getVersion(): string;
    export function getNative(): boolean;
    export function setSafe(val: boolean): void;
    export function getSafe(): boolean;
    export function setCdn(val: string): void;
    export function getCdn(): string;
}

declare namespace Vue {
    export function createApp(opt: any): import('./index').IVueApp;
    export function ref<T extends number | string>(obj: T): { 'value': T; };
    export function reactive<T>(obj: T): T;
    export function watch(
        v: any,
        cb: (n: any, o: any) => void | Promise<void>,
        opt: Record<string, string | boolean>
    ): void;
}
