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
const version = '3.2.12';
export function getVersion(): string {
    return version;
}

const native = navigator.userAgent.includes('electron') ? true : false;
export function isNative(): boolean {
    return native;
}

let platform: NodeJS.Platform | 'web' = 'web';
let immersion: boolean = false;
let frame: boolean = false;

if (native) {
    const reg = /electron\/(.+?) (.+?)\/(.+?) immersion\/([0-9]) frame\/([0-9])/.exec(navigator.userAgent);
    if (reg) {
        platform = reg[2] as any;
        immersion = reg[4] === '0' ? false : true;
        frame = reg[5] === '0' ? false : true;
    }
}
export function getPlatform(): NodeJS.Platform | 'web' {
    return platform;
}

/**
 * --- 获取当前 native 是否是沉浸式 ---
 */
export function isImmersion(): boolean {
    return immersion;
}

/**
 * --- 是否含有窗体外边框 ---
 */
export function hasFrame(): boolean {
    return frame;
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
