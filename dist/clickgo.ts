/**
 * Copyright 2022 Han Guoshuai <zohegs@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const version = '3.0.0';
export function getVersion(): string {
    return version;
}

const native = navigator.userAgent.includes('electron') ? true : false;
export function getNative(): boolean {
    return native;
}

let platform = 'web';
if (native) {
    const reg = / s(.+?)\//.exec(navigator.userAgent);
    if (reg) {
        platform = reg[1];
    }
}
export function getPlatform(): string {
    return platform;
}

let safe = true;
export function setSafe(val: boolean): void {
    safe = val;
}
export function getSafe(): boolean {
    return safe;
}

let cdn = '';
export function setCdn(val: string): void {
    cdn = val;
}
export function getCdn(): string {
    return cdn;
}

export const vue: import('../types/index').IVueObject = (window as any).Vue;

export * as control from './lib/control';
export * as core from './lib/core';
export * as dom from './lib/dom';
export * as form from './lib/form';
export * as fs from './lib/fs';
export * as native from './lib/native';
export * as task from './lib/task';
export * as theme from './lib/theme';
export * as tool from './lib/tool';
export * as zip from './lib/zip';
