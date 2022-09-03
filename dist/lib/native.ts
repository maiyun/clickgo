/**
 * Copyright 2022 Han Guoshuai <zohegs@gmail.com>

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
import * as clickgo from '../clickgo';

const token = (Math.random() * 100000000000000 * (100 + Math.round(Math.random() * (999 - 100)))).toString(32);
/**
 * --- 获取 native 通讯 token，app 模式下无效 ---
 */
export function getToken(): string {
    return token;
}

/**
 * --- 向 native 发送指令 ---
 * @param name 指令名
 * @param param 参数
 */
export function invoke(name: string, ...param: any[]): any {
    if (!clickgo.getNative()) {
        return;
    }
    return (window as any).clickgoNative.invoke(name, ...param);
}

// --- 常见操作 ---

export function max(): void {
    invoke('cg-set-state', token, 'max');
}
export function min(): void {
    invoke('cg-set-state', token, 'min');
}
export function restore(): void {
    invoke('cg-set-state', token, 'restore');
}
export function size(width: number, height: number): void {
    invoke('cg-set-size', token, width, height);
}
