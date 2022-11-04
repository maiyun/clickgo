declare module 'clickgo' {
    export * as control from '~/dist/lib/control';
    export * as core from '~/dist/lib/core';
    export * as dom from '~/dist/lib/dom';
    export * as form from '~/dist/lib/form';
    export * as fs from '~/dist/lib/fs';
    export * as native from '~/dist/lib/native';
    export * as task from '~/dist/lib/task';
    export * as theme from '~/dist/lib/theme';
    export * as tool from '~/dist/lib/tool';
    export * as zip from '~/dist/lib/zip';

    export function getVersion(): string;
    export function isNative(): boolean;
    export function getPlatform(): NodeJS.Platform | 'web';
    export function isImmersion(): boolean;
    export function hasFrame(): boolean;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export const AbstractBoot: typeof import('../dist/index').AbstractBoot;
    export function launcher(boot: import('../dist/index').AbstractBoot): void;
}
