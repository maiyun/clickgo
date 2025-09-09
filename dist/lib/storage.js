/**
 * Copyright 2007-2025 MAIYUN.NET
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
import * as lTask from './task';
import * as lForm from './form';
import * as lCore from './core';
import * as lTool from './tool';
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
/** --- storage lib 用到的语言包 --- */
const localeData = {
    'en': {
        'sure-clear': 'Are you sure you want to clear all temporary storage for the app "?"?'
    },
    'sc': {
        'sure-clear': '确定清除应用“?”的所有临时存储吗？'
    },
    'tc': {
        'sure-clear': '確定清除應用程式「?」的所有臨時儲存嗎？'
    },
    'ja': {
        'sure-clear': 'アプリ「？」の一時的な保存データをすべて削除しますか？'
    },
    'ko': {
        'sure-clear': '"?" 앱의 모든 임시 저장소를 지우시겠습니까?'
    },
    'th': {
        'sure-clear': 'คุณแน่ใจหรือไม่ที่ต้องการล้างพื้นที่จัดเก็บชั่วคราวของแอป "?" ทั้งหมดหรือไม่?'
    },
    'es': {
        'sure-clear': '¿Estás seguro de que quieres borrar todo el almacenamiento temporal de la aplicación "?"?'
    },
    'de': {
        'sure-clear': 'Möchten Sie wirklich alle temporären Speicher für die App "?" löschen?'
    },
    'fr': {
        'sure-clear': 'Êtes-vous sûr de vouloir effacer tous les stockages temporaires de l\'application "?" ?'
    },
    'pt': {
        'sure-clear': 'Tem a certeza de que pretende limpar todo o armazenamento temporário da aplicação "?"?'
    },
    'ru': {
        'sure-clear': 'Вы уверены, что хотите очистить все временные хранилища для приложения "?"?'
    },
    'vi': {
        'sure-clear': 'Bạn có chắc chắn muốn xóa tất cả lưu trữ tạm thời cho ứng dụng "?" không?'
    }
};
const textEncoder = new TextEncoder();
/**
 * --- 获取小型存储数据 ---
 * @param current 当前任务 id
 * @param key 存储键
 */
export function get(current, key) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const task = lTask.getOrigin(current);
    if (!task) {
        return null;
    }
    const v = localStorage.getItem('clickgo-item-' + task.path + '-' + key);
    if (v === null) {
        return null;
    }
    try {
        return JSON.parse(v);
    }
    catch {
        return null;
    }
}
/**
 * --- 存储小型存储数据，单应用最大存储 1M ---
 * @param current 当前任务 id
 * @param key 存储键
 * @param val 存储值
 */
export function set(current, key, val) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const task = lTask.getOrigin(current);
    if (!task) {
        return false;
    }
    if (val === undefined) {
        return false;
    }
    const v = JSON.stringify(val);
    const vsize = textEncoder.encode(v).length;
    /** --- 当前 app 的 key 所占用的 size 列表 --- */
    const sizes = localStorage.getItem('clickgo-size-' + task.path);
    if (sizes === null) {
        if (vsize > 1048576) {
            return false;
        }
        localStorage.setItem('clickgo-size-' + task.path, JSON.stringify({
            [key]: vsize
        }));
    }
    else {
        const sizeso = JSON.parse(sizes);
        sizeso[key] = vsize;
        const allsize = Object.values(sizeso).reduce((a, c) => { return a + c; }, 0);
        if (allsize > 1048576) {
            return false;
        }
        localStorage.setItem('clickgo-size-' + task.path, JSON.stringify(sizeso));
    }
    localStorage.setItem('clickgo-item-' + task.path + '-' + key, v);
    return true;
}
/**
 * --- 移除某个小型存储数据 ---
 * @param current 当前 task id
 * @param key 要移除的键
 */
export function remove(current, key) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const task = lTask.getOrigin(current);
    if (!task) {
        return false;
    }
    const sizes = localStorage.getItem('clickgo-size-' + task.path);
    if (sizes === null) {
        return true;
    }
    const sizeso = JSON.parse(sizes);
    if (sizeso[key] === undefined) {
        return true;
    }
    delete sizeso[key];
    if (Object.keys(sizeso).length) {
        localStorage.setItem('clickgo-size-' + task.path, JSON.stringify(sizeso));
    }
    else {
        localStorage.removeItem('clickgo-size-' + task.path);
    }
    localStorage.removeItem('clickgo-item-' + task.path + '-' + key);
    return true;
}
/**
 * --- 获取当前任务的所有存储列表，key: size ---
 * @param current 当前任务 id
 */
export function list(current) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const task = lTask.getOrigin(current);
    if (!task) {
        return {};
    }
    const sizes = localStorage.getItem('clickgo-size-' + task.path);
    if (sizes === null) {
        return {};
    }
    return JSON.parse(sizes);
}
/**
 * --- 获取所有存储在本地的应用列表，以 path: size 返回 ---
 */
export function all() {
    const rtn = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith('clickgo-size-')) {
            continue;
        }
        const sizes = localStorage.getItem(key);
        if (!sizes) {
            continue;
        }
        const sizeso = JSON.parse(sizes);
        const allsize = Object.values(sizeso).reduce((a, c) => { return a + c; }, 0);
        rtn[key.slice(13)] = allsize;
    }
    return rtn;
}
/**
 * --- 移除某个应用的所有临时存储 ---
 * @param path 要移除的应用的 path（末尾 .cga 或带 / 的路径）
 */
export async function clear(path) {
    if (!path) {
        return 0;
    }
    const loc = localeData[lCore.config.locale]?.['sure-clear'] ?? localeData['en']['sure-clear'];
    if (!await lForm.superConfirm(sysId, loc.replace('?', lTool.escapeHTML(path)))) {
        return 0;
    }
    let count = 0;
    localStorage.removeItem('clickgo-size-' + path);
    const pre = 'clickgo-item-' + path + '-';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(pre)) {
            continue;
        }
        localStorage.removeItem(key);
        ++count;
    }
    return count;
}
