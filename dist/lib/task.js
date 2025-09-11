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
import * as clickgo from '../clickgo';
import * as lCore from './core';
import * as lDom from './dom';
import * as lTool from './tool';
import * as lForm from './form';
import * as lControl from './control';
import * as lFs from './fs';
import * as lTheme from './theme';
import * as lNative from './native';
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
/**
 * --- 判断是否是系统级的 task id ---
 * @param id 任务 id
 */
function isSys(id) {
    return id === sysId;
}
/** --- 任务启动顺序 --- */
let index = -1;
/** --- 当前运行的程序 --- */
const list = {};
/** --- 任务的 runtime 数据，关闭任务后也需要清除 --- */
const runtime = {};
/**
 * --- 获取任务的 runtime 数据，仅系统可以获取 ---
 * @param current 当前任务 ID
 * @param taskId 任务 ID
 */
export function getRuntime(current, taskId) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (!isSys(current)) {
        return null;
    }
    return runtime[taskId];
}
/** --- 获取原始 list --- */
export async function getOriginList(current) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (isSys(current)) {
        return list;
    }
    if (!list[current]) {
        return {};
    }
    const p = await checkPermission(current, 'root');
    if (!p[0]) {
        return {};
    }
    return list;
}
/** --- get 的重试次数 --- */
const getRetry = {
    'hour': '',
    'count': 0,
};
/**
 * --- 获取任务简略信息 ---
 * @param tid 任务 id
 */
export function get(taskId) {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const task = getOrigin(taskId);
    if (!task) {
        return null;
    }
    return {
        'name': task.app.config.name,
        'locale': task.locale.lang,
        'customTheme': task.customTheme,
        'formCount': Object.keys(task.forms).length,
        'icon': task.app.icon,
        'path': task.path,
        'current': task.current,
    };
}
/**
 * --- 获取任务对象 ---
 * @param taskId 任务 ID
 */
export function getOrigin(taskId) {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    if (!list[taskId]) {
        const now = new Date();
        const hour = `${now.getUTCFullYear()}${now.getUTCMonth().toString().padStart(2, '0')}${now.getUTCDate().toString().padStart(2, '0')}${now.getUTCHours().toString().padStart(2, '0')}`;
        if (getRetry.hour !== hour) {
            getRetry.hour = hour;
            getRetry.count = 0;
        }
        else {
            ++getRetry.count;
            if (getRetry.count > 10) {
                // --- 警告 ---
                const err = new Error(`task.get retry, ${hour}: ${getRetry.count}`);
                lCore.trigger('error', '', '', err, err.message).catch(() => { });
            }
        }
        return null;
    }
    return list[taskId];
}
/** --- 当前有焦点的任务 ID --- */
let focusId = null;
/**
 * --- 设置 task focus id ---
 * @param id task id 或 null
 */
export function setFocus(id) {
    if (!id) {
        focusId = null;
        return true;
    }
    if (!list[id]) {
        return false;
    }
    focusId = id;
    return true;
}
/** --- 获取当前有焦点的任务 ID --- */
export async function getFocus(current) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (isSys(current)) {
        return focusId;
    }
    if (!list[current]) {
        return null;
    }
    const p = await checkPermission(current, 'root');
    if (!p[0]) {
        return null;
    }
    return focusId;
}
/** --- task lib 用到的语言包 --- */
const localeData = {
    'en': {
        'loading': 'Loading...',
    },
    'sc': {
        'loading': '加载中……'
    },
    'tc': {
        'loading': '載入中……'
    },
    'ja': {
        'loading': '読み込み中...'
    },
    'ko': {
        'loading': '로딩 중...'
    },
    'th': {
        'loading': 'กำลังโหลด...'
    },
    'es': {
        'loading': 'Cargando...'
    },
    'de': {
        'loading': 'Laden...'
    },
    'fr': {
        'loading': 'Chargement en cours...'
    },
    'pt': {
        'loading': 'Carregando...'
    },
    'ru': {
        'loading': 'Загрузка...'
    },
    'vi': {
        'loading': 'Đang tải...'
    }
};
// --- 创建 frame 监听 ---
let frameTimer = 0;
const frameMaps = {};
/**
 * --- 创建 frame 监听，formId 存在则为窗体范围，否则为任务级范围 ---
 * @param current 当前任务 ID
 * @param fun 监听回调
 * @param opt 选项,count:执行次数，默认无限次,formId:限定在当前任务的某个窗体
 */
export function onFrame(current, fun, opt = {}) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const formId = opt.formId;
    if (!current) {
        return 0;
    }
    const task = list[current];
    if (!task) {
        return 0;
    }
    if (formId && !task.forms[formId]) {
        return 0;
    }
    const ft = ++frameTimer;
    /** --- 执行几次，0 代表无限次 --- */
    const count = opt.count ?? 0;
    /** --- 当前已经执行的次数 --- */
    let c = 0;
    let timer;
    const timerHandler = async () => {
        ++c;
        if (formId && task.forms[formId] === undefined) {
            // --- form 已经没了 ---
            delete task.timers['1x' + ft.toString()];
            delete frameMaps[ft];
            return;
        }
        await fun();
        if (task.timers['1x' + ft.toString()] == undefined) {
            return;
        }
        if (count > 1) {
            if (c === count) {
                // --- 终止循环 ---
                delete task.timers['1x' + ft.toString()];
                delete frameMaps[ft];
                return;
            }
            else {
                // --- 接着循环 ---
                timer = requestAnimationFrame(function () {
                    timerHandler().catch(() => { });
                });
                frameMaps[ft] = timer;
            }
        }
        else if (count === 1) {
            // --- 不循环 ---
            delete task.timers['1x' + ft.toString()];
            delete frameMaps[ft];
        }
        else {
            // --- 无限循环 ---
            timer = requestAnimationFrame(function () {
                timerHandler().catch(() => { });
            });
            frameMaps[ft] = timer;
        }
    };
    /** --- timer 对象 number --- */
    timer = requestAnimationFrame(function () {
        timerHandler().catch(() => { });
    });
    frameMaps[ft] = timer;
    task.timers['1x' + ft.toString()] = formId ?? '';
    return ft;
}
/**
 * --- 移除 frame 监听 ---
 * @param current 当前任务 ID
 * @param ft 监听 ID
 */
export function offFrame(current, ft) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (!list[current]) {
        return;
    }
    const formId = list[current].timers['1x' + ft.toString()];
    if (formId === undefined) {
        return;
    }
    cancelAnimationFrame(frameMaps[ft]);
    delete list[current].timers['1x' + ft.toString()];
    delete frameMaps[ft];
}
/**
 * --- 获取某个任务的已授权权限列表 ---
 * @param current 当前任务 ID
 */
export function getPermissions(current) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (list[current] === undefined) {
        return [];
    }
    return lTool.clone(runtime[current].permissions);
}
/**
 * --- 获取 task list 的简略情况 ---
 */
export function getList() {
    const rtn = [];
    for (const tid in list) {
        const item = list[tid];
        rtn.push({
            'name': item.app.config.name,
            'locale': item.locale.lang,
            'customTheme': item.customTheme,
            'formCount': Object.keys(item.forms).length,
            'icon': item.app.icon,
            'path': item.path,
            'current': item.current
        });
    }
    return rtn;
}
/** --- initProgress 的 type --- */
export var EIPTYPE;
(function (EIPTYPE) {
    EIPTYPE[EIPTYPE["APP"] = 0] = "APP";
    EIPTYPE[EIPTYPE["LOCAL"] = 1] = "LOCAL";
    EIPTYPE[EIPTYPE["CONTROL"] = 2] = "CONTROL";
    EIPTYPE[EIPTYPE["THEME"] = 3] = "THEME";
    EIPTYPE[EIPTYPE["STYLE"] = 4] = "STYLE";
    EIPTYPE[EIPTYPE["PERMISSION"] = 5] = "PERMISSION";
    EIPTYPE[EIPTYPE["START"] = 6] = "START";
    EIPTYPE[EIPTYPE["DONE"] = 7] = "DONE";
})(EIPTYPE || (EIPTYPE = {}));
/**
 * --- 运行一个应用 ---
 * @param current 当前任务 ID
 * @param url app 路径（以 .cga 结尾的文件），或 APP 包对象
 * @param opt 选项
 * @returns 字符串代表成功，否则代表错误代号
 */
export async function run(current, url, opt = {}) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (!isSys(current) && !list[current]) {
        return 0;
    }
    /** --- 总步骤 --- */
    const initTotal = 7;
    let initMsg = 'Load app ...';
    await opt.initProgress?.(0, initTotal, EIPTYPE.APP, initMsg);
    /** --- 要显示的应用图标 --- */
    let icon = clickgo.getDirname() + '/icon.png';
    if (opt.icon) {
        icon = opt.icon;
    }
    // -- notify ---
    opt.notify ??= true;
    /** --- 弹出 notify 框 --- */
    const notifyId = opt.notify ? lForm.notify({
        'title': localeData[lCore.config.locale]?.loading ?? localeData['en'].loading,
        'content': typeof url === 'string' ? url : url.config.name,
        'note': initMsg,
        'icon': icon,
        'timeout': 0,
        'progress': true,
    }) : undefined;
    let app = null;
    if (typeof url === 'string') {
        // --- 检测 url 是否合法 ---
        if (!url.endsWith('.cga')) {
            if (notifyId) {
                lForm.notifyContent(notifyId, {
                    'note': 'Error -1',
                    'timeout': 3_000,
                });
            }
            return -1;
        }
        // --- 非 ntid 模式下 current 以 location 为准 ---
        if (!url.startsWith('/clickgo/') &&
            !url.startsWith('/storage/') &&
            !url.startsWith('/mounted/') &&
            !url.startsWith('/package/') &&
            !url.startsWith('/current/')) {
            url = lTool.urlResolve(location.href, url);
        }
        // --- 获取并加载 app 对象 ---
        app = await lCore.fetchApp(current, url, {
            'notify': notifyId ? {
                'id': notifyId,
                'loaded': 0,
                'total': initTotal,
            } : undefined,
            'progress': async (loaded, total, per) => {
                await opt.progress?.(loaded, total, 'app', url);
                await opt.perProgress?.(per);
            },
        });
    }
    else if (url.type !== 'app') {
        if (notifyId) {
            lForm.notifyContent(notifyId, {
                'note': 'Error -2',
                'timeout': 3_000,
            });
        }
        return -2;
    }
    else {
        app = url;
    }
    if (!app) {
        if (notifyId) {
            lForm.notifyContent(notifyId, {
                'note': 'Error -3',
                'timeout': 3_000,
            });
        }
        return -3;
    }
    /** --- 申请任务ID --- */
    let taskId = '';
    do {
        taskId = lTool.random(8, lTool.RANDOM_LUN);
    } while (list[taskId]);
    /** --- .cga 文件路径 --- */
    const path = opt.path ?? ((typeof url === 'string') ? url : '/runtime/' + lTool.random(16, lTool.RANDOM_LN) + '.cga');
    const lio = path.lastIndexOf('/');
    const currentPath = path.slice(0, lio);
    // --- 创建任务对象 ---
    list[taskId] = {
        'id': taskId,
        'app': app,
        'class': null,
        'customTheme': false,
        'locale': clickgo.modules.vue.reactive({
            'lang': '',
            'data': {},
        }),
        'path': path,
        'current': currentPath,
        'forms': {},
        'controls': {},
        'timers': {},
    };
    /** --- 如果当前运行的应用没权限，则不能设置 permissions --- */
    let permissions = opt.permissions ?? [];
    if (!(await checkPermission(current, 'root'))[0]) {
        permissions = [];
    }
    runtime[taskId] = clickgo.modules.vue.reactive({
        'dialogFormIds': [],
        'permissions': permissions,
        'index': ++index,
    });
    // --- locale ---
    if (app.config.locales) {
        for (let path in app.config.locales) {
            const locale = app.config.locales[path];
            if (!path.endsWith('.json')) {
                path += '.json';
            }
            initMsg = `Load local '${path}' ...`;
            await opt.initProgress?.(1, initTotal, EIPTYPE.LOCAL, initMsg);
            if (notifyId) {
                const per = 1 / initTotal;
                lForm.notifyContent(notifyId, {
                    'note': initMsg,
                    'progress': per,
                });
                await opt.perProgress?.(per);
            }
            const lcontent = await lFs.getContent(taskId, path, {
                'encoding': 'utf8',
            });
            if (!lcontent) {
                continue;
            }
            try {
                const data = JSON.parse(lcontent);
                loadLocaleData(taskId, locale, data, '');
            }
            catch { }
        }
    }
    let expo = [];
    try {
        // --- 先检查有没有要加载的通用模块 ---
        if (app.config.modules?.length) {
            for (const m of app.config.modules) {
                if (clickgo.modules[m]) {
                    continue;
                }
                // --- 要加载库 ---
                if (!lCore.checkModule(m)) {
                    // --- 没模块，不加载 ---
                    continue;
                }
                if (!(await lCore.loadModule(m))) {
                    if (notifyId) {
                        lForm.notifyContent(notifyId, {
                            'note': 'Error -4',
                            'timeout': 3_000,
                        });
                    }
                    return -4;
                }
            }
        }
        const code = app.files['/app.js'];
        if (typeof code !== 'string') {
            if (notifyId) {
                lForm.notifyContent(notifyId, {
                    'note': 'Error -5',
                    'timeout': 3_000,
                });
            }
            return -5;
        }
        // --- code 用状态机判断敏感函数 ---
        let goOn = true;
        lTool.stateMachine(code, 0, (event) => {
            if (event.state !== lTool.ESTATE.WORD) {
                return true;
            }
            if (!['eval', 'Function'].includes(event.word)) {
                return true;
            }
            lForm.notify({
                'title': 'Error',
                'content': `The "${event.word}" is prohibited.\nFile: "${path}".`,
                'type': 'danger'
            });
            goOn = false;
            return false;
        });
        if (!goOn) {
            if (notifyId) {
                lForm.notifyContent(notifyId, {
                    'note': 'Error -6',
                    'timeout': 3_000,
                });
            }
            return -6;
        }
        // --- 判断结束 ---
        expo = lTool.runIife(code);
        if (!expo) {
            if (notifyId) {
                lForm.notifyContent(notifyId, {
                    'note': 'Error -7',
                    'timeout': 3_000,
                });
            }
            return -7;
        }
    }
    catch (e) {
        delete list[taskId];
        lCore.trigger('error', taskId, '', e, e.message + '(-1)').catch(() => { });
        if (notifyId) {
            lForm.notifyContent(notifyId, {
                'note': 'Error -8',
                'timeout': 3_000,
            });
        }
        return -8;
    }
    // --- 创建 Task 总 style ---
    lDom.createToStyleList(taskId);
    // --- 加载 control ---
    initMsg = 'Control initialization ...';
    await opt.initProgress?.(2, initTotal, EIPTYPE.CONTROL, initMsg);
    if (notifyId) {
        const per = 2 / initTotal;
        lForm.notifyContent(notifyId, {
            'note': initMsg,
            'progress': 2 / initTotal,
        });
        await opt.perProgress?.(per);
    }
    const r = await lControl.init(taskId, {
        progress: async (loaded, total, path) => {
            await opt.progress?.(loaded, total, 'control', path);
            if (notifyId) {
                let per = loaded / total;
                per = Math.min((2 / initTotal) + (1 / initTotal * per), 1);
                lForm.notifyContent(notifyId, {
                    'note': 'Loaded ' + path,
                    'progress': per,
                });
                await opt.perProgress?.(per);
            }
        },
    });
    if (r < 0) {
        lDom.removeFromStyleList(taskId);
        delete list[taskId];
        if (notifyId) {
            lForm.notifyContent(notifyId, {
                'note': 'Error ' + (-900 + r).toString(),
                'timeout': 3_000,
            });
        }
        return -900 + r;
    }
    // --- 加载 theme ---
    if (app.config.themes?.length) {
        for (let path of app.config.themes) {
            path += '.cgt';
            path = lTool.urlResolve('/', path);
            initMsg = `Load theme '${path}' ...`;
            await opt.initProgress?.(3, initTotal, EIPTYPE.THEME, initMsg);
            if (notifyId) {
                const per = 3 / initTotal;
                lForm.notifyContent(notifyId, {
                    'note': initMsg,
                    'progress': per,
                });
                await opt.perProgress?.(per);
            }
            const file = await lFs.getContent(taskId, path);
            if (file && typeof file !== 'string') {
                const th = await lTheme.read(file);
                if (th) {
                    await lTheme.load(taskId, th);
                }
            }
        }
    }
    else {
        // --- 加载全局主题 ---
        if (lTheme.global) {
            initMsg = 'Load global theme ...';
            await opt.initProgress?.(3, initTotal, EIPTYPE.THEME, initMsg);
            if (notifyId) {
                const per = 3 / initTotal;
                lForm.notifyContent(notifyId, {
                    'note': initMsg,
                    'progress': per,
                });
                await opt.perProgress?.(per);
            }
            await lTheme.load(taskId);
        }
    }
    // --- 加载任务级全局样式 ---
    if (app.config.style) {
        const style = await lFs.getContent(taskId, app.config.style + '.css', {
            'encoding': 'utf8'
        });
        if (style) {
            const r = lTool.stylePrepend(style, 'cg-task' + taskId.toString() + '_');
            initMsg = 'Style initialization ...';
            await opt.initProgress?.(4, initTotal, EIPTYPE.STYLE, initMsg);
            if (notifyId) {
                const per = 4 / initTotal;
                lForm.notifyContent(notifyId, {
                    'note': initMsg,
                    'progress': per,
                });
                await opt.perProgress?.(per);
            }
            lDom.pushStyle(taskId, await lTool.styleUrl2DataUrl(app.config.style, r.style, app.files));
        }
    }
    // --- 触发 taskStarted 事件 ---
    lCore.trigger('taskStarted', taskId).catch(() => { });
    // --- 请求权限 ---
    if (app.config.permissions) {
        initMsg = 'Permission initialization ...';
        await opt.initProgress?.(5, initTotal, EIPTYPE.PERMISSION, initMsg);
        if (notifyId) {
            const per = 5 / initTotal;
            lForm.notifyContent(notifyId, {
                'note': initMsg,
                'progress': per,
            });
            await opt.perProgress?.(per);
        }
        await checkPermission(taskId, app.config.permissions, true, undefined);
    }
    // --- 执行 app ---
    const appCls = new expo();
    appCls.filename = path;
    appCls.taskId = taskId;
    list[taskId].class = appCls;
    initMsg = 'Starting ...';
    await opt.initProgress?.(6, initTotal, EIPTYPE.START, initMsg);
    if (notifyId) {
        const per = 6 / initTotal;
        lForm.notifyContent(notifyId, {
            'note': initMsg,
            'progress': per,
        });
        await opt.perProgress?.(per);
    }
    await appCls.main(opt.data ?? {});
    initMsg = 'Done.';
    await opt.initProgress?.(7, initTotal, EIPTYPE.DONE, initMsg);
    if (notifyId) {
        const per = 7 / initTotal;
        lForm.notifyContent(notifyId, {
            'note': initMsg,
            'progress': per,
            'timeout': 3_000,
        });
        await opt.perProgress?.(per);
    }
    return taskId;
}
/** --- 本页用到的语言包 --- */
const locale = {
    'sc': {
        'unknown': '未知权限',
        'root': '<b>危险！</b>最高权限！请一定确认是否允许！',
        'apply-permission': '正在申请权限，请您仔细确认',
        'native.form': '实体窗体控制',
        'hash': '可修改地址栏 hash',
        'fs': '文件系统',
        'readonly': '只读',
        'read-write': '读写'
    },
    'tc': {
        'unknown': '未知許可權',
        'root': '<b>危險！</b>最高許可權！請一定確認是否允許！',
        'apply-permission': '正在申請許可權，請您仔細確認',
        'native.form': '實體視窗控制',
        'hash': '可修改位址列 hash',
        'fs': '檔案系統',
        'readonly': '唯讀',
        'read-write': '讀寫'
    },
    'en': {
        'unknown': 'Unknown',
        'root': '<b>Danger!</b> Highest permission! Please confirm if you want to allow!',
        'apply-permission': 'Applying permission, please confirm carefully',
        'native.form': 'Native window control',
        'hash': 'Can modify address bar "hash"',
        'fs': 'File system',
        'readonly': 'Read-only',
        'read-write': 'Read and write'
    },
    'ja': {
        'unknown': '不明な権限',
        'root': '<b>危険！</b>最高権限です！許可するかどうか必ず確認してください！',
        'apply-permission': '権限を申請中です。よくご確認ください',
        'native.form': 'ネイティブフォームコントロール',
        'hash': 'アドレスバーの "hash" を変更できます',
        'fs': 'ファイルシステム',
        'readonly': '読み取り専用',
        'read-write': '読み書き可能'
    },
    'ko': {
        'unknown': '알 수 없는 권한',
        'root': '<b>위험!</b> 최고 권한입니다! 반드시 허용할 것인지 확인하십시오!',
        'apply-permission': '권한을 신청 중입니다. 주의 깊게 확인하십시오',
        'native.form': '네이티브 폼 제어',
        'hash': '주소 표시 줄 "hash" 를 수정할 수 있습니다',
        'fs': '파일 시스템',
        'readonly': '읽기 전용',
        'read-write': '읽기 및 쓰기',
    },
    'th': {
        'unknown': 'สิทธิ์ที่ไม่รู้จัก',
        'root': '<b>อันตราย!</b> สิทธิ์สูงสุด! โปรดตรวจสอบว่าต้องการอนุญาตหรือไม่!',
        'apply-permission': 'กำลังขอสิทธิ์ โปรดตรวจสอบอย่างรอบคอบ',
        'native.form': 'การควบคุมแบบฟอร์มแบบ Native',
        'hash': 'สามารถแก้ไขแถบที่อยู่ "hash"',
        'fs': 'ระบบไฟล์',
        'readonly': 'อ่านได้อย่างเดียว',
        'read-write': 'อ่านและเขียนได้'
    },
    'es': {
        'unknown': 'Permiso desconocido',
        'root': '<b>¡Peligro!</b> ¡Permiso máximo! ¡Asegúrese de permitirlo!',
        'apply-permission': 'Solicitando permiso. Por favor, compruebe cuidadosamente',
        'native.form': 'Control de formulario nativo',
        'hash': 'Puede modificar el "hash" de la barra de direcciones',
        'fs': 'Sistema de archivos',
        'readonly': 'Solo lectura',
        'read-write': 'Lectura y escritura',
    },
    'de': {
        'unknown': 'Unbekannte Berechtigung',
        'root': '<b>Gefahr!</b> Höchste Berechtigung! Bitte stellen Sie unbedingt sicher, ob dies erlaubt ist!',
        'apply-permission': 'Bitte bestätigen Sie die Berechtigungsanfrage sorgfältig',
        'native.form': 'Natives Formularsteuerelement',
        'hash': 'Adressleisten "hash" bearbeiten',
        'fs': 'Dateisystem',
        'readonly': 'Schreibgeschützt',
        'read-write': 'Lesen/Schreiben'
    },
    'fr': {
        'unknown': 'Autorisation inconnue',
        'root': '<b>Danger !</b> Autorisation maximale ! Veuillez vous assurer que vous êtes autorisé à le faire !',
        'apply-permission': 'Demande d\'autorisation en cours, veuillez vérifier attentivement',
        'native.form': 'Contrôle de formulaire natif',
        'hash': 'Modifier le "hash" de la barre d\'adresse',
        'fs': 'Système de fichiers',
        'readonly': 'Lecture seule',
        'read-write': 'Lecture/écriture'
    },
    'pt': {
        'unknown': 'Permissão desconhecida',
        'root': '<b>Perigo!</b> Permissão máxima! Certifique-se de ter permissão para fazê-lo!',
        'apply-permission': 'Solicitando permissão, por favor confirme cuidadosamente',
        'native.form': 'Controle de formulário nativo',
        'hash': 'Editar "hash" da barra de endereço',
        'fs': 'Sistema de arquivos',
        'readonly': 'Somente leitura',
        'read-write': 'Leitura/escrita'
    },
    'ru': {
        'unknown': 'Неизвестное разрешение',
        'root': '<b>Опасность!</b> Максимальное разрешение! Пожалуйста, обязательно убедитесь, что это разрешено!',
        'apply-permission': 'Выполняется запрос на разрешение, пожалуйста, внимательно подтвердите',
        'native.form': 'Нативный элемент формы',
        'hash': 'Изменить "hash" адресной строки',
        'fs': 'Файловая система',
        'readonly': 'Только для чтения',
        'read-write': 'Чтение/запись'
    },
    'vi': {
        'unknown': 'Quyền không xác định',
        'root': '<b>Nguy hiểm!</b> Quyền hạn cao nhất! Hãy đảm bảo rằng bạn được phép làm điều này!',
        'apply-permission': 'Đang yêu cầu quyền truy cập, vui lòng xác nhận cẩn thận',
        'native.form': 'Thiết bị kiểm soát biểu mẫu gốc',
        'hash': 'Chỉnh sửa "hash" thanh địa chỉ',
        'fs': 'Hệ thống tập tin',
        'readonly': 'Chỉ đọc',
        'read-write': 'Đọc/ghi'
    }
};
// fs.{path}{r/w}，path 以 / 结尾则是路径权限，不以 / 结尾是文件权限
/**
 * --- 检测应用是否有相应的权限（如果 taskId 是 sysId 则直接成功） ---
 * @param taskId 要检查的 taskId
 * @param vals 要检测的权限
 * @param apply 如果没有权限是否自动弹出申请，默认为否
 * @param applyHandler 向用户申请成功的权限列表回调
 */
export async function checkPermission(taskId, vals, apply = false, applyHandler) {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    if (typeof vals === 'string') {
        vals = [vals];
    }
    if (isSys(taskId)) {
        return new Array(vals.length).fill(true);
    }
    const task = list[taskId];
    if (!task) {
        return new Array(vals.length).fill(false);
    }
    const rtn = [];
    /** --- 需要申请的权限 --- */
    const applyList = [];
    for (const val of vals) {
        if (runtime[taskId].permissions.includes('root')) {
            // --- 有 root 权限，一定成功 ---
            rtn.push(true);
            continue;
        }
        if (val.startsWith('fs.')) {
            // --- fs 判断比较特殊 ---
            let yes = false;
            const path = val.slice(3, -1);
            for (const v of runtime[taskId].permissions) {
                if (!v.startsWith('fs.')) {
                    continue;
                }
                const pa = v.slice(3, -1);
                if (pa.endsWith('/')) {
                    if (!path.startsWith(pa)) {
                        continue;
                    }
                }
                else if (pa !== path) {
                    continue;
                }
                // --- 找到了 ---
                if (val.endsWith('w')) {
                    // --- 用户要求读写 ---
                    if (v.endsWith('r')) {
                        // --- 但目前只有读的权限 ---
                        continue;
                    }
                }
                // --- 正常，有权限 ---
                yes = true;
                break;
            }
            rtn.push(yes);
            if (!yes && apply) {
                // --- 要申请权限 ---
                applyList.push(val);
            }
            continue;
        }
        // --- 其他权限判断 ---
        const result = runtime[taskId].permissions.includes(val);
        if (!result && apply) {
            // --- 要申请权限 ---
            applyList.push(val);
        }
        rtn.push(result);
    }
    // --- 申请权限 ---
    if (applyList.length) {
        let html = '<div>"' + lTool.escapeHTML(task.app.config.name) + '" ' + ((locale[lCore.config.locale]?.['apply-permission'] ?? locale['en']['apply-permission']) + ':') + '</div>';
        for (const item of applyList) {
            if (item.startsWith('fs.')) {
                // --- fs 判断比较特殊 ---
                const path = item.slice(3, -1);
                html += '<div style="margin-top: 10px;">' +
                    (locale[lCore.config.locale]?.fs ?? locale['en'].fs) + ' ' + lTool.escapeHTML(path) + ' ' + (item.endsWith('r') ? (locale[lCore.config.locale]?.readonly ?? locale['en'].readonly) : (locale[lCore.config.locale]?.['read-write'] ?? locale['en']['read-write'])) +
                    '<div style="color: hsl(0,0%,60%);">' + lTool.escapeHTML(item) + '</div>' +
                    '</div>';
                continue;
            }
            const lang = locale[lCore.config.locale]?.[item] ?? locale['en'][item];
            html += '<div style="margin-top: 10px;">' +
                (lang ?? locale[lCore.config.locale]?.unknown ?? locale['en'].unknown) +
                '<div style="color: hsl(0,0%,60%);">' + lTool.escapeHTML(item) + '</div>' +
                '</div>';
        }
        if (await lForm.superConfirm(sysId, html)) {
            // --- 所有 false 变成 true ---
            for (let i = 0; i < rtn.length; ++i) {
                if (rtn[i]) {
                    continue;
                }
                rtn[i] = true;
            }
            for (const item of applyList) {
                runtime[taskId].permissions.push(item);
            }
            try {
                await applyHandler?.(applyList);
            }
            catch { }
        }
    }
    return rtn;
}
/**
 * --- 完全结束任务 ---
 * @param taskId 要结束的任务 id
 */
export async function end(taskId) {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const task = list[taskId];
    if (!task) {
        return true;
    }
    // --- 如果是 native 模式 ---
    if (clickgo.isNative() && (Object.keys(list).length === 1)) {
        await lNative.close(sysId);
    }
    // --- 获取最大的 z index 窗体，并让他获取焦点 ---
    const fid = await lForm.getMaxZIndexID(sysId, {
        'taskIds': [taskId],
    });
    await lForm.changeFocus(fid ?? undefined);
    // --- 移除窗体 list ---
    for (const fid in task.forms) {
        // --- 结束任务挨个关闭窗体 ---
        const f = task.forms[fid];
        lCore.trigger('formRemoved', taskId, f.id, f.vroot.$refs.form.title, f.vroot.$refs.form.iconDataUrl).catch(() => { });
        try {
            f.vapp.unmount();
        }
        catch (err) {
            const msg = `Message: ${err.message}\nTask id: ${task.id}\nForm id: ${fid}\nFunction: task.end, unmount.`;
            lForm.notify({
                'title': 'Form Unmount Error',
                'content': msg,
                'type': 'danger'
            });
        }
        f.vapp._container.remove();
        lForm.elements.popList.querySelector('[data-form-id="' + f.id.toString() + '"]')?.remove();
        lDom.clearWatchStyle(fid);
        lDom.clearWatchProperty(fid);
        lDom.clearWatchPosition(fid);
        delete lForm.activePanels[fid];
    }
    // --- 移除可能残留的 form wrap ---
    const flist = lForm.elements.list.querySelectorAll('.cg-form-wrap[data-task-id="' + taskId.toString() + '"]');
    for (const f of flist) {
        f.remove();
    }
    // --- 移除 style ---
    lDom.removeFromStyleList(taskId);
    // --- 移除所有 timer ---
    for (const timer in list[taskId].timers) {
        if (timer.startsWith('1x')) {
            const ft = timer.slice(2);
            cancelAnimationFrame(frameMaps[ft]);
            delete frameMaps[ft];
        }
        else {
            clearTimeout(parseFloat(timer));
        }
    }
    // --- 移除各类监听 ---
    lDom.clearWatchSize(taskId);
    lDom.clearWatch(taskId);
    lNative.clear(taskId);
    // --- 移除 task ---
    delete list[taskId];
    delete runtime[taskId];
    // --- 触发 taskEnded 事件 ---
    lCore.trigger('taskEnded', taskId).catch(() => { });
    // --- 移除 task bar ---
    await clearSystem(taskId);
    return true;
}
/**
 * --- 加载 locale data 对象到 task ---
 * @param taskId 任务 ID
 * @param lang 语言名，如 sc
 * @param data 数据
 * @param pre 前置
 */
export function loadLocaleData(taskId, lang, data, pre = '') {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    if (!taskId) {
        return;
    }
    if (!list[taskId].locale.data[lang]) {
        list[taskId].locale.data[lang] = {};
    }
    for (const k in data) {
        const v = data[k];
        if (typeof v === 'object') {
            loadLocaleData(taskId, lang, v, pre + k + '.');
        }
        else {
            list[taskId].locale.data[lang][pre + k] = v;
        }
    }
}
/**
 * --- 加载 locale 文件 json ---
 * @param taskId 所属的 taskId
 * @param lang 语言名，如 sc
 * @param path 绝对或者相对 app 路径的地址
 */
export async function loadLocale(taskId, lang, path) {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const task = list[taskId];
    if (!task) {
        return false;
    }
    /** --- 获取的语言文件 --- */
    const fcontent = await lFs.getContent(taskId, path + '.json', {
        'encoding': 'utf8',
    });
    if (!fcontent) {
        return false;
    }
    try {
        const data = JSON.parse(fcontent);
        loadLocaleData(task.id, lang, data, '');
        return true;
    }
    catch {
        return false;
    }
}
/**
 * --- 清除任务的所有加载的语言包 ---
 * @param taskId 要清除的任务 id
 */
export function clearLocale(taskId) {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const task = list[taskId];
    if (!task) {
        return;
    }
    task.locale.data = {};
}
/**
 * --- 加载全新 locale（老 locale 的所有语言的缓存会被卸载） ---
 * @param taskId 要加载的任务 id
 * @param lang 语言名，如 sc
 * @param path 绝对或者相对 app 路径的地址
 */
export function setLocale(taskId, lang, path) {
    clearLocale(taskId);
    return loadLocale(taskId, lang, path);
}
/**
 * --- 设置本 task 的语言 name ---
 * @param current 当前任务 id
 * @param lang 语言名，如 sc
 */
export function setLocaleLang(current, lang) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const task = list[current];
    if (!task) {
        return;
    }
    task.locale.lang = lang;
}
/**
 * --- 清除 task 的语言设置 ---
 * @param current 当前任务 id
 */
export function clearLocaleLang(current) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const task = list[current];
    if (!task) {
        return;
    }
    task.locale.lang = '';
}
/**
 * --- 创建 timer ---
 * @param current 所属的 taskId
 * @param fun 执行函数
 * @param delay 延迟/间隔，毫秒
 * @param opt 选项, formId: 可省略，省略代表生命周期为当前整个任务，否则只是当前窗体，immediate: 立即执行，默认 false，count: 执行次数，0 为无限次，默认 0
 */
export function createTimer(current, fun, delay, opt = {}) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const formId = opt.formId;
    const task = list[current];
    if (!task) {
        return 0;
    }
    if (formId && !task.forms[formId]) {
        return 0;
    }
    /** --- 执行几次，0 代表无限次 --- */
    const count = opt.count ?? 0;
    /** --- 当前已经执行的次数 --- */
    let c = 0;
    // --- 是否立即执行 ---
    if (opt.immediate) {
        const r = fun();
        if (r instanceof Promise) {
            r.catch(() => { });
        }
        ++c;
        if (count > 0 && c === count) {
            return 0;
        }
    }
    let timer;
    const timerHandler = () => {
        ++c;
        if (formId && task.forms[formId] === undefined) {
            // --- form 已经没了 ---
            clearTimeout(timer);
            delete task.timers[timer];
            return;
        }
        const r = fun();
        if (r instanceof Promise) {
            r.catch(() => { });
        }
        if (count > 0 && c === count) {
            clearTimeout(timer);
            delete task.timers[timer];
            return;
        }
    };
    /** --- timer 对象 number --- */
    if (count === 1) {
        timer = window.setTimeout(timerHandler, delay);
    }
    else {
        timer = window.setInterval(timerHandler, delay);
    }
    task.timers[timer] = formId ?? '';
    return timer;
}
/**
 * --- 移除 timer ---
 * @param current 当前任务 id
 * @param timer ID
 */
export function removeTimer(current, timer) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (!list[current]) {
        return;
    }
    const formId = list[current].timers[timer];
    if (!formId) {
        return;
    }
    // --- 放在这，防止一个 task 能结束 别的 task 的 timer ---
    clearTimeout(timer);
    delete list[current].timers[timer];
}
/**
 * --- 暂停一小段时间 ---
 * @param current 当前任务 id
 * @param fun 回调函数
 * @param delay 暂停时间
 */
export function sleep(current, fun, delay) {
    return createTimer(current, fun, delay, {
        'count': 1
    });
}
/** --- systemTaskInfo 原始参考对象 --- */
const systemTaskInfoOrigin = {
    'taskId': '',
    'formId': '',
    'length': 0,
};
/** --- task 的信息 --- */
export let systemTaskInfo;
/**
 * --- 将任务注册为系统 task ---
 * @param taskId task id
 * @param formId task bar 的 form id
 */
export function setSystem(taskId, formId) {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const task = list[taskId];
    if (!task) {
        return false;
    }
    const f = task.forms[formId];
    if (!f) {
        return false;
    }
    if (f.vroot.position === undefined) {
        lForm.notify({
            'title': 'Warning',
            'content': `Task id is "${taskId}" app is not an available task app, position not found.`,
            'type': 'warning'
        });
        return false;
    }
    if (systemTaskInfo.taskId) {
        lForm.notify({
            'title': 'Info',
            'content': 'More than 1 system-level task application is currently running.',
            'type': 'info'
        });
    }
    systemTaskInfo.taskId = taskId;
    systemTaskInfo.formId = formId;
    lForm.simpleSystemTaskRoot.forms = {};
    refreshSystemPosition();
    return true;
}
/**
 * --- 清除系统任务设定 ---
 * @param taskId 清除的 taskId
 */
export async function clearSystem(taskId) {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    if (systemTaskInfo.taskId !== taskId) {
        return false;
    }
    systemTaskInfo.taskId = '';
    systemTaskInfo.formId = '';
    systemTaskInfo.length = 0;
    lCore.trigger('screenResize').catch(() => { });
    // --- 如果此时已经有最小化的窗体，那么他将永远“不见天日”，需要将他们传递给 simpletask ---
    const tasks = await getOriginList(sysId);
    for (const taskId in tasks) {
        const forms = lForm.getList(taskId);
        for (const formId in forms) {
            const f = forms[formId];
            if (!f.stateMin) {
                continue;
            }
            lForm.simpleSystemTaskRoot.forms[formId] = {
                'title': f.title,
                'icon': f.icon
            };
        }
    }
    return true;
}
/**
 * --- 刷新系统任务的 form 的位置以及 length ---
 */
export function refreshSystemPosition() {
    if (systemTaskInfo.taskId) {
        const form = list[systemTaskInfo.taskId].forms[systemTaskInfo.formId];
        // --- 更新 task bar 的位置 ---
        switch (lCore.config['task.position']) {
            case 'left':
            case 'right': {
                form.vroot.$refs.form.setPropData('width', 0);
                form.vroot.$refs.form.setPropData('height', window.innerHeight);
                break;
            }
            case 'top':
            case 'bottom': {
                form.vroot.$refs.form.setPropData('width', window.innerWidth);
                form.vroot.$refs.form.setPropData('height', 0);
                break;
            }
        }
        setTimeout(function () {
            switch (lCore.config['task.position']) {
                case 'left': {
                    systemTaskInfo.length = form.vroot.$el.offsetWidth;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'right': {
                    systemTaskInfo.length = form.vroot.$el.offsetWidth;
                    form.vroot.$refs.form.setPropData('left', window.innerWidth - systemTaskInfo.length);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'top': {
                    systemTaskInfo.length = form.vroot.$el.offsetHeight;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'bottom': {
                    systemTaskInfo.length = form.vroot.$el.offsetHeight;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', window.innerHeight - systemTaskInfo.length);
                    break;
                }
            }
            lCore.trigger('screenResize').catch(() => { });
        }, 50);
    }
    else {
        lCore.trigger('screenResize').catch(() => { });
    }
}
// --- 需要初始化 ---
let inited = false;
export function init() {
    if (inited) {
        return;
    }
    inited = true;
    systemTaskInfo = clickgo.modules.vue.reactive({
        'taskId': '',
        'formId': '',
        'length': 0,
    });
    clickgo.modules.vue.watch(systemTaskInfo, function () {
        // --- 检测有没有缺少的 key ---
        for (const key in systemTaskInfoOrigin) {
            if (systemTaskInfo[key] !== undefined) {
                continue;
            }
            lForm.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously removed the system task info item.\nKey: ' + key,
                'type': 'warning',
            });
            systemTaskInfo[key] = systemTaskInfoOrigin[key] ?? 0;
        }
        // --- 有没有多余的或值有问题的 ---
        for (const key in systemTaskInfo) {
            if (!Object.keys(systemTaskInfoOrigin).includes(key)) {
                lForm.notify({
                    'title': 'Warning',
                    'content': 'There is a software that maliciously modifies the system task info item.\nKey: ' + key,
                    'type': 'warning',
                });
                delete systemTaskInfo[key];
                continue;
            }
            if (typeof systemTaskInfo[key] === typeof systemTaskInfoOrigin[key]) {
                continue;
            }
            lForm.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously modifies the system task info item.\nKey: ' + key,
                'type': 'warning'
            });
            systemTaskInfo[key] = systemTaskInfoOrigin[key];
        }
    }, {
        'deep': true
    });
}
