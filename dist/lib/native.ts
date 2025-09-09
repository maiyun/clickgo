/**
 * Copyright 2007-2025 MAIYUN.NET

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
import * as lCore from './core';
import * as lTool from './tool';
import * as lTask from './task';

/** --- 系统级 ID --- */
let sysId = '';

/**
 * --- 初始化系统级 ID，仅能设置一次 ---
 * @param id 系统级 ID
 */
export function initSysId(id: string): void {
    if (sysId) {
        return;
    }
    sysId = id;
}

/** --- native 通讯秘钥 --- */
const token = lTool.random(32, lTool.RANDOM_LUNS);

// ---------------------------
// --- 供 native 调用的部分 ---
// ---------------------------

/** --- 用户添加的监听 --- */
const methods: Record<string,
    Record<string, {
        'once': boolean;
        'handler': (...param: any[]) => any | Promise<any>;
    }>
> = {};

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
 * @param current 当前任务 ID
 * @param name 事件名
 * @param handler 回调函数
 * @param once 是否只监听一次
 * @param formId 限定某个窗体
 */
export function on(
    current: lCore.TCurrent,
    name: string,
    handler: (...param: any[]) => any | Promise<any>,
    once: boolean = false,
    formId?: string
): void {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (!lTask.getOrigin(current)) {
        return;
    }
    if (!methods[current]) {
        methods[current] = {};
    }
    methods[current][name + '-' + (formId ? formId.toString() : '')] = {
        'once': once,
        'handler': handler
    };
}

/**
 * --- 监听 native 传输过来的事件（仅一次） ---
 * @param current 当前任务 ID
 * @param name 事件名
 * @param handler 回调函数
 * @param formId 限定某个窗体
 */
export function once(
    current: lCore.TCurrent,
    name: string,
    handler: (...param: any[]) => any | Promise<any>,
    formId?: string
): void {
    on(current, name, handler, true, formId);
}

/**
 * --- 解绑监听的方法 ---
 * @param current 当前任务 ID
 * @param name 方法名
 * @param formId 要清除的窗体的 ID
 */
export function off(current: lCore.TCurrent, name: string, formId?: string): void {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (!methods[current]) {
        return;
    }
    const key = name + '-' + (formId ? formId.toString() : '');
    if (!methods[current][key]) {
        return;
    }
    delete methods[current][key];
}

/**
 * --- 清除某个窗体或某个任务的所有事件监听 ---
 * @param taskId 要清除的任务 ID
 * @param formId 窗体 ID，留空为清除任务的所有事件
 */
export function clear(taskId: lCore.TCurrent, formId?: string): void {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
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
 * @param taskId 为 undefined 则返回所有
 */
export function getListenerList(taskId?: lCore.TCurrent): Record<string, Record<string, Record<string, number>>> {
    if (taskId !== undefined && typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const rtn: Record<string,
        Record<string, Record<string, number>>
    > = {};
    for (const tid in methods) {
        if (taskId) {
            if (tid !== taskId) {
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

/**
 * --- 向 native 发送指令（系统级） ---
 * @param current 仅支持 sysId
 * @param name 指令名
 * @param param 参数
 */
export async function invokeSys(current: string, name: string, ...param: any[]): Promise<any> {
    if (current !== sysId) {
        return;
    }
    return invoke(name, token, ...param);
}

// --- 常见向 native 发送的操作 ---

/**
 * --- 直接让整个 native 进程退出 ---
 * @param current 当前任务 id
 */
export async function quit(current: lCore.TCurrent): Promise<boolean> {
    if (!(await lTask.checkPermission(current, 'root'))[0]) {
        return false;
    }
    await invoke('cg-quit', token);
    return true;
}

export async function size(current: lCore.TCurrent, width: number, height: number): Promise<boolean> {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-set-size', token, width, height);
    return true;
}

export async function max(current: lCore.TCurrent): Promise<boolean> {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-set-state', token, 'max');
    return true;
}

export async function min(current: lCore.TCurrent): Promise<boolean> {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-set-state', token, 'min');
    return true;
}

/** --- 从最大化还原 --- */
export async function unmaximize(current: lCore.TCurrent): Promise<boolean> {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-set-state', token, 'unmaximize');
    return true;
}

/** --- 从最小化还原 --- */
export async function restore(current: lCore.TCurrent): Promise<boolean> {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-set-state', token, 'restore');
    return true;
}

export async function activate(current: lCore.TCurrent): Promise<boolean> {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-activate', token);
    return true;
}

/**
 * --- 关闭当前 native 真实窗体，根据配置整个 native 任务可能结束也可能保留 node 不结束 ---
 * @param current 当前任务 id
 */
export async function close(current: lCore.TCurrent): Promise<boolean> {
    if (!(await lTask.checkPermission(current, 'root'))[0]) {
        return false;
    }
    await invoke('cg-close', token);
    return true;
}

export async function maximizable(current: lCore.TCurrent, val: boolean): Promise<boolean> {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-maximizable', token, val);
    return true;
}

// --- form ---

/**
 * --- 弹出文件选择框 ---
 * @param options 选项
 * @returns 选择的文件路径列表，不含 /storage/
 */
export function open(options: {
    /** --- 默认路径，不含 /storage/，如 /d/ --- */
    'path'?: string;
    /** --- 筛选的文件类型 --- */
    'filters'?: Array<{
        'name': string;
        /** --- 如 jpg --- */
        'accept': string[];
    }>;
    'props'?: {
        /** --- 允许选择文件，默认 true --- */
        'file'?: boolean;
        /** --- 允许选择文件夹，默认 false --- */
        'directory'?: boolean;
        /** --- 允许多选，默认 false --- */
        'multi'?: boolean;
    };
} = {}): Promise<string[] | null> {
    return invoke('cg-form-open', token, options);
}

/**
 * --- 弹出文件保存框 ---
 * @param options 选项
 * @returns 选择的保存路径，不含 /storage/
 */
export function save(options: {
    /** --- 默认路径，不含 /storage/，如 /d/ --- */
    'path'?: string;
    /** --- 筛选的文件类型 --- */
    'filters'?: Array<{
        'name': string;
        /** --- 如 jpg --- */
        'accept': string[];
    }>;
} = {}): Promise<string | null> {
    return invoke('cg-form-save', token, options);
}

/**
 * --- 弹出消息框 ---
 * @param options 选项
 * @returns 点击的按钮索引
 */
export function dialog(options: string | {
    'type'?: 'info' | 'error' | 'question' | 'warning';
    'title'?: string;
    'message'?: string;
    'detail'?: string;
    'buttons'?: string[];
} = {}): Promise<number> {
    return invoke('cg-form-dialog', token, options);
}

// --- 以下无需 token ---

/**
 * --- 测试与 native 的连通性 ---
 * @param val 测试字符串
 * @returns 测试字符串
 */
export async function ping(val: string): Promise<string> {
    return invoke('cg-ping', val);
}

/**
 * --- 判断窗体是否是最大化状态 ---
 */
export async function isMax(): Promise<boolean> {
    return invoke('cg-is-max');
}

// --- 需要初始化 ---

let inited = false;
export function init(): void {
    if (inited) {
        return;
    }
    inited = true;
    invoke('cg-init', token) as any;
}
