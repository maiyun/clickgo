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
import * as lZip from './zip';
import * as lTool from './tool';
import * as lTask from './task';
import * as lDom from './dom';
import * as lForm from './form';
import * as lFs from './fs';
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
/** --- 窗体的抽象类 --- */
export class AbstractControl {
    /** --- 当前文件在包内的路径 --- */
    get filename() {
        // --- pack 时系统自动在继承类中重写本函数 ---
        return '';
    }
    // --- init 中以下参数记得设置 ---
    /** --- 当前的窗体创建的位数 --- */
    get findex() {
        // --- 窗体创建时继承时重写本函数 ---
        return 0;
    }
    /** --- 当前的控件名称 --- */
    get controlName() {
        // --- init 中系统自动去重写本函数 ---
        return '';
    }
    /** --- 当前组件所在的任务 ID --- */
    get taskId() {
        // ---  init 中系统自动重写本函数 ---
        return '';
    }
    /** --- 当前组件所在的窗体 ID --- */
    get formId() {
        // --- buildComponents 时会重写本函数 ---
        return '';
    }
    /** --- 当前控件所在运行窗体的包内路径不以 / 结尾 --- */
    get path() {
        // --- buildComponents 时会重写本函数 ---
        return '';
    }
    /** --- 样式独占前缀 --- */
    get prep() {
        // --- init 时会重写本函数 ---
        return '';
    }
    /** --- 获取当前的 HTML DOM --- */
    get element() {
        // --- Vue 内部属性 ---
        return this.$el;
    }
    // --- init 止 ---
    /** --- root form --- */
    _rootForm = null;
    /** --- 当前控件所在窗体的窗体对象 --- */
    get rootForm() {
        if (!this._rootForm) {
            // --- 获取根组件 ---
            this._rootForm = this.parentByName('root');
            if (!this._rootForm) {
                lForm.notify({
                    'title': 'Error',
                    'content': `The "rootForm" is not ready yet.\nFile: "${this.controlName}".`,
                    'type': 'danger'
                });
            }
        }
        return this._rootForm;
    }
    /** --- 当前组件是否是别的组件的子组件，仅仅是包裹在组件的 layout 初始化中的才算 --- */
    _rootControl = null;
    /** --- 当前组件如果在开发控件层面被包裹了，则可以获取到包裹他的组件对象 --- */
    get rootControl() {
        return this._rootControl;
    }
    /**
     * --- 当前窗体是否有焦点 ---
     */
    get formFocus() {
        return this.rootForm?.formFocus ?? false;
    }
    /** --- 获取当前语言名 --- */
    get locale() {
        const task = lTask.getOrigin(this.taskId);
        return lTool.logicalOr(task?.locale.lang ?? '', lCore.config.locale);
    }
    /**
     * --- 获取语言内容 ---
     */
    get l() {
        return (key, data) => {
            const loc = this.localeData?.[this.locale][key] ?? '[LocaleError]' + key;
            if (!data) {
                return loc;
            }
            let i = -1;
            return loc.replace(/\?/g, function () {
                ++i;
                if (!data[i]) {
                    return '';
                }
                return data[i];
            });
        };
    }
    /**
     * --- 获取窗体语言内容 ---
     */
    get fl() {
        return (key, data) => {
            if (!key.startsWith('l:')) {
                return key;
            }
            return this.rootForm.l(key.slice(2), data, true);
        };
    }
    /** --- layout 中 :class 的转义 --- */
    get classPrepend() {
        return (cla) => {
            if (typeof cla !== 'string') {
                return cla;
            }
            // --- 控件没有样式表，则除了主题样式外，class 将不进行设置 ---
            return `cg-theme-task${this.taskId}-${this.controlName}_${cla}${this.prep ? (' ' + this.prep + cla) : ''}`;
        };
    }
    /** --- 获取 alignH 的 css 属性模式，请确保 props.alignH 存在 --- */
    get alignHComp() {
        if (!this.props.alignH) {
            return undefined;
        }
        switch (this.props.alignH) {
            case 'center': {
                return 'center';
            }
            case 'left':
            case 'start': {
                return 'flex-start';
            }
        }
        return 'flex-end';
    }
    /** --- 获取 alignH 的 css 属性模式，请确保 props.alignH 存在 --- */
    get alignVComp() {
        if (!this.props.alignV) {
            return undefined;
        }
        switch (this.props.alignV) {
            case 'center': {
                return 'center';
            }
            case 'top':
            case 'start': {
                return 'flex-start';
            }
        }
        return 'flex-end';
    }
    /**
     * --- 监视变动 ---
     * @param name 监视的属性或 prop 值
     * @param cb 回调
     * @param opt 参数
     */
    watch(name, cb, opt = {}) {
        return this.$watch(name, cb, opt);
    }
    /**
     * --- 获取 refs 情况 ---
     */
    get refs() {
        return this.$refs;
    }
    /**
     * --- 等待渲染 ---
     */
    get nextTick() {
        return this.$nextTick;
    }
    /**
     * --- 判断当前事件可否执行 ---
     * @param e 鼠标、触摸、键盘事件
     */
    allowEvent(e) {
        const r = clickgo.modules.pointer.allowEvent(e);
        return r;
    }
    /**
     * --- 触发系统方法 ---
     * @param name 方法名
     * @param param1 参数1
     * @param param2 参数2
     */
    async trigger(name, param1 = '', param2 = '') {
        if (!['formTitleChanged', 'formIconChanged', 'formStateMinChanged', 'formStateMaxChanged', 'formShowChanged'].includes(name)) {
            return;
        }
        await lCore.trigger(name, this.taskId, this.formId, param1, param2);
    }
    // --- 以下为 control 有，但窗体没有 ---
    /** --- 组件内部文件，由系统重写 --- */
    packageFiles = {};
    /** --- 组件参数，由用户定义重写 --- */
    props = {};
    /** --- 组件参数，由用户定义重写 --- */
    emits = {};
    /** --- 组件的子插槽 --- */
    slots = {};
    /** --- 获取某插槽所有子类 --- */
    get slotsAll() {
        return (name) => {
            if (!this.slots[name]) {
                return [];
            }
            const ls = this.slots[name]();
            const rtn = [];
            for (const slot of ls) {
                if (!slot.props) {
                    if ((typeof slot.children !== 'string') && slot.children.length) {
                        for (const item of slot.children) {
                            rtn.push(item);
                        }
                    }
                    continue;
                }
                rtn.push(slot);
            }
            return rtn;
        };
    }
    /** --- 获取 props 中的 boolean 类型的值 --- */
    get propBoolean() {
        return (name) => {
            return lTool.getBoolean(this.props[name]);
        };
    }
    /** --- 获取 props 中的 number 类型的值 --- */
    get propNumber() {
        return (name) => {
            return lTool.getNumber(this.props[name]);
        };
    }
    /** --- 获取 props 中的 int 类型的值 --- */
    get propInt() {
        return (name) => {
            return Math.round(this.propNumber(name));
        };
    }
    /** --- 获取 props 中的 array 类型的值 --- */
    get propArray() {
        return (name) => {
            return lTool.getArray(this.props[name]);
        };
    }
    /**
     * --- 向上反应事件 ---
     * @param name 事件名
     * @param v 事件值
     */
    emit(name, ...v) {
        this.$emit(name, ...v);
    }
    /**
     * --- 获取上层控件 ---
     */
    get parent() {
        return this.$parent;
    }
    /**
    * --- 根据 control name 查询上层控件 ---
    */
    get parentByName() {
        return (controlName) => {
            let parent = this.$parent;
            while (true) {
                if (!parent) {
                    return null;
                }
                if (parent.controlName === controlName) {
                    return parent;
                }
                parent = parent.$parent;
            }
        };
    }
    /**
    * --- 根据 control access 查询上层控件 ---
    */
    get parentByAccess() {
        return (name, val) => {
            let parent = this.$parent;
            while (true) {
                if (!parent) {
                    return null;
                }
                if (!parent.access) {
                    parent = parent.$parent;
                    continue;
                }
                if (parent.access[name] === val) {
                    return parent;
                }
                parent = parent.$parent;
            }
        };
    }
    // --- 控件响应事件，都可由用户重写 ---
    onBeforeCreate() {
        return;
    }
    onCreated() {
        return;
    }
    onBeforeMount() {
        return;
    }
    /** --- 控件挂载好后触发 --- */
    onMounted() {
        return;
    }
    onBeforeUpdate() {
        return;
    }
    onUpdated() {
        return;
    }
    onBeforeUnmount() {
        return;
    }
    onUnmounted() {
        return;
    }
}
/**
 * --- 将 cgc 文件 blob 转换为 control 对象 ---
 * @param blob 文件 blob
 */
export async function read(blob) {
    const z = await lZip.get(blob);
    if (!z) {
        return false;
    }
    /** --- 要返回的 control pkg 对象 --- */
    const controlPkg = {};
    // --- 读取包 ---
    const list = z.readDir('/');
    for (const sub of list) {
        if (sub.isFile) {
            continue;
        }
        const configContent = await z.getContent('/' + sub.name + '/config.json');
        if (!configContent) {
            lForm.notify({
                'title': 'Error',
                'content': `Control file not found.\nFile: "${'/' + sub.name + '/config.json'}".`,
                'type': 'danger'
            });
            continue;
        }
        // --- 读取本条控件内容 ---
        const config = JSON.parse(configContent);
        controlPkg[config.name] = {
            'type': 'control',
            'config': config,
            'files': {}
        };
        // --- 读取控件包文件 ---
        const list = z.readDir('/' + sub.name + '/', {
            'hasChildren': true
        });
        for (const file of list) {
            const pre = file.path.slice(config.name.length + 1);
            const mime = lTool.getMimeByPath(file.name);
            if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                const fab = await z.getContent(file.path + file.name, 'string');
                if (!fab) {
                    continue;
                }
                controlPkg[config.name].files[pre + file.name] = fab.replace(/^\ufeff/, '');
            }
            else {
                const fab = await z.getContent(file.path + file.name, 'arraybuffer');
                if (!fab) {
                    continue;
                }
                controlPkg[config.name].files[pre + file.name] = new Blob([fab], {
                    'type': mime.mime
                });
            }
        }
    }
    return controlPkg;
}
/**
 * --- 任务创建过程中，需要对 control 进行先行初始化，并将样式表插入到实际的任务 DOM 中 ---
 * @param taskId 要处理的任务 ID
 */
export async function init(taskId, opt = {}) {
    const task = lTask.getOrigin(taskId);
    if (!task) {
        return -1;
    }
    let loaded = 0;
    for (let path of task.app.config.controls) {
        if (!path.endsWith('.cgc')) {
            path += '.cgc';
        }
        path = lTool.urlResolve('/', path);
        const file = await lFs.getContent(taskId, path);
        if (file && typeof file !== 'string') {
            const c = await read(file);
            if (c) {
                for (const name in c) {
                    /** --- 控件组件中的单项 --- */
                    const item = c[name];
                    /** --- 样式唯一前缀 --- */
                    let prep = '';
                    // --- 组装预加载 control 对象 ---
                    task.controls[name] = {
                        'layout': '',
                        'files': item.files,
                        'config': item.config,
                        'props': {},
                        'emits': {},
                        'data': {},
                        'access': {},
                        'methods': {},
                        'computed': {},
                    };
                    // --- 要创建的控件的 layout ---
                    task.controls[name].layout = item.files[item.config.layout + '.html'];
                    if (task.controls[name].layout === undefined) {
                        // --- 控件没有 layout 那肯定不能用 ---
                        return -2;
                    }
                    // --- 给 layout 增加 data-cg-control-xxx ---
                    task.controls[name].layout = task.controls[name].layout.replace(/^(<[a-zA-Z0-9-]+)( |>)/, '$1 data-cg-control="' + name + '"$2');
                    /** --- 样式表 --- */
                    const style = item.files[item.config.style + '.css'];
                    if (style) {
                        // --- 有样式表，给样式表内的项增加唯一前缀（scope） ---
                        const r = lTool.stylePrepend(style);
                        prep = r.prep;
                        lDom.pushStyle(task.id, await lTool.styleUrl2DataUrl(item.config.style, r.style, item.files), 'control', name);
                    }
                    // --- 给控件的 layout 的 class 增加前置 ---
                    const prepList = [
                        'cg-theme-task' + task.id.toString() + '-' + name + '_'
                    ];
                    if (prep !== '') {
                        prepList.push(prep);
                    }
                    // --- 增加 class 为 tag-xxx ---
                    task.controls[name].layout = lTool.layoutAddTagClassAndReTagName(task.controls[name].layout, false);
                    // --- 给 layout 的 class 增加前置 ---
                    task.controls[name].layout = lTool.layoutClassPrepend(task.controls[name].layout, prepList);
                    // --- 给 cg 对象增加 :form-focus 传递 ---
                    if (task.controls[name].layout.includes('<cg-')) {
                        task.controls[name].layout = lTool.layoutInsertAttr(task.controls[name].layout, ':form-focus=\'formFocus\'', {
                            'include': [/^cg-.+/]
                        });
                    }
                    // --- 给 event 增加包裹 ---
                    task.controls[name].layout = lTool.eventsAttrWrap(task.controls[name].layout);
                    // --- 给 teleport 做处理 ---
                    if (task.controls[name].layout.includes('<teleport')) {
                        task.controls[name].layout = lTool.teleportGlue(task.controls[name].layout, '{{{formId}}}');
                    }
                    // --- 添加父子组件的映射关系 ---
                    task.controls[name].access['cgPCMap'] = lTool.random(8, lTool.RANDOM_LUNS, '"<>$');
                    task.controls[name].layout = task.controls[name].layout.replace(/(<cg-[a-zA-Z0-9-_]+)/g, `$1 data-cg-rootcontrol="${task.controls[name].access['cgPCMap']}"`);
                    // --- 检测是否有 js ---
                    let cls;
                    if (item.files[item.config.code + '.js']) {
                        const code = item.files[item.config.code + '.js'];
                        if (typeof code !== 'string') {
                            return -3;
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
                            return -6;
                        }
                        // --- 加载库 ---
                        if (item.config.modules?.length) {
                            for (const m of item.config.modules) {
                                if (clickgo.modules[m]) {
                                    continue;
                                }
                                // --- 要加载库 ---
                                if (!lCore.checkModule(m)) {
                                    // --- 没模块，不加载 ---
                                    continue;
                                }
                                if (!(await lCore.loadModule(m))) {
                                    // --- 加载失败 ---
                                    return -4;
                                }
                            }
                        }
                        // --- 判断结束 ---
                        const expo = lTool.runIife(code);
                        if (!expo) {
                            const msg = '"default" not found on "' + item.config.code + '" of "' + name + '" control.';
                            await lCore.trigger('error', taskId, '', new Error(msg), msg);
                            return -7;
                        }
                        cls = new expo();
                        //*/
                    }
                    else {
                        // --- 没有 js 文件 ---
                        cls = new (class extends AbstractControl {
                            get filename() {
                                return item.config.layout + '.js';
                            }
                        })();
                    }
                    if (cls.props) {
                        for (const key in cls.props) {
                            task.controls[name].props[key] = {
                                'default': cls.props[key]
                            };
                        }
                    }
                    if (cls.emits) {
                        for (const key in cls.emits) {
                            task.controls[name].emits[key] = cls.emits[key];
                        }
                    }
                    // --- DATA ---
                    const cdata = Object.entries(cls);
                    for (const item of cdata) {
                        if (item[0] === 'files') {
                            continue;
                        }
                        if (item[0] === 'access') {
                            // --- access 属性不放在 data 当中 ---
                            task.controls[name].access = item[1];
                            continue;
                        }
                        task.controls[name].data[item[0]] = item[1];
                    }
                    const prot = lTool.getClassPrototype(cls);
                    task.controls[name].methods = prot.method;
                    // --- COMPUTED ---
                    Object.assign(task.controls[name].computed, prot.access);
                    task.controls[name].computed.controlName = {
                        get: function () {
                            return name;
                        },
                        set: function () {
                            lForm.notify({
                                'title': 'Error',
                                'content': `The software tries to modify the system variable "controlName".\nControl: ${name}`,
                                'type': 'danger'
                            });
                            return;
                        }
                    };
                    task.controls[name].computed.taskId = {
                        get: function () {
                            return taskId;
                        },
                        set: function () {
                            lForm.notify({
                                'title': 'Error',
                                'content': `The software tries to modify the system variable "taskId".\nControl: ${name}`,
                                'type': 'danger'
                            });
                            return;
                        }
                    };
                    task.controls[name].computed.prep = {
                        get: function () {
                            return prep;
                        },
                        set: function () {
                            lForm.notify({
                                'title': 'Error',
                                'content': `The software tries to modify the system variable "prep".\nControl: ${name}`,
                                'type': 'danger'
                            });
                            return;
                        }
                    };
                }
            }
            else {
                lForm.notify({
                    'title': 'Error',
                    'content': 'Control failed to load.\nTask id: ' + task.id.toString() + '\nPath: ' + path,
                    'type': 'danger'
                });
                return -5;
            }
        }
        // --- 不能等待他，影响加载效率 ---
        opt.progress?.(++loaded, task.app.config.controls.length, path);
    }
    return 1;
}
/**
 * --- 初始化获取新窗体的控件 component（init 后执行） ---
 * @param taskId 任务 id
 * @param formId 窗体 id
 * @param path 窗体路径基准（包内路径）不以 / 结尾
 */
export function buildComponents(taskId, formId, path) {
    const task = lTask.getOrigin(taskId);
    if (!task) {
        return false;
    }
    /** --- 要返回的控件列表 --- */
    const components = {};
    for (const name in task.controls) {
        const control = task.controls[name];
        // --- 准备相关变量 ---
        const computed = Object.assign({}, control.computed);
        computed.findex = {
            get: function () {
                return task.forms[formId].vroot.findex;
            },
            set: function () {
                lForm.notify({
                    'title': 'Error',
                    'content': `The control tries to modify the system variable "findex".\nControl: ${name}`,
                    'type': 'danger'
                });
            }
        };
        computed.formId = {
            get: function () {
                return formId;
            },
            set: function () {
                lForm.notify({
                    'title': 'Error',
                    'content': `The control tries to modify the system variable "formId".\nControl: ${name}`,
                    'type': 'danger'
                });
            }
        };
        computed.path = {
            get: function () {
                return path;
            },
            set: function () {
                lForm.notify({
                    'title': 'Error',
                    'content': `The control tries to modify the system variable "path".\nControl: ${name}`,
                    'type': 'danger'
                });
            }
        };
        components['cg-' + name] = {
            'template': control.layout.replace(/{{{formId}}}/g, formId.toString()).replaceAll('@click="', '@tap="'),
            'props': control.props,
            'emits': control.emits,
            'data': function () {
                const data = lTool.clone(control.data);
                if (data.props) {
                    delete data.props;
                }
                if (data.emits) {
                    delete data.emits;
                }
                return data;
            },
            'methods': control.methods,
            'computed': computed,
            beforeCreate: control.methods.onBeforeCreate,
            created: function () {
                this.props = this.$props;
                this.slots = this.$slots;
                this.access = lTool.clone(control.access);
                this.packageFiles = {};
                for (const fname in control.files) {
                    this.packageFiles[fname] = control.files[fname];
                }
                this.onCreated();
            },
            beforeMount: function () {
                this.onBeforeMount();
            },
            mounted: async function () {
                if (this.element.dataset?.cgRootcontrol !== undefined) {
                    const rc = this.parentByAccess('cgPCMap', this.element.dataset.cgRootcontrol);
                    if (rc) {
                        this._rootControl = rc;
                    }
                }
                await this.$nextTick();
                this.onMounted();
            },
            beforeUpdate: function () {
                this.onBeforeUpdate();
            },
            updated: async function () {
                await this.$nextTick();
                this.onUpdated();
            },
            beforeUnmount: function () {
                this.onBeforeUnmount();
            },
            unmounted: async function () {
                await this.$nextTick();
                this.onUnmounted();
            }
        };
    }
    return components;
}
