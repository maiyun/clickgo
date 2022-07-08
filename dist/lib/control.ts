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

/**
 * --- 将 cgc 文件 blob 转换为 control 对象 ---
 * @param blob 文件 blob
 */
export async function read(blob: Blob): Promise<false | types.TControl> {
    const z = await zip.get(blob);
    if (!z) {
        return false;
    }
    /** --- 要返回的 control pkg 对象 --- */
    const controlPkg: types.TControl = {};
    /** --- 已处理的控件 --- */
    let controlProcessed = 0;
    /** --- 控件包中的控件根目录列表 --- */
    const controls = z.readDir();
    // --- 开始处理 ---
    await new Promise<void>(function(resolve) {
        /** --- 一个 control item 处理完后就执行一次 --- */
        const controlCb = function(): void {
            ++controlProcessed;
            if (controlProcessed < controls.length) {
                return;
            }
            // --- 加载完毕 ---
            resolve();
        };
        for (const control of controls) {
            if (control.isFile) {
                controlCb();
                continue;
            }
            z.getContent('/' + control.name + '/config.json').then(async function(configContent) {
                if (!configContent) {
                    controlCb();
                    return;
                }
                /** --- 子控件的配置文件 --- */
                const config: types.IControlConfig = JSON.parse(configContent);
                // --- 开始读取文件 ---
                const files: Record<string, Blob | string> = {};
                /** --- 配置文件中的文件数量总数 --- */
                const filesLength = Object.keys(config.files).length;
                /** --- 已处理的文件数 --- */
                let fileLoadedLength = 0;
                // --- 开始加载子控件中的文件 ---
                await new Promise<void>(function(resolve) {
                    /** --- 一个文件加载完后就执行一次 --- */
                    const loadedCb = function(): void {
                        ++fileLoadedLength;
                        if (fileLoadedLength < filesLength) {
                            return;
                        }
                        // --- 加载完毕 ---
                        resolve();
                    };
                    for (const file of config.files) {
                        const mime = tool.getMimeByPath(file);
                        if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                            z.getContent('/' + control.name + file, 'string').then(function(fab) {
                                if (!fab) {
                                    loadedCb();
                                    return;
                                }
                                // --- 去除 BOM ---
                                files[file] = fab.replace(/^\ufeff/, '');
                                loadedCb();
                            }).catch(function() {
                                loadedCb();
                            });
                        }
                        else {
                            z.getContent('/' + control.name + file, 'arraybuffer').then(function(fab) {
                                if (!fab) {
                                    loadedCb();
                                    return;
                                }
                                files[file] = new Blob([fab], {
                                    'type': mime.mime
                                });
                                loadedCb();
                            }).catch(function() {
                                loadedCb();
                            });
                        }
                    }
                });
                controlPkg[control.name] = {
                    'type': 'control',
                    'config': config,
                    'files': files
                };
                controlCb();
            }).catch(function() {
                controlCb();
            });
        }
    });
    return controlPkg;
}

/**
 * --- 初始化获取新窗体的控件 component ---
 * @param taskId 任务 id
 * @param formId 窗体 id
 * @param path 窗体路径（包内路径）
 * @param preprocess 代码检测函数
 * @param invoke 注入对象
 */
export async function init(
    taskId: number,
    formId: number,
    path: string,
    preprocess?: (code: string, path: string) => string,
    invoke?: Record<string, any>
): Promise<false | Record<string, any>> {
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    /** --- 要返回的控件列表 --- */
    const components: Record<string, any> = {};
    for (let cpath of t.app.config.controls) {
        if (!cpath.endsWith('.cgc')) {
            cpath += '.cgc';
        }
        /** --- 当前的控件包 --- */
        const control = t.controls.loaded[cpath];
        if (!control) {
            return false;
        }
        for (const name in control) {
            // --- 创建新的 ---
            const item = control[name];
            // --- 准备相关变量 ---
            let props: any = {};
            let data: any = {};
            let methods: any = {};
            let computed: any = {};
            let watch: any = {};
            let beforeCreate: (() => void) | undefined = undefined;
            let created: (() => void) | undefined = undefined;
            let beforeMount: (() => void) | undefined = undefined;
            let mounted: (() => void) | undefined = undefined;
            let beforeUpdate: (() => void) | undefined = undefined;
            let updated: (() => void) | undefined = undefined;
            let beforeUnmount: (() => void) | undefined = undefined;
            let unmounted: (() => void) | undefined = undefined;
            // --- 检测 layout and style ---
            let layout = '', prep = '';
            if (t.controls.layout[name]) {
                // --- layout 和 style 已经加载过，无需再次解释和加载 ---
                layout = t.controls.layout[name];
                prep = t.controls.prep[name];
            }
            else {
                // --- 要创建的控件的 layout ---
                layout = item.files[item.config.layout + '.html'] as string;
                if (layout === undefined) {
                    // --- 控件没有 layout 那肯定不能用 ---
                    return false;
                }
                // --- 给 layout 增加 data-cg-control-xxx ---
                layout = layout.replace(/^(<[a-zA-Z0-9-]+)( |>)/, '$1 data-cg-control-' + name + '$2');
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
                layout = tool.layoutAddTagClassAndReTagName(layout, false);
                // --- 给 layout 的 class 增加前置 ---
                layout = tool.layoutClassPrepend(layout, prepList);
                // --- 给 cg 对象增加 :cg-focus 传递 ---
                if (layout.includes('<cg-')) {
                    layout = tool.layoutInsertAttr(layout, ':cg-focus=\'cgFocus\'', {
                        'include': [/^cg-.+/]
                    });
                }
                // --- 给 event 增加包裹 ---
                layout = tool.eventsAttrWrap(layout);
                // --- 给 touchstart 增加 .passive 防止 [Violation] Added non-passive event listener to a scroll-blocking ---
                /*
                layout = layout.replace(/@(touchstart|touchmove|wheel)=/g, '@$1.passive=');
                layout = layout.replace(/@(touchstart|touchmove|wheel)\.not=/g, '@$1=');
                */
                t.controls.layout[name] = layout;
                t.controls.prep[name] = prep;
            }
            // --- 检测是否有 js ---
            if (item.files[item.config.code + '.js']) {
                item.files['/invoke/clickgo.js'] = `module.exports = invokeClickgo;`;
                const expo = loader.require(item.config.code, item.files, {
                    'dir': '/',
                    'invoke': invoke,
                    'preprocess': preprocess,
                    'map': {
                        'clickgo': '/invoke/clickgo'
                    }
                })[0];
                if (expo) {
                    props = expo.props || {};
                    data = expo.data || {};
                    methods = expo.methods || {};
                    computed = expo.computed || {};
                    watch = expo.watch || {};
                    beforeCreate = expo.beforeCreate;
                    created = expo.created;
                    beforeMount = expo.beforeMount;
                    mounted = expo.mounted;
                    beforeUpdate = expo.beforeUpdate;
                    updated = expo.updated;
                    beforeUnmount = expo.beforeUnmount;
                    unmounted = expo.unmounted;
                }
            }
            // --- 组成 props ---
            props.cgFocus = {
                'default': false
            };
            // --- 组成 data ---
            computed.taskId = {
                get: function(): number {
                    return taskId;
                },
                set: function(): void {
                    form.notify({
                        'title': 'Error',
                        'content': `The control tries to modify the system variable "taskId".\nPath: ${this.cgPath}\nControl: ${name}`,
                        'type': 'danger'
                    });
                    return;
                }
            };
            computed.controlName = {
                get: function(): string {
                    return name;
                },
                set: function(): void {
                    form.notify({
                        'title': 'Error',
                        'content': `The control tries to modify the system variable "controlName".\nPath: ${this.cgPath}\nControl: ${name}`,
                        'type': 'danger'
                    });
                    return;
                }
            };
            computed.cgPrep = {
                get: function(): string {
                    return prep;
                },
                set: function(): void {
                    form.notify({
                        'title': 'Error',
                        'content': `The control tries to modify the system variable "cgPrep".\nPath: ${this.cgPath}\nControl: ${name}`,
                        'type': 'danger'
                    });
                    return;
                }
            };
            // --- 获取目前现存的子 slots ---
            computed.cgSlots = function(this: types.IVControl): (name?: string) => types.IVueVNode[] {
                return (name: string = 'default'): types.IVueVNode[] => {
                    const d = this.$slots[name];
                    if (!d) {
                        return [];
                    }
                    const slots = [];
                    const list = d();
                    for (const item of list) {
                        if (typeof item.type === 'symbol') {
                            // --- 动态的 slot，例如 v-for 产生的 slot ---
                            for (const item2 of item.children) {
                                slots.push(item2);
                            }
                        }
                        else {
                            slots.push(item);
                        }
                    }
                    return slots;
                };
            };
            // --- 预设 computed ---
            computed.cgLocale = function(this: types.IVControl): string {
                if (task.list[this.taskId].locale.lang === '') {
                    return core.config.locale;
                }
                return task.list[this.taskId].locale.lang;
            };
            // --- 获取语言 ---
            computed.l = function(this: types.IVControl): (
                key: string,
                data?: Record<string, Record<string, string>>
            ) => string {
                return (key: string, data?: Record<string, Record<string, string>>): string => {
                    if (data) {
                        return data[this.cgLocale]?.[key] ?? data['en'][key] ?? 'LocaleError';
                    }
                    else if (this.localeData) {
                        return this.localeData[this.cgLocale]?.[key] ?? this.localeData['en'][key] ?? 'LocaleError';
                    }
                    else {
                        return 'LocaleError';
                    }
                };
            };
            // --- 根据 control name 查询上级序列 ---
            computed.cgParentByName = function(this: types.IVControl): (
                controlName: string
            ) => types.IVControl | null {
                return (controlName: string): types.IVControl | null => {
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
            };
            computed.formId = {
                get: function(): number {
                    return formId;
                },
                set: function(): void {
                    form.notify({
                        'title': 'Error',
                        'content': `The control tries to modify the system variable "formId".\nPath: ${this.cgPath}\nControl: ${name}`,
                        'type': 'danger'
                    });
                }
            };
            computed.cgPath = {
                get: function(): string {
                    return path;
                },
                set: function(): void {
                    form.notify({
                        'title': 'Error',
                        'content': `The control tries to modify the system variable "cgPath".\nPath: ${this.cgPath}\nControl: ${name}`,
                        'type': 'danger'
                    });
                }
            };
            // --- layout 中 :class 的转义 ---
            methods.cgClassPrepend = function(this: types.IVControl, cla: any): string {
                if (typeof cla !== 'string') {
                    return cla;
                }
                return `cg-theme-task${this.taskId}-${this.controlName}_${cla}${this.cgPrep ? (' ' + this.cgPrep + cla) : ''}`;
            };
            // --- 判断当前事件可否执行 ---
            methods.cgAllowEvent = function(
                this: types.IVControl,
                e: MouseEvent | TouchEvent | KeyboardEvent
            ): boolean {
                return dom.allowEvent(e);
            };
            components['cg-' + name] = {
                'template': layout,
                'props': props,
                'data': function() {
                    return tool.clone(data);
                },
                'methods': methods,
                'computed': computed,
                'watch': watch,

                'beforeCreate': beforeCreate,
                'created': created,
                'beforeMount': beforeMount,
                'mounted': async function(this: types.IVControl) {
                    await this.$nextTick();
                    mounted?.call(this);
                },
                'beforeUpdate': beforeUpdate,
                'updated': async function(this: types.IVControl) {
                    await this.$nextTick();
                    updated?.call(this);
                },
                'beforeUnmount': function(this: types.IVControl) {
                    beforeUnmount?.call(this);
                },
                'unmounted': async function(this: types.IVControl) {
                    await this.$nextTick();
                    unmounted?.call(this);
                }
            };
        }
    }
    return components;
}
