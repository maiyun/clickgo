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
import * as lTool from './tool';
import * as lTask from './task';
/** --- 系统级 ID --- */
let sysId = '';
/**
 * --- 初始化系统级 ID，仅能设置一次 ---
 * @param id 系统级 ID
 */
export function initSysId(id) {
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
const methods = {};
// --- 供 native 调用的 web 上的对象 ---
window.clickgoNativeWeb = {
    invoke: function (name, ...param) {
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
export function on(current, name, handler, once = false, formId) {
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
export function once(current, name, handler, formId) {
    on(current, name, handler, true, formId);
}
/**
 * --- 解绑监听的方法 ---
 * @param current 当前任务 ID
 * @param name 方法名
 * @param formId 要清除的窗体的 ID
 */
export function off(current, name, formId) {
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
export function clear(taskId, formId) {
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
export function getListenerList(taskId) {
    if (taskId !== undefined && typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const rtn = {};
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
export async function invoke(name, ...param) {
    if (!clickgo.isNative()) {
        return null;
    }
    return window.clickgoNative.invoke(name, ...param);
}
/**
 * --- 向 native 发送指令（系统级） ---
 * @param current 仅支持 sysId
 * @param name 指令名
 * @param param 参数
 */
export async function invokeSys(current, name, ...param) {
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
export async function quit(current) {
    if (!(await lTask.checkPermission(current, 'root'))[0]) {
        return false;
    }
    await invoke('cg-quit', token);
    return true;
}
export async function size(current, width, height) {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-set-size', token, width, height);
    return true;
}
export async function max(current) {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-set-state', token, 'max');
    return true;
}
export async function min(current) {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-set-state', token, 'min');
    return true;
}
/** --- 从最大化还原 --- */
export async function unmaximize(current) {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-set-state', token, 'unmaximize');
    return true;
}
/** --- 从最小化还原 --- */
export async function restore(current) {
    if (!(await lTask.checkPermission(current, 'native.form'))[0]) {
        return false;
    }
    await invoke('cg-set-state', token, 'restore');
    return true;
}
export async function activate(current) {
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
export async function close(current) {
    if (!(await lTask.checkPermission(current, 'root'))[0]) {
        return false;
    }
    await invoke('cg-close', token);
    return true;
}
export async function maximizable(current, val) {
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
export function open(options = {}) {
    return invoke('cg-form-open', token, options);
}
/**
 * --- 弹出文件保存框 ---
 * @param options 选项
 * @returns 选择的保存路径，不含 /storage/
 */
export function save(options = {}) {
    return invoke('cg-form-save', token, options);
}
/**
 * --- 弹出消息框 ---
 * @param options 选项
 * @returns 点击的按钮索引
 */
export function dialog(options = {}) {
    return invoke('cg-form-dialog', token, options);
}
// --- 以下无需 token ---
/**
 * --- 测试与 native 的连通性 ---
 * @param val 测试字符串
 * @returns 测试字符串
 */
export async function ping(val) {
    return invoke('cg-ping', val);
}
/**
 * --- 判断窗体是否是最大化状态 ---
 */
export async function isMax() {
    return invoke('cg-is-max');
}
// --- 需要初始化 ---
let inited = false;
export function init() {
    if (inited) {
        return;
    }
    inited = true;
    invoke('cg-init', token);
}
