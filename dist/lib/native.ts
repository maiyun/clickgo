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

// ---------------------------
// --- 供 native 调用的部分 ---
// ---------------------------

/** --- 用户添加的监听 --- */
const methods: Record<string,
    Record<string, {
        'once': boolean;
        'handler': (...param: any[]) => any | Promise<any>;
    }>
> = {

};

// --- 供 native 调用的 web 上的对象 ---
(window as any).clickgoNativeWeb = {
    invoke: function(name: string, ...param: any[]) {
        for (const taskId in methods) {
            for (const n in methods[taskId]) {
                if (!n.startsWith(name + '-')) {
                    continue;
                }
                methods[taskId][n].handler(...param);
                if (methods[taskId][n].once) {
                    delete methods[taskId][n];
                    if (!Object.keys(methods[taskId]).length) {
                        delete methods[taskId];
                    }
                }
            }
        }
    }
};

/**
 * --- 监听 native 传输过来的事件 ---
 * @param name 事件名
 * @param handler 回调函数
 * @param once 是否只监听一次
 * @param formId 限定某个窗体
 * @param taskId 绑定到任务，App 模式下无效
 */
export function on(
    name: string,
    handler: (...param: any[]) => any | Promise<any>,
    once: boolean = false,
    formId?: number,
    taskId?: number
): void {
    if (!taskId) {
        return;
    }
    if (!methods[taskId]) {
        methods[taskId] = {};
    }
    methods[taskId][name + '-' + (formId ? formId.toString() : '0')] = {
        'once': once,
        'handler': handler
    };
}

/**
 * --- 监听 native 传输过来的事件（仅一次） ---
 */
export function once(
    name: string,
    handler: (...param: any[]) => any | Promise<any>,
    formId?: number,
    taskId?: number
): void {
    on(name, handler, true, formId, taskId);
}

/**
 * --- 解绑监听的方法 ---
 * @param name 方法名
 * @param formId 要清除的窗体的 ID
 * @param taskId 所属的任务 ID，App 模式下无效
 */
export function off(name: string, formId?: number, taskId?: number): void {
    if (!taskId) {
        return;
    }
    if (!methods[taskId]) {
        return;
    }
    const key = name + '-' + (formId ? formId.toString() : '0');
    if (!methods[taskId][key]) {
        return;
    }
    delete methods[taskId][key];
}

/**
 * --- 清除某个窗体或某个任务的所有事件监听 ---
 * @param formId 窗体 ID，留空为清除任务的所有事件
 * @param taskId 要清楚的任务 ID，App 模式下无效
 */
export function clear(formId?: number, taskId?: number): void {
    if (!taskId) {
        return;
    }
    if (!methods[taskId]) {
        return;
    }
    if (!formId) {
        delete methods[taskId];
        return;
    }
    for (const key in methods[taskId]) {
        if (!key.endsWith('-' + formId.toString())) {
            continue;
        }
        delete methods[taskId][key];
    }
}

/**
 * --- 获取监听 native 事件的监听统计信息列表 ---
 * @param taskId 为 0 或 undefined 则返回所有
 */
export function getListenerList(taskId?: number): Record<string, Record<string, Record<string, number>>> {
    const rtn: Record<string,
        Record<string, Record<string, number>>
    > = {};
    for (const tid in methods) {
        if (taskId) {
            if (tid !== taskId.toString()) {
                continue;
            }
        }
        rtn[tid] = {};
        for (const key in methods[tid]) {
            const lio = key.lastIndexOf('-');
            const name = key.slice(0, lio);
            const id = key.slice(lio + 1);
            if (!rtn[tid][id]) {
                rtn[tid][id] = {};
            }
            if (rtn[tid][id][name]) {
                ++rtn[tid][id][name];
            }
            else {
                rtn[tid][id][name] = 1;
            }
        }
    }
    return rtn;
}

// ---------------------------
// --- 向 native 发送的部分 ---
// ---------------------------

/**
 * --- 向 native 发送指令 ---
 * @param name 指令名
 * @param param 参数
 */
export async function invoke(name: string, ...param: any[]): Promise<any> {
    if (!clickgo.isNative()) {
        return;
    }
    return (window as any).clickgoNative.invoke(name, ...param) as Promise<any>;
}

invoke('cg-init', token) as any;

// --- 常见向 native 发送的操作 ---

export async function max(): Promise<void> {
    await invoke('cg-set-state', token, 'max');
}

export async function min(): Promise<void> {
    await invoke('cg-set-state', token, 'min');
}

export async function restore(): Promise<void> {
    await invoke('cg-set-state', token, 'restore');
}

export async function size(width: number, height: number): Promise<void> {
    await invoke('cg-set-size', token, width, height);
}

// --- 以下无需 token ---

export async function ping(val: string): Promise<string> {
    return invoke('cg-ping', val);
}

export async function isMax(): Promise<boolean> {
    return invoke('cg-is-max');
}
