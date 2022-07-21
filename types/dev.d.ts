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
    export function getPlatform(): NodeJS.Platform | 'web';
    export function setSafe(val: boolean): void;
    export function getSafe(): boolean;
}
