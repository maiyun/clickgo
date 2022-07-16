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

/** --- 最后一个 send ID --- */
let sendId = 0;
// --- sendList 一定会被清理 ---
let sendList: Array<{
    'id': number;
    'name': string;
    'param': string | undefined;
}> = [];

/** --- 监听的 listener，需要调用者手动清理（或者 task 结束后自动会被清理，未设置 taskId 的则不会自动清理） --- */
const listeners: Record<string, Array<{
    'id': number;
    'once': boolean;
    'taskId'?: number;
    'handler': (param?: string) => void | Promise<void>;
}>> = {};

/**
 * --- 获取已经创建的监听列表 ---
 */
export function getListeners(): Array<{ 'id': number; 'name': string; 'once': boolean; 'taskId'?: number; }> {
    const list = [];
    for (const name in listeners) {
        for (const item of listeners[name]) {
            list.push({
                'id': item.id,
                'name': name,
                'once': item.once,
                'taskId': item.taskId
            });
        }
    }
    return list;
}

/**
 * --- 向 native 发送指令 ---
 * @param name 指令名
 * @param param 参数
 * @param handler 回调
 * @param taskId 仅在任务活跃时可监听，App 模式下无效
 */
export function send(
    name: string,
    param?: string,
    handler?: (param?: string) => void | Promise<void>,
    taskId?: number
): number {
    if (!clickgo.getNative()) {
        return 0;
    }
    const id = ++sendId;
    sendList.push({
        'id': id,
        'name': name,
        'param': param
    });
    if (handler) {
        on(name, handler, id, true, taskId);
    }
    return id;
}

/**
 * --- 监听 native 传递的指令 ---
 * @param name 指令名
 * @param handler 指令接收回调
 * @param id 可选，监听特定 id 的指令
 * @param once 可选，默认为非一次性监听
 * @param taskId 仅在任务活跃时可监听，App 模式下无效
 */
export function on(
    name: string,
    handler: (param?: string) => void | Promise<void>,
    id?: number,
    once: boolean = false,
    taskId?: number
): void {
    if (!clickgo.getNative()) {
        return;
    }
    if (!listeners[name]) {
        listeners[name] = [];
    }
    listeners[name].push({
        'id': id ?? 0,
        'once': once,
        'taskId': taskId,
        'handler': handler
    });
}

/**
 * --- 监听一次 native 传递的指令 ---
 * @param name 指令名
 * @param handler 指令接收回调
 * @param id 可选，监听特定 id 的指令
 * @param taskId 仅在任务活跃时可监听，App 模式下无效
 */
export function once(
    name: string,
    handler: (param?: string) => void | Promise<void>,
    id?: number,
    taskId?: number
): void {
    on(name, handler, id, true, taskId);
}

/**
 * --- 取消监听 native 指令
 * @param name 指令名
 * @param handler 绑定监听时的回调函数
 * @param taskId 校验 taskId，为空则不校验，但 App 模式下无效
 */
export function off(name: string, handler: (param?: string) => void | Promise<void>, taskId?: number): void {
    if (!listeners[name]) {
        return;
    }
    for (let i = 0; i < listeners[name].length; ++i) {
        if (listeners[name][i].handler !== handler) {
            continue;
        }
        if (taskId && (listeners[name][i].taskId !== taskId)) {
            continue;
        }
        listeners[name].splice(i, 1);
        if (listeners[name].length === 0) {
            delete listeners[name];
            break;
        }
        --i;
    }
}

/**
 * --- 清除某个 task 当中的全部本地监听 ---
 * @param taskId 要清除的 task id，App 模式下无效
 */
export function clearListener(taskId?: number): void {
    if (!taskId) {
        return;
    }
    for (const name in listeners) {
        for (let i = 0; i < listeners[name].length; ++i) {
            if (listeners[name][i].taskId !== taskId) {
                continue;
            }
            listeners[name].splice(i, 1);
            if (listeners[name].length === 0) {
                delete listeners[name];
                break;
            }
        }
    }
}

// --- 以下为供 native 调用的内部函数 ---

// --- 将 send 值全部提交给 native ---
export function cgInnerGetSends(): string {
    const json = JSON.stringify(sendList);
    sendList = [];
    return json;
}

// --- 供 native 调用的回调数据（执行结果） ---
export function cgInnerReceive(id: number, name: string, result?: string): void {
    if (!listeners[name]) {
        return;
    }
    for (let i = 0; i < listeners[name].length; ++i) {
        const item = listeners[name][i];
        if (item.id > 0) {
            if (item.id !== id) {
                continue;
            }
            const r = item.handler(result);
            if (r instanceof Promise) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
        }
        else {
            const r = item.handler(result);
            if (r instanceof Promise) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
        }
        if (item.once) {
            listeners[name].splice(i, 1);
            --i;
        }
    }
}

(window as any).clickGoNative = {
    isReady: true,
    cgInnerGetSends: cgInnerGetSends,
    cgInnerReceive: cgInnerReceive
};
