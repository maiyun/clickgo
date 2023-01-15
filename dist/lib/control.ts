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
import * as types from '../../types';
import * as core from './core';
import * as zip from './zip';
import * as tool from './tool';
import * as task from './task';
import * as dom from './dom';
import * as form from './form';
import * as fs from './fs';

/** --- 窗体的抽象类 --- */
export abstract class AbstractControl {

    /** --- 当前 js 文件在包内的完整路径 --- */
    public get filename(): string {
        // --- require 时系统自动在继承类中重写本函数 ---
        return '';
    }

    /** --- 当前控件的名字 --- */
    public get controlName(): string {
        // --- init 中系统自动去重写本函数 ---
        return '';
    }

    /** --- 当前组件所在的任务 ID --- */
    public get taskId(): number {
        // ---  init/require 中系统自动重写本函数 ---
        return 0;
    }

    /** --- 当前组件所在的窗体 ID --- */
    public get formId(): number {
        // --- buildComponents 时会重写本函数 ---
        return 0;
    }

    /**
     * --- 当前窗体是否有焦点 ---
     */
    public get formFocus(): boolean {
        // --- 实际上就是 props 中的 formFocus ---
        return (this as any).props.formFocus;
    }

    /** --- 当前控件所在运行窗体的包内路径不以 / 结尾 --- */
    public get path(): string {
        // --- buildComponents 时会重写本函数 ---
        return '';
    }

    /** --- 样式独占前缀 --- */
    public get prep(): string {
        // --- init 时会重写本函数 ---
        return '';
    }

    /** --- 获取当前语言名 --- */
    public get locale(): string {
        return task.list[this.taskId].locale.lang || core.config.locale;
    }

    /**
     * --- 获取语言内容 ---
     */
    public get l(): (
        key: string,
        data?: Record<string, Record<string, string>>
    ) => string {
        return (key: string, data?: Record<string, Record<string, string>>): string => {
            if (data) {
                return data[this.locale]?.[key] ?? data['en'][key] ?? 'LocaleError';
            }
            else if ((this as any).localeData) {
                return (this as any).localeData[this.locale]?.[key] ?? (this as any).localeData['en'][key] ?? 'LocaleError';
            }
            else {
                return 'LocaleError';
            }
        };
    }

    /** --- layout 中 :class 的转义 --- */
    public get classPrepend(): (cla: any) => string {
        return (cla: any): string => {
            if (typeof cla !== 'string') {
                return cla;
            }
            // --- 控件没有样式表，则除了主题样式外，class 将不进行设置 ---
            return `cg-theme-task${this.taskId}-${this.controlName}_${cla}${this.prep ? (' ' + this.prep + cla) : ''}`;
        };
    }

    /**
     * --- 监视变动 ---
     * @param name 监视的属性或 prop 值
     * @param cb 回调
     * @param opt 参数
     */
    public watch<T extends this & this['props'], TK extends keyof T>(
        name: TK,
        cb: (val: T[TK], old: T[TK]) => void | Promise<void>,
        opt: {
            'immediate'?: boolean;
            'deep'?: boolean;
        } = {}
    ): () => void {
        return (this as any).$watch(name, cb, opt);
    }

    /**
     * --- 获取 refs 情况 ---
     */
    public get refs(): Record<string, HTMLElement & types.IVue> {
        return (this as any).$refs;
    }

    /**
     * --- 等待渲染 ---
     */
    public get nextTick(): () => Promise<void> {
        return (this as any).$nextTick;
    }

    /**
     * --- 判断当前事件可否执行 ---
     * @param e 鼠标、触摸、键盘事件
     */
    public allowEvent(e: MouseEvent | TouchEvent | KeyboardEvent): boolean {
        return dom.allowEvent(e);
    }

    /**
     * --- 触发系统方法 ---
     * @param name 方法名
     * @param param1 参数1
     * @param param2 参数2
     */
    public trigger(name: types.TGlobalEvent, param1: boolean | Error | string = '', param2: string = ''): void {
        if (!['formTitleChanged', 'formIconChanged', 'formStateMinChanged', 'formStateMaxChanged', 'formShowChanged'].includes(name)) {
            return;
        }
        core.trigger(name, this.taskId, this.formId, param1, param2);
    }

    // --- 以下为 control 有，但窗体没有 ---

    /** --- 组件参数，由用户定义重写 --- */
    public readonly props = {};

    /** --- 组件的子插槽 --- */
    public readonly slots: Record<string, any> = {};

    /** --- 获取某插槽所有子类 --- */
    public get slotsAll() {
        return (name: string): any[] => {
            if (!this.slots[name]) {
                return [];
            }
            const ls = this.slots[name]();
            const rtn: any[] = [];
            for (const slot of ls) {
                if (!slot.props) {
                    if (slot.children.length) {
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

    /**
     * --- 获取 props 中的 boolean 类型的值 ----
     */
    public get propBoolean() {
        return (name: keyof this['props']): boolean => {
            return tool.getBoolean((this.props as any)[name]);
        };
    }

    /**
     * --- 获取 props 中的 number 类型的值 ----
     */
    public get propNumber() {
        return (name: keyof this['props']): number => {
            return tool.getNumber((this.props as any)[name]);
        };
    }

    /**
     * --- 获取 props 中的 int 类型的值 ----
     */
    public get propInt() {
        return (name: keyof this['props']): number => {
            return Math.round(this.propNumber(name));
        };
    }

    /**
     * --- 获取 props 中的 array 类型的值 ----
     */
    public get propArray() {
        return (name: keyof this['props']): any[] => {
            return tool.getArray((this.props as any)[name]);
        };
    }

    /** --- 获取当前的 HTML DOM --- */
    public get element(): HTMLElement {
        return (this as any).$el;
    }

    /**
     * --- 向上反应事件 ---
     * @param name 事件名
     * @param v 事件值
     */
    public emit(name: string, ...v: string | any): void {
        (this as any).$emit(name, ...v);
    }

    /**
     * --- 获取上层控件 ---
     */
    public get parent(): AbstractControl & form.AbstractForm {
        return (this as any).$parent;
    }

    /**
    * --- 根据 control name 查询上层控件 ---
    */
    public get parentByName() {
        return (controlName: string): (AbstractControl & Record<string, any>) | null => {
            let parent = (this as any).$parent;
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

    // --- 控件响应事件，都可由用户重写 ---

    public onBeforeCreate(): void | Promise<void> {
        return;
    }

    public onCreated(): void | Promise<void> {
        return;
    }

    public onBeforeMount(): void | Promise<void> {
        return;
    }

    public onMounted(): void | Promise<void> {
        return;
    }

    public onBeforeUpdate(): void | Promise<void> {
        return;
    }

    public onUpdated(): void | Promise<void> {
        return;
    }

    public onBeforeUnmount(): void | Promise<void> {
        return;
    }

    public onUnmounted():  void | Promise<void> {
        return;
    }

}

/**
 * --- 将 cgc 文件 blob 转换为 control 对象 ---
 * @param blob 文件 blob
 */
export async function read(blob: Blob): Promise<false | types.TControlPackage> {
    const z = await zip.get(blob);
    if (!z) {
        return false;
    }
    /** --- 要返回的 control pkg 对象 --- */
    const controlPkg: types.TControlPackage = {};

    // --- 读取包 ---
    const list = z.readDir('/');
    for (const sub of list) {
        if (sub.isFile) {
            continue;
        }
        const configContent = await z.getContent('/' + sub.name + '/config.json');
        if (!configContent) {
            continue;
        }
        // --- 读取本条控件内容 ---
        const config: types.IControlConfig = JSON.parse(configContent);
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
            const mime = tool.getMimeByPath(file.name);
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
export async function init(
    taskId: number,
    invoke: Record<string, any>
): Promise<number> {
    const t = task.list[taskId];
    if (!t) {
        return -1;
    }
    for (let path of t.app.config.controls) {
        if (!path.endsWith('.cgc')) {
            path += '.cgc';
        }
        path = tool.urlResolve('/', path);
        const file = await fs.getContent(path, undefined, taskId);
        if (file && typeof file !== 'string') {
            const c = await read(file);
            if (c) {
                for (const name in c) {
                    /** --- 控件组件中的单项 --- */
                    const item = c[name];
                    /** --- 样式唯一前缀 --- */
                    let prep: string = '';
                    // --- 组装预加载 control 对象 ---
                    t.controls[name] = {
                        'layout': '',

                        'props': {
                            'formFocus': {
                                'default': false
                            }
                        },
                        'data': {},
                        'access': {},
                        'methods': {},
                        'computed': {}
                    };
                    // --- 要创建的控件的 layout ---
                    t.controls[name].layout = item.files[item.config.layout + '.html'] as string;
                    if (t.controls[name].layout === undefined) {
                        // --- 控件没有 layout 那肯定不能用 ---
                        return -2;
                    }
                    // --- 给 layout 增加 data-cg-control-xxx ---
                    t.controls[name].layout = t.controls[name].layout.replace(/^(<[a-zA-Z0-9-]+)( |>)/, '$1 data-cg-control="' + name + '"$2');
                    /** --- 样式表 --- */
                    const style = item.files[item.config.style + '.css'] as string;
                    if (style) {
                        // --- 有样式表，给样式表内的项增加唯一前缀（scope） ---
                        const r = tool.stylePrepend(style);
                        prep = r.prep;
                        dom.pushStyle(t.id, await tool.styleUrl2DataUrl(item.config.style, r.style, item.files), 'control', name);
                    }
                    // --- 给控件的 layout 的 class 增加前置 ---
                    const prepList = [
                        'cg-theme-task' + t.id.toString() + '-' + name + '_'
                    ];
                    if (prep !== '') {
                        prepList.push(prep);
                    }
                    // --- 增加 class 为 tag-xxx ---
                    t.controls[name].layout = tool.layoutAddTagClassAndReTagName(t.controls[name].layout, false);
                    // --- 给 layout 的 class 增加前置 ---
                    t.controls[name].layout = tool.layoutClassPrepend(t.controls[name].layout, prepList);
                    // --- 给 cg 对象增加 :form-focus 传递 ---
                    if (t.controls[name].layout.includes('<cg-')) {
                        t.controls[name].layout = tool.layoutInsertAttr(t.controls[name].layout, ':form-focus=\'formFocus\'', {
                            'include': [/^cg-.+/]
                        });
                    }
                    // --- 给 event 增加包裹 ---
                    t.controls[name].layout = tool.eventsAttrWrap(t.controls[name].layout);
                    // --- 给 teleport 做处理 ---
                    if (t.controls[name].layout.includes('<teleport')) {
                        t.controls[name].layout = tool.teleportGlue(t.controls[name].layout, '{{{formId}}}');
                    }
                    // --- 检测是否有 js ---
                    let cls: any;
                    if (item.files[item.config.code + '.js']) {
                        item.files['/invoke/clickgo.js'] = `module.exports = invokeClickgo;`;
                        let expo: any = [];
                        try {
                            expo = loader.require(item.config.code, item.files, {
                                'dir': '/',
                                'invoke': invoke,
                                'preprocess': function(code: string, path: string): string {
                                    // --- 屏蔽 eval 函数 ---
                                    const exec = /eval\W/.exec(code);
                                    if (exec) {
                                        form.notify({
                                            'title': 'Error',
                                            'content': `The "eval" is prohibited.\nFile: "${path}".`,
                                            'type': 'danger'
                                        });
                                        return '';
                                    }
                                    // --- 给 form 的 class 增加 filename 的 get ---
                                    code = code.replace(/extends[\s\S]+?\.\s*AbstractControl\s*{/, (t: string) => {
                                        return t + 'get filename() {return __filename;}';
                                    });
                                    return code;
                                },
                                'map': {
                                    'clickgo': '/invoke/clickgo'
                                }
                            })[0];
                        }
                        catch (e: any) {
                            core.trigger('error', taskId, 0, e, e.message + '(-4)');
                            return -3;
                        }
                        if (!expo?.default) {
                            const msg = '"default" not found on "' + item.config.code + '" of "' + name + '" control.';
                            core.trigger('error', taskId, 0, new Error(msg), msg);
                            return -4;
                        }
                        cls = new expo.default();
                    }
                    else {
                        // --- 没有 js 文件 ---
                        cls = new (class extends AbstractControl {
                            public get taskId(): number {
                                return taskId;
                            }
                        })();
                    }
                    if (cls.props) {
                        for (const key in cls.props) {
                            t.controls[name].props[key] = {
                                'default': cls.props[key]
                            };
                        }
                    }
                    // --- DATA ---
                    const cdata = Object.entries(cls);
                    for (const item of cdata) {
                        if (item[0] === 'access') {
                            // --- access 属性不放在 data 当中 ---
                            t.controls[name].access = item[1] as any;
                            continue;
                        }
                        t.controls[name].data[item[0]] = item[1];
                    }
                    const prot = tool.getClassPrototype(cls);
                    t.controls[name].methods = prot.method;
                    Object.assign(t.controls[name].computed, prot.access);
                    t.controls[name].computed.controlName = {
                        get: function() {
                            return name;
                        },
                        set: function() {
                            form.notify({
                                'title': 'Error',
                                'content': `The software tries to modify the system variable "controlName".\nControl: ${name}`,
                                'type': 'danger'
                            });
                            return;
                        }
                    };
                    t.controls[name].computed.prep = {
                        get: function() {
                            return prep;
                        },
                        set: function() {
                            form.notify({
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
                form.notify({
                    'title': 'Error',
                    'content': 'Control failed to load.\nTask id: ' + t.id.toString() + '\nPath: ' + path,
                    'type': 'danger'
                });
                return -5;
            }
        }
    }
    return 1;
}

/**
 * --- 初始化获取新窗体的控件 component ---
 * @param taskId 任务 id
 * @param formId 窗体 id
 * @param path 窗体路径基准（包内路径）不以 / 结尾
 */
export function buildComponents(
    taskId: number,
    formId: number,
    path: string
): false | Record<string, any> {
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    /** --- 要返回的控件列表 --- */
    const components: Record<string, any> = {};
    for (const name in t.controls) {
        const control = t.controls[name];
        // --- 准备相关变量 ---
        const computed: Record<string, any> = Object.assign({}, control.computed);
        computed.formId = {
            get: function(): number {
                return formId;
            },
            set: function(): void {
                form.notify({
                    'title': 'Error',
                    'content': `The control tries to modify the system variable "formId".\nControl: ${name}`,
                    'type': 'danger'
                });
            }
        };
        computed.path = {
            get: function(): string {
                return path;
            },
            set: function(): void {
                form.notify({
                    'title': 'Error',
                    'content': `The control tries to modify the system variable "path".\nControl: ${name}`,
                    'type': 'danger'
                });
            }
        };
        components['cg-' + name] = {
            'template': control.layout.replace(/{{{formId}}}/g, formId.toString()),
            'props': control.props,

            'data': function() {
                const data = tool.clone(control.data);
                if (data.props) {
                    delete data.props;
                }
                return tool.clone(data);
            },
            'methods': control.methods,
            'computed': computed,

            beforeCreate: control.methods.onBeforeCreate,
            created: function() {
                this.props = this.$props;
                this.slots = this.$slots;
                this.access = tool.clone(control.access);
                this.onCreated();
            },
            beforeMount: function() {
                this.onBeforeMount();
            },
            mounted: async function() {
                await this.$nextTick();
                this.onMounted();
            },
            beforeUpdate: function() {
                this.onBeforeUpdate();
            },
            updated: async function() {
                await this.$nextTick();
                this.onUpdated();
            },
            beforeUnmount: function() {
                this.onBeforeUnmount();
            },
            unmounted: async function() {
                await this.$nextTick();
                this.onUnmounted();
            }
        };
    }
    return components;
}
