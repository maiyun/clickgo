/**
 * Copyright 2022 Han Guoshuai <zohegs@gmail.com>
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
import * as types from '../../types';
import * as clickgo from '../clickgo';
import * as core from './core';
import * as task from './task';
import * as tool from './tool';
import * as dom from './dom';
import * as control from './control';
import * as fs from './fs';
import * as native from './native';

/** --- form 相关信息 --- */
const info: {
    /** --- 最后一个窗体 id --- */
    lastId: number;
    /** --- 最后一个窗体层级，1000（一千）开始 --- */
    lastZIndex: number;
    /** --- 最后一个置顶窗体层级，10000000（一千万）开始 --- */
    topLastZIndex: number;
    /** --- 用到的语言包 --- */
    locale: Record<string, {
        'ok': string;
        'yes': string;
        'no': string;
        'cancel': string;
        'search': string;
    }>;
} = {
    'lastId': 0,
    'lastZIndex': 999,
    'topLastZIndex': 9999999,
    'locale': {
        'sc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消',
            'search': '搜索'
        },
        'tc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消',
            'search': '檢索'
        },
        'en': {
            'ok': 'OK',
            'yes': 'Yes',
            'no': 'No',
            'cancel': 'Cancel',
            'search': 'Search'
        },
        'ja': {
            'ok': '好',
            'yes': 'はい',
            'no': 'いいえ',
            'cancel': 'キャンセル',
            'search': '検索'
        }
    }
};

/** --- 窗体的抽象类 --- */
export abstract class AbstractForm {

    /**
     * --- 创建窗体工厂函数 ---
     * @param data 要传递的对象
     * @param layout 是否使用此参数替换 layout 值
     */
    public static async create(data?: Record<string, any>, layout?: string): Promise<AbstractForm | number> {
        const frm: AbstractForm = new (this as any)();
        /** --- 要挂载的 vue 参数 --- */
        const code: types.IFormCreateCode = {
            'data': {},
            'methods': {},
            'computed': {},

            beforeCreate: (frm as any).onBeforeCreate,
            created: function(this: types.IVue) {
                this.onCreated();
            },
            beforeMount: function(this: types.IVue) {
                this.onBeforeMount();
            },
            mounted: function(this: types.IVue, data?: Record<string, any>) {
                // await this.$nextTick();
                // --- form 不用 nextTick，因为全部处理完后才会主动调用本方法 ---
                this.onMounted(data);
            },
            beforeUpdate: function(this: types.IVue) {
                this.onBeforeUpdate();
            },
            updated: async function(this: types.IVue) {
                await this.$nextTick();
                this.onUpdated();
            },
            beforeUnmount: function(this: types.IVue) {
                this.onBeforeUnmount();
            },
            unmounted: async function(this: types.IVue) {
                await this.$nextTick();
                this.onUnmounted();
            }
        };
        /** --- class 对象类的属性列表 --- */
        const cdata = Object.entries(frm);
        for (const item of cdata) {
            if (item[0] === 'access') {
                // --- access 属性不放在 data 当中 ---

                continue;
            }
            code.data![item[0]] = item[1];
        }
        if (!layout) {
            const l = task.list[frm.taskId].app.files[frm.filename.slice(0, -2) + 'xml'];
            if (typeof l !== 'string') {
                return 0;
            }
            layout = l;
        }
        const prot = tool.getClassPrototype(frm);
        code.methods = prot.method;
        code.computed = prot.access;
        // --- 窗体样式 ---
        let style: string | undefined = undefined;
        const fstyle = task.list[frm.taskId].app.files[frm.filename.slice(0, -2) + 'css'];
        if (typeof fstyle === 'string') {
            style = fstyle;
        }
        const fid = await create({
            'code': code,
            'layout': layout,
            'style': style,

            'path': frm.filename.slice(0, frm.filename.lastIndexOf('/')),
            'data': data,
            'taskId': frm.taskId
        });
        if (fid > 0) {
            return task.list[frm.taskId].forms[fid].vroot as any;
        }
        else {
            return fid;
        }
    }

    /** --- 当前文件路径 --- */
    public get filename(): string {
        // --- require 时系统自动在继承类中重写本函数 ---
        return '';
    }

    /** --- 当前控件的名字 --- */
    public get controlName(): string {
        return 'root';
    }

    public set controlName(v: string) {
        notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "controlName".\nPath: ${this.filename}`,
            'type': 'danger'
        });
        return;
    }

    /** --- 当前的任务 ID --- */
    public get taskId(): number {
        // --- 系统 invoke 继承时重写本函数 ---
        return 0;
    }

    /** --- 当前的窗体 ID --- */
    public get formId(): number {
        // --- 窗体创建时 create 系统自动重写本函数 ---
        return 0;
    }

    /** --- 当前窗体是否是焦点 --- */
    public get formFocus(): boolean {
        // --- _formFocus 在初始化时由系统设置 ---
        return (this as any)._formFocus;
    }

    public set formFocus(b: boolean) {
        notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "formFocus".\nPath: ${this.filename}`,
            'type': 'danger'
        });
    }

    /** --- 当前窗体的包内路径不以 / 结尾 --- */
    public get path(): string {
        // --- 将在初始化时系统自动重写本函数 ---
        return '';
    }

    /** --- 样式独占前缀 --- */
    public get prep(): string {
        // --- 将在初始化时系统自动重写本函数 ---
        return '';
    }

    /** --- 当前的语言 --- */
    public get locale(): string {
        return task.list[this.taskId].locale.lang || core.config.locale;
    }

    /**
     * --- 获取语言内容 ---
     */
    public get l(): (key: string) => string {
        return (key: string): string => {
            return task.list[this.taskId].locale.data[this.locale]?.[key] ?? task.list[this.taskId].locale.data['en']?.[key] ?? 'LocaleError';
        };
    }

    /** --- layout 中 :class 的转义 --- */
    public classPrepend(): (cla: any) => string {
        return (cla: any): string => {
            if (typeof cla !== 'string') {
                return cla;
            }
            // --- 没有单独的窗体样式，则只应用任务级样式 ---
            return `cg-task${this.taskId}_${cla}${this.prep ? (' ' + this.prep + cla) : ''}`;
        };
    }

    /**
     * --- 监视变动 ---
     * @param name 监视的属性
     * @param cb 回调
     * @param opt 参数
     */
    public watch<T extends this, TK extends keyof T>(
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

    // --- 以下为窗体有，但 control 没有 ---

    /**
     * --- 无 js 文件的窗体创建 ---
     * @param path 包内相对于本窗体的路径或包内绝对路径，不含扩展名
     * @param data 要传递的值
     */
    public async createForm(path: string, data?: Record<string, any>): Promise<AbstractForm | number> {
        path = tool.urlResolve(this.filename, path);
        const taskId = this.taskId;
        const cls = class extends AbstractForm {
            public get filename(): string {
                return path + '.js';
            }

            public get taskId(): number {
                return taskId;
            }
        };
        return cls.create(data);
    }

    /** --- 是否是置顶 --- */
    public get topMost(): boolean {
        // --- 将在初始化时系统自动重写本函数 ---
        return false;
    }

    public set topMost(v: boolean) {
        // --- 会进行重写 ---
    }

    /**
     * --- 给一个窗体发送一个对象，不会知道成功与失败状态 ---
     * @param fid formId 要接收对象的 form id
     * @param obj 要发送的对象
     */
    public send(fid: number, obj: Record<string, any>): void {
        obj.taskId = this.taskId;
        obj.formId = this.formId;
        send(fid, obj);
    }

    /**
     * --- 是否在本窗体上显示遮罩层 ---
     */
    public get isMask(): boolean {
        return !task.list[this.taskId].runtime.dialogFormIds.length ||
        task.list[this.taskId].runtime.dialogFormIds[task.list[this.taskId].runtime.dialogFormIds.length - 1]
            === this.formId ? false : true;
    }

    /** --- 当前是不是初次显示 --- */
    private _firstShow: boolean = true;

    /**
     * --- 显示窗体 ---
     */
    public show(): void {
        // --- 创建成功的窗体，可以直接显示 ---
        const v = this as any;
        v.$refs.form.$data.isShow = true;
        if (this._firstShow) {
            this._firstShow = false;
            // --- 将窗体居中 ---
            const area = core.getAvailArea();
            if (!v.$refs.form.stateMaxData) {
                if (v.$refs.form.left === -1) {
                    v.$refs.form.setPropData('left', (area.width - v.$el.offsetWidth) / 2);
                }
                if (v.$refs.form.top === -1) {
                    v.$refs.form.setPropData('top', (area.height - v.$el.offsetHeight) / 2);
                }
            }
            v.$refs.form.$data.isShow = true;
            changeFocus(this.formId);
        }
    }

    /**
     * --- 显示独占的窗体 ---
     */
    public async showDialog(): Promise<string> {
        this.topMost = true;
        this.show();
        task.list[this.taskId].runtime.dialogFormIds.push(this.formId);
        return new Promise((resolve) => {
            (this as any).cgDialogCallback = () => {
                resolve(this.dialogResult);
            };
        });
    }

    /**
     * --- 让窗体隐藏 ---
     */
    public hide(): void {
        const v = this as any;
        v.$refs.form.$data.isShow = false;
    }

    /**
     * --- dialog mask 窗体返回值，在 close 之后会进行传导 ---
     */
    public dialogResult: string = '';

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

    // --- 窗体可以接收到的事件 ---

    /** --- 接收 send 传递过来的 data 数据 --- */
    public onReceive(data: Record<string, any>): void | Promise<void>;
    public onReceive(): void {
        return;
    }

    /** --- 屏幕大小改变事件 --- */
    public onScreenResize(): void | Promise<void>;
    public onScreenResize(): void {
        return;
    }

    /** --- 系统配置变更事件 --- */
    public onConfigChanged<T extends keyof types.IConfig>(n: keyof types.IConfig, v: types.IConfig[T]): void;
    public onConfigChanged(): void {
        return;
    }

    /** --- 窗体创建事件 --- */
    public onFormCreated(taskId: number, formId: number, title: string, icon: string): void | Promise<void>;
    public onFormCreated(): void {
        return;
    }

    /** --- 窗体销毁事件 */
    public onFormRemoved(taskId: number, formId: number, title: string, icon: string): void | Promise<void>;
    public onFormRemoved(): void {
        return;
    }

    /** --- 窗体标题改变事件 */
    public onFormTitleChanged(taskId: number, formId: number, title: string): void | Promise<void>;
    public onFormTitleChanged(): void | Promise<void> {
        return;
    }

    /** --- 窗体图标改变事件 --- */
    public onFormIconChanged(taskId: number, formId: number, icon: string): void | Promise<void>;
    public onFormIconChanged(): void | Promise<void> {
        return;
    }

    /** --- 窗体最小化状态改变事件 --- */
    public onFormStateMinChanged(taskId: number, formId: number, state: boolean): void | Promise<void>;
    public onFormStateMinChanged(): void {
        return;
    }

    /** --- 窗体最大化状态改变事件 --- */
    public onFormStateMaxChanged(taskId: number, formId: number, state: boolean): void | Promise<void>;
    public onFormStateMaxChanged(): void {
        return;
    }

    /** --- 窗体显示状态改变事件 --- */
    public onFormShowChanged(taskId: number, formId: number, state: boolean): void | Promise<void>;
    public onFormShowChanged(): void {
        return;
    }

    /** --- 窗体获得焦点事件 --- */
    public onFormFocused(taskId: number, formId: number): void | Promise<void>;
    public onFormFocused(): void {
        return;
    }

    /** --- 窗体丢失焦点事件 --- */
    public onFormBlurred(taskId: number, formId: number): void | Promise<void>;
    public onFormBlurred(): void {
        return;
    }

    /** --- 窗体闪烁事件 --- */
    public onFormFlash(taskId: number, formId: number): void | Promise<void>;
    public onFormFlash(): void {
        return;
    }

    /** --- 任务开始事件 --- */
    public onTaskStarted(taskId: number): void | Promise<void>;
    public onTaskStarted(): void | Promise<void> {
        return;
    }

    /** --- 任务结束事件 --- */
    public onTaskEnded(taskId: number): void | Promise<void>;
    public onTaskEnded(): void | Promise<void> {
        return;
    }

    /** --- launcher 文件夹名称修改事件 --- */
    public onLauncherFolderNameChanged(id: string, name: string): void | Promise<void>;
    public onLauncherFolderNameChanged(): void {
        return;
    }

}

/** --- pop 相关信息 --- */
const popInfo: {
    /** --- 当前显示的 pop 列表 --- */
    'list': HTMLElement[];
    /** --- 当前显示的 pop 的母标签 --- */
    'elList': HTMLElement[];
    /** --- pop 最后一个层级 --- */
    'lastZIndex': number;
} = {
    'list': [],
    'elList': [],
    'lastZIndex': 0
};

export let simpleSystemTaskRoot: types.IVue;
export let launcherRoot: types.IVue;
const elements: {
    'wrap': HTMLDivElement;
    'list': HTMLDivElement;
    'popList': HTMLDivElement;
    'circular': HTMLDivElement;
    'rectangle': HTMLDivElement;
    'gesture': HTMLDivElement;
    'drag': HTMLDivElement;
    'dragIcon'?: HTMLElement;
    'system': HTMLElement;
    'simpleSystemtask': HTMLDivElement;
    'launcher': HTMLDivElement;
    'init': () => void;
} = {
    'wrap': document.createElement('div'),
    'list': document.createElement('div'),
    'popList': document.createElement('div'),
    'circular': document.createElement('div'),
    'rectangle': document.createElement('div'),
    'gesture': document.createElement('div'),
    'drag': document.createElement('div'),
    'dragIcon': undefined,
    'system': document.createElement('div'),
    'simpleSystemtask': document.createElement('div'),
    'launcher': document.createElement('div'),
    'init': function() {
        /** --- clickgo 所有的 div wrap --- */
        this.wrap.id = 'cg-wrap';
        document.getElementsByTagName('body')[0].appendChild(this.wrap);
        if (clickgo.isImmersion()) {
            // --- 只有沉浸式模式（Windows 下非 frame 的 native）才会绑定这个事件 ---
            this.wrap.addEventListener('mouseenter', function() {
                native.invoke('cg-mouse-ignore', native.getToken(), false);
            });
            this.wrap.addEventListener('mouseleave', function() {
                native.invoke('cg-mouse-ignore', native.getToken(), true);
            });
        }

        /** --- form list 的 div --- */
        this.list.id = 'cg-form-list';
        this.wrap.appendChild(this.list);
        this.list.addEventListener('touchmove', function(e): void {
            // --- 防止拖动时整个网页跟着动 ---
            if (e.cancelable) {
                e.preventDefault();
            }
            // --- 为啥要在这加，因为有些设备性能不行，在 touchstart 之时添加的 touchmove 不能立马响应，导致网页还是跟着动，所以增加此函数 ---
        }, {
            'passive': false
        });
        this.list.addEventListener('wheel', function(e): void {
            // --- 防止不小心前进后退，或上下缓动滚动（Mac） ---
            e.preventDefault();
        }, {
            'passive': false
        });
        this.list.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });

        /** --- pop list 的 div --- */
        this.popList.id = 'cg-pop-list';
        this.popList.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });
        this.wrap.appendChild(this.popList);
        this.popList.addEventListener('touchmove', function(e): void {
            // --- 防止拖动时整个网页跟着动 ---
            e.preventDefault();
        }, {
            'passive': false
        });

        // --- 从鼠标指针处从小到大缩放然后淡化的圆圈动画特效对象 ---=
        this.circular.id = 'cg-circular';
        this.wrap.appendChild(this.circular);

        // --- 从鼠标指针处开始从小到大缩放并铺满屏幕（或任意大小矩形）的对象 ---
        this.rectangle.setAttribute('data-pos', '');
        this.rectangle.id = 'cg-rectangle';
        this.wrap.appendChild(this.rectangle);

        // --- 手势有效无效的圆圈 ---
        this.gesture.id = 'cg-gesture';
        this.wrap.appendChild(this.gesture);

        // --- drag drop 的拖动占位符 ---
        this.drag.id = 'cg-drag';
        this.drag.innerHTML = '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L40 40" stroke="#FFF" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M8 40L40 8" stroke="#FFF" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/></svg>';
        this.dragIcon = this.drag.childNodes[0] as HTMLElement;
        this.wrap.appendChild(this.drag);

        // --- 添加 cg-system 的 dom ---
        this.system.id = 'cg-system';
        this.system.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });
        this.wrap.appendChild(this.system);
        this.system.addEventListener('touchmove', function(e): void {
            // --- 防止拖动时整个网页跟着动 ---
            e.preventDefault();
        }, {
            'passive': false
        });

        // --- 添加 cg-simpletask 的 dom ---
        this.simpleSystemtask.id = 'cg-simpletask';
        this.simpleSystemtask.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });
        this.wrap.appendChild(this.simpleSystemtask);
        this.simpleSystemtask.addEventListener('touchmove', function(e): void {
            // --- 防止拖动时整个网页跟着动 ---
            e.preventDefault();
        }, {
            'passive': false
        });
        const simpletaskApp = clickgo.vue.createApp({
            'template': '<div v-for="(item, formId) of forms" class="cg-simpletask-item" @click="click(parseInt(formId))"><div v-if="item.icon" class="cg-simpletask-icon" :style="{\'background-image\': \'url(\' + item.icon + \')\'}"></div><div>{{item.title}}</div></div>',
            'data': function() {
                return {
                    'forms': {}
                };
            },
            'watch': {
                'forms': {
                    handler: function(this: types.IVue) {
                        const length = Object.keys(this.forms).length;
                        if (length > 0) {
                            if (elements.simpleSystemtask.style.bottom !== '0px') {
                                elements.simpleSystemtask.style.bottom = '0px';
                                core.trigger('screenResize');
                            }
                        }
                        else {
                            if (elements.simpleSystemtask.style.bottom === '0px') {
                                elements.simpleSystemtask.style.bottom = '-46px';
                                core.trigger('screenResize');
                            }
                        }
                    },
                    'deep': true
                }
            },
            'methods': {
                click: function(this: types.IVue, formId: number): void {
                    changeFocus(formId);
                }
            },
            'mounted': function(this: types.IVue): void {
                simpleSystemTaskRoot = this as any;
            }
        });
        simpletaskApp.mount('#cg-simpletask');

        // --- cg-launcher ---
        this.launcher.id = 'cg-launcher';
        this.launcher.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });
        this.wrap.appendChild(this.launcher);
        this.launcher.addEventListener('touchmove', function(e): void {
            // --- 防止拖动时整个网页跟着动 ---
            e.preventDefault();
        }, {
            'passive': false
        });
        // --- Vue 挂载在这里 ---
        const waiting = function(): void {
            // --- 必须在这里执行，要不然 computed 无法更新，因为 core 还没加载进来 ---
            if (!core.config) {
                setTimeout(function() {
                    waiting();
                }, 2000);
                return;
            }
            const launcherApp = clickgo.vue.createApp({
                'template': `<div class="cg-launcher-search">` +
    `<input v-if="folderName === ''" class="cg-launcher-sinput" :placeholder="search" v-model="name">` +
    `<input v-else class="cg-launcher-foldername" :value="folderName" @change="folderNameChange">` +
`</div>` +
`<div class="cg-launcher-list" @mousedown="mousedown" @click="listClick" :class="[folderName === '' ? '' : 'cg-folder-open']">` +
    `<div v-for="item of list" class="cg-launcher-item">` +
        `<div class="cg-launcher-inner">` +
            `<div v-if="!item.list || item.list.length === 0" class="cg-launcher-icon" :style="{'background-image': 'url(' + item.icon + ')'}" @click="iconClick($event, item)"></div>` +
            `<div v-else class="cg-launcher-folder" @click="openFolder($event, item)">` +
                `<div>` +
                    `<div v-for="sub of item.list" class="cg-launcher-item">` +
                        `<div class="cg-launcher-inner">` +
                            `<div class="cg-launcher-icon" :style="{'background-image': 'url(' + sub.icon + ')'}" @click="subIconClick($event, sub)"></div>` +
                            `<div class="cg-launcher-name">{{sub.name}}</div>` +
                        `</div>` +
                        `<div class="cg-launcher-space"></div>` +
                    `</div>` +
                `</div>` +
            `</div>` +
            `<div class="cg-launcher-name">{{item.name}}</div>` +
        `</div>` +
        `<div class="cg-launcher-space"></div>` +
    `</div>` +
`</div>`,
                'data': function() {
                    return {
                        'name': '',
                        'folderName': ''
                    };
                },
                'computed': {
                    'search': function() {
                        return info.locale[core.config.locale]?.search ?? info.locale['en'].search;
                    },
                    'list': function(this: types.IVue) {
                        if (this.name === '') {
                            return core.config['launcher.list'];
                        }
                        const list = [];
                        for (const item of core.config['launcher.list']) {
                            if (item.list && item.list.length > 0) {
                                for (const sub of item.list) {
                                    if (sub.name.toLowerCase().includes(this.name.toLowerCase())) {
                                        list.push(sub);
                                    }
                                }
                            }
                            else {
                                if (item.name.toLowerCase().includes(this.name.toLowerCase())) {
                                    list.push(item);
                                }
                            }
                        }
                        return list;
                    }
                },
                'methods': {
                    mousedown: function(this: types.IVue, e: MouseEvent): void {
                        this.md = e.pageX + e.pageY;
                    },
                    listClick: function(this: types.IVue, e: MouseEvent) {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        if (e.currentTarget !== e.target) {
                            return;
                        }
                        if (this.folderName === '') {
                            hideLauncher();
                        }
                        else {
                            this.closeFolder();
                        }
                    },
                    iconClick: async function(
                        this: types.IVue,
                        e: MouseEvent,
                        item: types.IConfigLauncherItem
                    ): Promise<void> {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        hideLauncher();
                        await clickgo.task.run(item.path!, {
                            'icon': item.icon
                        });
                    },
                    subIconClick: async function(
                        this: types.IVue,
                        e: MouseEvent,
                        item: types.IConfigLauncherItem
                    ): Promise<void> {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        hideLauncher();
                        await clickgo.task.run(item.path!, {
                            'icon': item.icon
                        });
                    },
                    closeFolder: function(this: types.IVue): void {
                        // --- 关闭文件夹 ---
                        this.folderName = '';
                        const el = this.folderEl as HTMLDivElement;
                        const rect = (el.parentNode as HTMLDivElement).getBoundingClientRect();
                        el.classList.remove('cg-show');
                        el.style.left = (rect.left + 30).toString() + 'px';
                        el.style.top = rect.top.toString() + 'px';
                        el.style.width = '';
                        el.style.height = '';
                        setTimeout(() => {
                            el.style.position = '';
                            el.style.left = '';
                            el.style.top = '';
                        }, 150);
                    },
                    openFolder: function(this: types.IVue, e: MouseEvent, item: types.IConfigLauncherItem): void {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        if ((e.currentTarget as HTMLElement).childNodes[0] !== e.target) {
                            return;
                        }
                        if (this.folderName !== '') {
                            this.closeFolder();
                            return;
                        }
                        this.folderName = item.name;
                        this.folderItem = item;
                        const el = (e.currentTarget as HTMLDivElement).childNodes.item(0) as HTMLDivElement;
                        this.folderEl = el;
                        const searchEl = document.getElementsByClassName('cg-launcher-search')[0] as HTMLDivElement;
                        const rect = el.getBoundingClientRect();
                        el.style.left = rect.left.toString() + 'px';
                        el.style.top = rect.top.toString() + 'px';
                        el.style.position = 'fixed';
                        requestAnimationFrame(() => {
                            el.classList.add('cg-show');
                            el.style.left = '50px';
                            el.style.top = searchEl.offsetHeight.toString() + 'px';
                            el.style.width = 'calc(100% - 100px)';
                            el.style.height = 'calc(100% - 50px - ' + searchEl.offsetHeight.toString() + 'px)';
                        });
                    },
                    folderNameChange: function(this: types.IVue, e: InputEvent): void {
                        const input = e.target as HTMLInputElement;
                        const val = input.value.trim();
                        if (val === '') {
                            input.value = this.folderName;
                            return;
                        }
                        this.folderName = val;
                        // --- 触发 folder name change 事件 ---
                        core.trigger('launcherFolderNameChanged', this.folderItem.id ?? '', val);
                    }
                },
                'mounted': function(this: types.IVue): void {
                    launcherRoot = this as any;
                }
            });
            launcherApp.mount('#cg-launcher');
        };
        waiting();
    }
};
elements.init();

/**
 * --- 修改窗体的最大化、最小化状态，外部或不可调整 state 时才调用 ---
 * @param state 最大化、最小化或关闭
 * @param formId 窗体 id
 */
function changeState(state: 'min' | 'max' | 'close', formId: number): boolean {
    const tid: number = getTaskId(formId);
    const t = task.list[tid];
    if (!t) {
        return false;
    }
    switch (state) {
        case 'max': {
            t.forms[formId].vroot.$refs.form.maxMethod();
            break;
        }
        case 'min': {
            t.forms[formId].vroot.$refs.form.minMethod();
            break;
        }
        default: {
            remove(formId);
        }
    }
    return true;
}

/**
 * --- 最小化某个窗体 ---
 * @param formId 窗体 id
 */
export function min(formId: number): boolean {
    return changeState('min', formId);
}

/**
 * --- 最大化某个窗体 ---
 * @param formId 窗体 id
 */
export function max(formId: number): boolean {
    return changeState('max', formId);
}

/**
 * --- 关闭一个窗体 ---
 * @param formId 窗体 id
 */
export function close(formId: number):  boolean {
    return changeState('close', formId);
}

/**
 * --- 绑定窗体拖动大小事件，在 mousedown、touchstart 中绑定 ---
 * @param e 事件源
 * @param border 调整大小的方位
 */
export function bindResize(e: MouseEvent | TouchEvent, border: types.TDomBorder): void {
    const formWrap = dom.findParentByClass(e.target as HTMLElement, 'cg-form-wrap');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId;
    if (!formId) {
        return;
    }
    const fid = parseInt(formId);
    const tid = getTaskId(fid);
    const t = task.list[tid];
    if (!t) {
        return;
    }
    t.forms[fid].vroot.$refs.form.resizeMethod(e, border);
}

/**
 * --- 绑定窗体拖动事件，在 mousedown、touchstart 中绑定 ---
 * @param e 事件源
 */
export function bindDrag(e: MouseEvent | TouchEvent): void {
    const formWrap = dom.findParentByClass(e.target as HTMLElement, 'cg-form-wrap');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId;
    if (!formId) {
        return;
    }
    const fid = parseInt(formId);
    const tid = getTaskId(fid);
    const t = task.list[tid];
    if (!t) {
        return;
    }
    t.forms[fid].vroot.$refs.form.moveMethod(e, true);
}

/**
 *  --- 重置所有已经最大化的窗体大小和位置，App 模式下无效 ---
 */
export function refreshMaxPosition(): void {
    const area = core.getAvailArea();
    for (let i = 0; i < elements.list.children.length; ++i) {
        const el = elements.list.children.item(i) as HTMLElement;
        const ef = el.children.item(0) as HTMLElement;
        if (ef.dataset.cgMax === undefined) {
            continue;
        }
        const taskId = parseInt(el.getAttribute('data-task-id')!);
        const formId = parseInt(el.getAttribute('data-form-id')!);
        if (!task.list[taskId]) {
            continue;
        }
        const vroot = task.list[taskId].forms[formId].vroot;
        vroot.$refs.form.setPropData('left', area.left);
        vroot.$refs.form.setPropData('top', area.top);
        vroot.$refs.form.setPropData('width', area.width);
        vroot.$refs.form.setPropData('height', area.height);
    }
}

/**
 * --- 根据窗体 id 获取 task id ---
 * @param formId 窗体 id
 */
export function getTaskId(formId: number): number {
    const formElement = elements.list.querySelector(`[data-form-id='${formId}']`);
    if (!formElement) {
        return 0;
    }
    // --- 获取 task id ---
    const taskIdAttr = formElement.getAttribute('data-task-id');
    if (!taskIdAttr) {
        return 0;
    }
    return parseInt(taskIdAttr);
}

/**
 * --- 获取窗体信息 ---
 * @param formId 窗体 id
 */
export function get(formId: number): types.IFormInfo | null {
    const taskId: number = getTaskId(formId);
    if (taskId === 0) {
        return null;
    }
    const item = task.list[taskId].forms[formId];
    return {
        'taskId': taskId,
        'title': item.vroot.$refs.form.title,
        'icon': item.vroot.$refs.form.iconDataUrl,
        'stateMax': item.vroot.$refs.form.stateMaxData,
        'stateMin': item.vroot.$refs.form.stateMinData,
        'show': item.vroot.$refs.form.isShow,
        'focus': item.vroot.formFocus
    };
}

/**
 * --- 给一个窗体发送一个对象，不会知道成功与失败状态，APP 模式下无效用 this.send 替代 ---
 * @param formId 要接收对象的 form id
 * @param obj 要发送的对象
 */
export function send(formId: number, obj: Record<string, any>): void {
    const taskId: number = getTaskId(formId);
    if (taskId === 0) {
        return;
    }
    const item = task.list[taskId].forms[formId];
    item.vroot.onReceive(obj);
}

/**
 * --- 获取 form list 的简略情况 ---
 * @param taskId 任务 ID
 */
export function getList(taskId: number): Record<string, types.IFormInfo> {
    if (!task.list[taskId]) {
        return {};
    }
    const list: Record<string, types.IFormInfo> = {};
    for (const fid in task.list[taskId].forms) {
        const item = task.list[taskId].forms[fid];
        list[fid] = {
            'taskId': taskId,
            'title': item.vroot.$refs.form.title,
            'icon': item.vroot.$refs.form.iconDataUrl,
            'stateMax': item.vroot.$refs.form.stateMaxData,
            'stateMin': item.vroot.$refs.form.stateMinData,
            'show': item.vroot.$refs.form.isShow,
            'focus': item.vroot.formFocus
        };
    }
    return list;
}

/**
 * --- 改变 form 的焦点 class ---
 * @param formId 变更后的 form id
 */
export function changeFocus(formId: number = 0): void {
    if (typeof formId !== 'number') {
        notify({
            'title': 'Warning',
            'content': 'The "formId" of "changeFocus" must be a number type.',
            'type': 'warning'
        });
        return;
    }
    const focusElement = document.querySelector('#cg-form-list > [data-form-focus]');
    if (focusElement) {
        const dataFormId = focusElement.getAttribute('data-form-id');
        if (dataFormId) {
            const dataFormIdNumber = parseInt(dataFormId);
            if (dataFormIdNumber === formId) {
                return;
            }
            else {
                const taskId = parseInt(focusElement.getAttribute('data-task-id') ?? '0');
                const t = task.list[taskId];
                t.forms[dataFormIdNumber].vapp._container.removeAttribute('data-form-focus');
                t.forms[dataFormIdNumber].vroot._formFocus = false;
                // --- 触发 formBlurred 事件 ---
                core.trigger('formBlurred', taskId, dataFormIdNumber);
            }
        }
        else {
            return;
        }
    }
    if (formId === 0) {
        return;
    }
    const el = document.querySelector(`#cg-form-list > [data-form-id='${formId}']`);
    if (!el) {
        return;
    }
    // --- 如果是最小化状态的话，需要还原 ---
    if ((el.children.item(0) as HTMLElement).dataset.cgMin !== undefined) {
        min(formId);
    }
    // --- 获取所属的 taskId ---
    const taskId: number = parseInt(el.getAttribute('data-task-id') ?? '0');
    const t = task.list[taskId];
    // --- 检测是否有 dialog mask 层 ---
    if (t.runtime.dialogFormIds.length) {
        // --- 有 dialog ---
        const dialogFormId = t.runtime.dialogFormIds[t.runtime.dialogFormIds.length - 1];
        // --- 如果是最小化状态的话，需要还原 ---
        if (get(dialogFormId)!.stateMin) {
            min(dialogFormId);
        }
        if (t.forms[dialogFormId].vroot._topMost) {
            t.forms[dialogFormId].vroot.$refs.form.$data.zIndex = ++info.topLastZIndex;
        }
        else {
            t.forms[dialogFormId].vroot.$refs.form.$data.zIndex = ++info.lastZIndex;
        }
        // --- 开启 focus ---
        t.forms[dialogFormId].vapp._container.dataset.formFocus = '';
        t.forms[dialogFormId].vroot._formFocus = true;
        // --- 触发 formFocused 事件 ---
        core.trigger('formFocused', taskId, dialogFormId);
        // --- 判断点击的窗体是不是就是 dialog mask 窗体本身 ---
        if (dialogFormId !== formId) {
            // --- 闪烁 ---
            clickgo.form.flash(dialogFormId, taskId);
        }
    }
    else {
        // --- 没有 dialog，才修改 zindex ---
        if (t.forms[formId].vroot._topMost) {
            t.forms[formId].vroot.$refs.form.$data.zIndex = ++info.topLastZIndex;
        }
        else {
            t.forms[formId].vroot.$refs.form.$data.zIndex = ++info.lastZIndex;
        }
        // --- 正常开启 focus ---
        t.forms[formId].vapp._container.dataset.formFocus = '';
        t.forms[formId].vroot._formFocus = true;
        // --- 触发 formFocused 事件 ---
        core.trigger('formFocused', taskId, formId);
    }
}

/**
 * --- 获取当前 z-index 值最大的 form id（除了 top 模式的窗体和最小化的窗体） ---
 * @param out 排除选项
 */
export function getMaxZIndexID(out: {
    'taskIds'?: number[];
    'formIds'?: number[];
} = {}): number | null {
    let zIndex: number = 0;
    let formId: number | null = null;
    for (let i = 0; i < elements.list.children.length; ++i) {
        const formWrap = elements.list.children.item(i) as HTMLDivElement;
        const formInner = formWrap.children.item(0) as HTMLDivElement;
        if (!formInner) {
            continue;
        }
        // --- 排除 top most 窗体 ---
        const z = parseInt(formInner.style.zIndex);
        if (z > 9999999) {
            continue;
        }
        // --- 排除最小化窗体 ---
        if (formInner.dataset.cgMin !== undefined) {
            continue;
        }
        // --- 排除用户定义的 task id 窗体 ---
        const tid = parseInt(formWrap.getAttribute('data-task-id')!);
        if (out.taskIds?.includes(tid)) {
            continue;
        }
        // --- 排除用户定义的 form id 窗体 ---
        const fid = parseInt(formWrap.getAttribute('data-form-id')!);
        if (out.formIds?.includes(fid)) {
            continue;
        }
        if (z > zIndex) {
            zIndex = z;
            formId = fid;
        }
    }
    return formId;
}

/**
 * --- 根据 border 方向 获取理论窗体大小 ---
 * @param border 显示的位置代号
 */
export function getRectByBorder(border: types.TDomBorderCustom): { 'width': number; 'height': number; 'left': number; 'top': number; } {
    const area = core.getAvailArea();
    let width!: number, height!: number, left!: number, top!: number;
    if (typeof border === 'string') {
        switch (border) {
            case 'lt': {
                width = area.width / 2;
                height = area.height / 2;
                left = area.left;
                top = area.top;
                break;
            }
            case 't': {
                width = area.width;
                height = area.height;
                left = area.left;
                top = area.top;
                break;
            }
            case 'tr': {
                width = area.width / 2;
                height = area.height / 2;
                left = area.left + area.width / 2;
                top = area.top;
                break;
            }
            case 'r': {
                width = area.width / 2;
                height = area.height;
                left = area.left + area.width / 2;
                top = area.top;
                break;
            }
            case 'rb': {
                width = area.width / 2;
                height = area.height / 2;
                left = area.left + area.width / 2;
                top = area.top + area.height / 2;
                break;
            }
            case 'b': {
                width = area.width;
                height = area.height / 2;
                left = area.left;
                top = area.top + area.height / 2;
                break;
            }
            case 'bl': {
                width = area.width / 2;
                height = area.height / 2;
                left = area.left;
                top = area.top + area.height / 2;
                break;
            }
            case 'l': {
                width = area.width / 2;
                height = area.height;
                left = area.left;
                top = area.top;
                break;
            }
            default: {
                break;
            }
        }
    }
    else {
        width = border.width ?? area.width;
        height = border.height ?? area.height;
        left = border.left ?? area.left;
        top = border.top ?? area.top;
    }
    return {
        'width': width,
        'height': height,
        'left': left,
        'top': top
    };
}

/**
 * --- 显示从小到大的圆圈动画特效对象 ---
 * @param x X 坐标
 * @param y Y 坐标
 */
export function showCircular(x: number, y: number): void {
    elements.circular.style.transition = 'none';
    requestAnimationFrame(function() {
        elements.circular.style.width = '6px';
        elements.circular.style.height = '6px';
        elements.circular.style.left = (x - 3).toString() + 'px';
        elements.circular.style.top = (y - 3).toString() + 'px';
        elements.circular.style.opacity = '1';
        requestAnimationFrame(function() {
            elements.circular.style.transition = 'all .3s ease-out';
            requestAnimationFrame(function() {
                elements.circular.style.width = '60px';
                elements.circular.style.height = '60px';
                elements.circular.style.left = (x - 30).toString() + 'px';
                elements.circular.style.top = (y - 30).toString() + 'px';
                elements.circular.style.opacity = '0';
            });
        });
    });
}

/**
 * --- 移动矩形到新位置 ---
 * @param border 显示的位置代号
 */
export function moveRectangle(border: types.TDomBorderCustom): void {
    const dataReady = elements.rectangle.getAttribute('data-ready') ?? '0';
    if (dataReady === '0') {
        return;
    }
    const dataBorder =  elements.rectangle.getAttribute('data-border') ?? '';
    const setDataBorder = typeof border === 'string' ? border : `o-${border.left}-${border.top ?? 'n'}-${border.width}-${border.height ?? 'n'}`;
    if (dataBorder === setDataBorder) {
        return;
    }
    elements.rectangle.setAttribute('data-dir', setDataBorder);
    const pos = getRectByBorder(border);
    const width = pos.width - 20;
    const height = pos.height - 20;
    const left = pos.left + 10;
    const top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        elements.rectangle.style.width = width.toString() + 'px';
        elements.rectangle.style.height = height.toString() + 'px';
        elements.rectangle.style.left = left.toString() + 'px';
        elements.rectangle.style.top = top.toString() + 'px';
    }
}

/**
 * --- 显示从小到大的矩形动画特效对象 ---
 * @param x 起始位置
 * @param y 起始位置
 * @param border 最大时位置代号
 */
export function showRectangle(x: number, y: number, border: types.TDomBorderCustom): void {
    elements.rectangle.style.transition = 'none';
    requestAnimationFrame(function() {
        elements.rectangle.style.width = '5px';
        elements.rectangle.style.height = '5px';
        elements.rectangle.style.left = (x - 10).toString() + 'px';
        elements.rectangle.style.top = (y - 10).toString() + 'px';
        elements.rectangle.style.opacity = '1';
        elements.rectangle.setAttribute('data-ready', '0');
        elements.rectangle.setAttribute('data-dir', '');
        requestAnimationFrame(function() {
            elements.rectangle.style.transition = 'all .2s ease-out';
            requestAnimationFrame(function() {
                elements.rectangle.setAttribute('data-ready', '1');
                moveRectangle(border);
            });
        });
    });
}

/**
 * --- 结束时请隐藏矩形 ---
 */
export function hideRectangle(): void {
    elements.rectangle.style.opacity = '0';
}

// --- DRAG ---

/**
 * --- 显示 drag 虚拟框 ---
 */
export function showDrag(): void {
    elements.drag.style.opacity = '1';
}

/**
 * --- 移动 drag 到新位置 ---
 * @param opt top:顶部位置,left:左侧位置,width:宽度位置,height:高度位置
 */
export function moveDrag(opt: types.IMoveDragOptions): void {
    if (opt.top) {
        elements.drag.style.top = opt.top.toString() + 'px';
    }
    if (opt.left) {
        elements.drag.style.left = opt.left.toString() + 'px';
    }
    if (opt.width) {
        elements.drag.style.width = opt.width.toString() + 'px';
    }
    if (opt.height) {
        elements.drag.style.height = opt.height.toString() + 'px';
    }
    if (opt.icon) {
        if (elements.dragIcon) {
            elements.dragIcon.style.display = 'block';
        }
    }
    else {
        if (elements.dragIcon) {
            elements.dragIcon.style.display = 'none';
        }
    }
}

/**
 * --- 隐藏拖拽框框 ---
 */
export function hideDrag(): void {
    elements.drag.style.opacity = '0';
}

let notifyTop: number = 10;
let notifyId: number = 0;
/**
 * --- 弹出右上角信息框 ---
 * @param opt timeout 默认 5 秒，最大 30 秒
 */
export function notify(opt: types.INotifyOptions): number {
    // --- 申请 nid ---
    const nid = ++notifyId;
    // --- 设置 timeout ---
    let timeout = 5000;
    if (opt.timeout !== undefined) {
        if (opt.timeout <= 0 || opt.timeout > 30000) {
            timeout = 30000;
        }
        else {
            timeout = opt.timeout;
        }
    }
    // --- 设置 type ---
    if (opt.progress && !opt.type) {
        opt.type = 'progress';
    }
    // --- 创建 notify element ---
    const el = document.createElement('div');
    const y = notifyTop;
    el.classList.add('cg-system-notify');
    el.setAttribute('data-notifyid', nid.toString());
    el.style.transform = `translateY(${y}px) translateX(280px)`;
    el.style.opacity = '1';
    el.innerHTML = `<div class="cg-system-icon cg-${tool.escapeHTML(opt.type ?? 'primary')}"></div>
<div style="flex: 1;">
    <div class="cg-system-notify-title">${tool.escapeHTML(opt.title)}</div>
    <div class="cg-system-notify-content">${tool.escapeHTML(opt.content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}</div>
    ${opt.progress ? '<div class="cg-system-notify-progress"></div>' : ''}
</div>`;
    if (opt.icon) {
        (el.childNodes.item(0) as HTMLElement).style.background = 'url(' + opt.icon + ')';
        (el.childNodes.item(0) as HTMLElement).style.backgroundSize = '16px';
    }
    elements.system.appendChild(el);
    notifyTop += el.offsetHeight + 10;
    requestAnimationFrame(function() {
        el.style.transform = `translateY(${y}px) translateX(-10px)`;
        const timer = window.setTimeout(function() {
            hideNotify(nid);
        }, timeout);
        el.setAttribute('data-timer', timer.toString());
    });
    return nid;
}

/**
 * --- 修改 notify 的进度条进度 ---
 * @param notifyId notify id
 * @param per 进度，0 - 100 或 0% - 100% (0 - 1)
 */
export function notifyProgress(notifyId: number, per: number): void {
    const el: HTMLElement = elements.system.querySelector(`[data-notifyid="${notifyId}"]`)!;
    if (!el) {
        return;
    }
    const progress: HTMLElement = el.querySelector('.cg-system-notify-progress')!;
    if (!progress) {
        return;
    }
    if (per > 100) {
        per = 100;
    }
    if (per === 1) {
        const o = parseFloat(progress.style.width);
        if (o > 1) {
            per = 100;
        }
    }
    if (per === 100) {
        progress.style.transitionDelay = '.1s';
    }
    progress.style.width = (per < 1 ? per * 100 : per).toString() + '%';
}

/**
 * --- 隐藏 notify ---
 * @param notifyId 要隐藏的 notify id
 */
export function hideNotify(notifyId: number): void {
    const el: HTMLElement = elements.system.querySelector(`[data-notifyid="${notifyId}"]`)!;
    if (!el) {
        return;
    }
    clearTimeout(parseInt(el.getAttribute('data-timer')!));
    const notifyHeight = el.offsetHeight;
    el.style.opacity = '0';
    setTimeout(function() {
        notifyTop -= notifyHeight + 10;
        const notifyElementList = document.getElementsByClassName('cg-system-notify') as HTMLCollectionOf<HTMLDivElement>;
        let needSub = false;
        for (const notifyElement of notifyElementList) {
            if (notifyElement === el) {
                // --- el 之后的 notify 都要往上移动 ---
                needSub = true;
                continue;
            }
            if (needSub) {
                notifyElement.style.transform = notifyElement.style.transform.replace(/translateY\(([0-9]+)px\)/,
                    function(t: string, t1: string): string {
                        return `translateY(${parseInt(t1) - notifyHeight - 10}px)`;
                    }
                );
            }
        }
        el.remove();
    }, 100);
}

/**
 * --- 将标签追加到 pop 层，App 模式下无效 ---
 * @param el 要追加的标签
 */
export function appendToPop(el: HTMLElement): void {
    elements.popList.appendChild(el);
}

/**
 * --- 将标签从 pop 层移除，App 模式下无效 ---
 * @param el 要移除的标签
 */
export function removeFromPop(el: HTMLElement): void {
    elements.popList.removeChild(el);
}

/** --- 最后一次 touchstart 的时间戳 */
let lastShowPopTime: number = 0;
/**
 * --- 获取 pop 显示出来的坐标并报系统全局记录 ---
 * @param el 响应的元素
 * @param pop 要显示 pop 元素
 * @param direction 要显示方向（以 $el 为准的 h 水平和 v 垂直）或坐标
 * @param opt width / height 显示的 pop 定义自定义宽/高度，可省略；null，true 代表为空也会显示，默认为 false
 */
export function showPop(el: HTMLElement, pop: HTMLElement | undefined, direction: 'h' | 'v' | MouseEvent | TouchEvent | { x: number; y: number; }, opt: { 'size'?: { width?: number; height?: number; }; 'null'?: boolean; } = {}): void {
    // --- opt.null 为 true 代表可为空，为空也会被显示，默认为 false ---
    if (opt.null === undefined) {
        opt.null = false;
    }
    if (opt.size === undefined) {
        opt.size = {};
    }
    // --- 也可能不执行本次显示 ---
    if (!pop && !opt.null) {
        return;
    }
    // --- 如果短时间内已经有了 pop 被展示，则可能是冒泡序列，本次则不展示 ---
    const now = Date.now();
    if (now - lastShowPopTime < 5) {
        lastShowPopTime = now;
        return;
    }
    lastShowPopTime = now;
    // --- 检测是不是已经显示了 ---
    if (el.dataset.cgPopOpen !== undefined) {
        return;
    }
    /** --- 要不要隐藏别的 pop --- */
    const parentPop = dom.findParentByData(el, 'cg-pop');
    if (parentPop) {
        for (let i = 0; i < popInfo.list.length; ++i) {
            if (popInfo.list[i] !== parentPop) {
                continue;
            }
            if (!popInfo.elList[i + 1]) {
                continue;
            }
            hidePop(popInfo.elList[i + 1]);
        }
    }
    else {
        // --- 本层不是 pop，因此要隐藏所有 pop ---
        hidePop();
    }
    // --- 检测如果 pop 是 undefined 还显示吗 ---
    if (!pop) {
        popInfo.elList.push(el);
        el.dataset.cgPopOpen = '';
        el.dataset.cgLevel = (popInfo.elList.length - 1).toString();
        return;
    }
    // --- 最终 pop 的大小 ---
    const width = opt.size.width ?? (pop ? pop.offsetWidth : 0);
    const height = opt.size.height ?? (pop ? pop.offsetHeight : 0);
    // --- 最终显示位置 ---
    let left: number, top: number;
    if (typeof direction === 'string') {
        const bcr = el.getBoundingClientRect();
        if (direction === 'v') {
            // --- 垂直弹出 ---
            left = bcr.left;
            top = bcr.top + bcr.height;
        }
        else {
            // --- 水平弹出 ---
            left = bcr.left + bcr.width - 2;
            top = bcr.top - 2;
        }
        // --- 检查水平是否出框 ---
        if (width + left > window.innerWidth) {
            if (direction === 'v') {
                // --- 垂直弹出 ---
                left = bcr.left + bcr.width - width;
            }
            else {
                // --- 水平弹出，右边位置不够弹到左边 ---
                left = bcr.left - width + 2;
            }
        }
        // --- 检测垂直是否出框 ---
        if (height + top > window.innerHeight) {
            if (direction === 'v') {
                top = bcr.top - height;
            }
            else {
                top = bcr.top + bcr.height - height + 2;
            }
        }
    }
    else {
        let x: number;
        let y: number;
        if (direction instanceof MouseEvent) {
            x = direction.clientX;
            y = direction.clientY;
        }
        else if (direction instanceof TouchEvent) {
            x = direction.touches[0].clientX;
            y = direction.touches[0].clientY;
        }
        else {
            x = direction.x;
            y = direction.y;
        }
        left = x + 5;
        top = y + 7;
        // --- 水平 ---
        if (width + left > window.innerWidth) {
            left = x - width - 5;
        }
        // --- 垂直 ---
        if (height + top > window.innerHeight) {
            top = y - height - 5;
        }
    }
    if (left < 0) {
        left = 0;
    }
    if (top < 0) {
        top = 0;
    }
    pop.style.left = left.toString() + 'px';
    pop.style.top = top.toString() + 'px';
    pop.style.zIndex = (++popInfo.lastZIndex).toString();
    if (opt.size.width) {
        pop.style.width = opt.size.width.toString() + 'px';
    }
    if (opt.size.height) {
        pop.style.height = opt.size.height.toString() + 'px';
    }
    popInfo.list.push(pop);
    popInfo.elList.push(el);
    pop.dataset.cgOpen = '';
    pop.dataset.cgLevel = (popInfo.list.length - 1).toString();
    el.dataset.cgPopOpen = '';
    el.dataset.cgLevel = (popInfo.elList.length - 1).toString();
}

/**
 * --- 隐藏正在显示中的所有 pop，或指定 pop/el ---
 */
export function hidePop(pop?: HTMLElement): void {
    if (!pop) {
        if (popInfo.elList.length === 0) {
            return;
        }
        hidePop(popInfo.elList[0]);
        return;
    }
    let isPop: boolean = false;
    if (pop.dataset.cgPopOpen !== undefined) {
        // --- el ---
    }
    else if (pop.dataset.cgOpen !== undefined) {
        // --- pop ---
        isPop = true;
    }
    else {
        return;
    }
    const level = pop.dataset.cgLevel ? parseInt(pop.dataset.cgLevel) : -1;
    if (level === -1) {
        return;
    }
    if (popInfo.elList[level + 1]) {
        hidePop(popInfo.elList[level + 1]);
    }
    if (isPop) {
        pop.removeAttribute('data-cg-open');
        pop.removeAttribute('data-cg-level');
        popInfo.elList[level].removeAttribute('data-cg-pop-open');
        popInfo.elList[level].removeAttribute('data-cg-level');
    }
    else {
        if (popInfo.list[level]) {
            popInfo.list[level].removeAttribute('data-cg-open');
            popInfo.list[level].removeAttribute('data-cg-level');
        }
        pop.removeAttribute('data-cg-pop-open');
        pop.removeAttribute('data-cg-level');
    }
    popInfo.list.splice(level);
    popInfo.elList.splice(level);
}

/**
 * --- 点下 (mousedown / touchstart) 屏幕任意一位置时根据点击处处理隐藏 pop 和焦点丢失事件，鼠标和 touch 只会响应一个，App 模式下无效 ---
 * @param e 事件对象
 */
export function doFocusAndPopEvent(e: MouseEvent | TouchEvent): void {
    if (dom.hasTouchButMouse(e)) {
        return;
    }
    const target = e.target;
    if (!target) {
        return;
    }
    const element: HTMLElement | null = target as HTMLElement;
    if (element.dataset.cgPopOpen !== undefined) {
        // --- 此对象为已打开 pop 的组件，不做处理，组件自行处理 ---
        return;
    }
    const paths: HTMLElement[] = (e as any).path ?? (e.composedPath ? e.composedPath() : []);
    // --- 检测是不是弹出层 ---
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
        if (item.id === 'cg-pop-list') {
            // --- 弹出层点击，不触发丢失焦点，也不触发隐藏 pop，是否隐藏请自行处理 ---
            return;
        }
        if (item.dataset.cgPopOpen !== undefined) {
            return;
        }
    }
    // --- 检测是不是窗体内部点击 ---
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
        if (item.classList.contains('cg-form-wrap')) {
            // --- 窗体内部点击，转换焦点到当前窗体，但触发隐藏 pop ---
            const formId = parseInt(item.getAttribute('data-form-id') ?? '0');
            changeFocus(formId);
            hidePop();
            return;
        }
    }
    // --- 普罗大众的状态，要隐藏 menu，并且丢失窗体焦点 ---
    hidePop();
    changeFocus();
}
window.addEventListener('touchstart', doFocusAndPopEvent, {
    'passive': true
});
window.addEventListener('mousedown', doFocusAndPopEvent);

/**
 * --- 移除一个 form（关闭窗口），App 模式下无效 ---
 * @param formId 要移除的 form id
 */
export function remove(formId: number): boolean {
    const taskId: number = getTaskId(formId);
    let title = '';
    let icon = '';
    if (task.list[taskId].forms[formId]) {
        title = task.list[taskId].forms[formId].vroot.$refs.form.title;
        icon = task.list[taskId].forms[formId].vroot.$refs.form.iconDataUrl;
        const io = task.list[taskId].runtime.dialogFormIds.indexOf(formId);
        if (io > -1) {
            // --- 取消 dialog mask 记录 ---
            task.list[taskId].runtime.dialogFormIds.splice(io, 1);
        }
        task.list[taskId].forms[formId].vroot.$refs.form.$data.isShow = false;
        setTimeout(function() {
            // --- 获取最大的 z index 窗体，并让他获取焦点 ---
            const fid = getMaxZIndexID({
                'formIds': [formId]
            });
            if (fid) {
                changeFocus(fid);
            }
            else {
                changeFocus();
            }
            // --- 延长 100 秒是为了响应 100 毫秒的动画 ---
            if (!task.list[taskId]) {
                // --- 可能这时候 task 已经被结束了 ---
                return true;
            }
            task.list[taskId].forms[formId].vapp.unmount();
            task.list[taskId].forms[formId].vapp._container.remove();
            if (io > -1) {
                // --- 如果是 dialog 则要执行回调 ---
                task.list[taskId].forms[formId].vroot.cgDialogCallback();
            }
            delete task.list[taskId].forms[formId];
            // --- 移除 form 的 style ---
            dom.removeStyle(taskId, 'form', formId);
            // --- 触发 formRemoved 事件 ---
            core.trigger('formRemoved', taskId, formId, title, icon);
            // --- 检测是否已经没有窗体了，如果没有了的话就要结束任务了 ---
            if (Object.keys(task.list[taskId].forms).length === 0) {
                task.end(taskId);
            }
        }, 100);
        return true;
    }
    else {
        return false;
    }
}

/**
 * --- 根据任务 id 和 form id 获取 IForm 对象，App 模式下无效 ---
 * @param taskId 任务 id
 * @param formId 窗体 id
 */
function getForm(taskId: number, formId: number): types.IForm | null {
    /** --- 当前的 task 对象 --- */
    const t = task.list[taskId];
    if (!t) {
        return null;
    }
    const form = t.forms[formId];
    if (!form) {
        return null;
    }
    return form;
}

/**
 * --- 创建一个窗体，App 模式下无效 ---
 * @param opt 创建窗体的配置对象
 */
export async function create(opt: types.IFormCreateOptions): Promise<number> {
    if (!opt.taskId) {
        return -1;
    }
    /** --- 当前的 task 对象 --- */
    const t = task.list[opt.taskId];
    if (!t) {
        return -2;
    }
    // ---  申请 formId ---
    const formId = ++info.lastId;
    // --- 获取要定义的控件列表 ---
    const components = control.buildComponents(t.id, formId, opt.path ?? '');
    if (!components) {
        return -3;
    }
    // --- 准备相关变量 ---
    let data: Record<string, any> = {};
    let access: Record<string, any> = {};
    let methods: Record<string, any> | undefined = undefined;
    let computed: Record<string, any> = {};
    let beforeCreate: (() => void) | undefined = undefined;
    let created: (() => void) | undefined = undefined;
    let beforeMount: (() => void) | undefined = undefined;
    let mounted: ((data?: Record<string, any>) => void | Promise<void>) | undefined = undefined;
    let beforeUpdate: (() => void) | undefined = undefined;
    let updated: (() => void) | undefined = undefined;
    let beforeUnmount: (() => void) | undefined = undefined;
    let unmounted: (() => void) | undefined = undefined;
    if (opt.code) {
        data = opt.code.data ?? {};
        access = opt.code.access ?? {};
        methods = opt.code.methods;
        computed = opt.code.computed ?? {};
        beforeCreate = opt.code.beforeCreate;
        created = opt.code.created;
        beforeMount = opt.code.beforeMount;
        mounted = opt.code.mounted;
        beforeUpdate = opt.code.beforeUpdate;
        updated = opt.code.updated;
        beforeUnmount = opt.code.beforeUnmount;
        unmounted = opt.code.unmounted;
    }
    // --- 应用样式表 ---
    let style = '';
    let prep = '';
    if (opt.style) {
        // --- 将 style 中的 tag 标签转换为 class，如 button 变为 .tag-button，然后将 class 进行标准程序，添加 prep 进行区分隔离 ---
        const r = tool.stylePrepend(opt.style);
        prep = r.prep;
        style = await tool.styleUrl2DataUrl(opt.path ?? '/', r.style, t.app.files);
    }
    // --- 要创建的 form 的 layout 所有标签增加 cg 前缀，并增加新的 class 为 tag-xxx ---
    let layout = tool.purify(opt.layout);
    // --- 标签增加 cg- 前缀，增加 class 为 tag-xxx ---
    layout = tool.layoutAddTagClassAndReTagName(layout, true);
    // --- 给所有控件传递窗体的 focus 信息 ---
    layout = tool.layoutInsertAttr(layout, ':form-focus=\'formFocus\'', {
        'include': [/^cg-.+/]
    });
    // --- 给 layout 的 class 增加前置 ---
    const prepList = ['cg-task' + opt.taskId.toString() + '_'];
    if (prep !== '') {
        prepList.push(prep);
    }
    layout = tool.layoutClassPrepend(layout, prepList);
    // --- 给 event 增加包裹 ---
    layout = tool.eventsAttrWrap(layout);
    // --- 给 touchstart 增加 .passive 防止 [Violation] Added non-passive event listener to a scroll-blocking ---
    /*
    layout = layout.replace(/@(touchstart|touchmove|wheel)=/g, '@$1.passive=');
    layout = layout.replace(/@(touchstart|touchmove|wheel)\.not=/g, '@$1=');
    */
    // --- 插入 HTML 到 Element ---
    elements.list.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId.toString()}" data-task-id="${opt.taskId.toString()}"></div>`);
    // --- 获取刚才的 form wrap element 对象 ---
    const el: HTMLElement = elements.list.children.item(elements.list.children.length - 1) as HTMLElement;
    // --- 创建窗体对象 ---
    computed.formId = {
        get: function(): number {
            return formId;
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "formId".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    data._formFocus = false;
    computed.path = {
        get: function(): string {
            return opt.path ?? '';
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "path".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.prep = {
        get: function(): string {
            return prep;
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "cgPrep".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    // --- 是否在顶层的窗体 ---
    data._topMost = false;
    computed.topMost = {
        get: function(): number {
            return this._topMost;
        },
        set: function(v: boolean): void {
            const form = t.forms[formId];
            if (!form) {
                return;
            }
            if (v) {
                // --- 置顶 ---
                form.vroot.$data._topMost = true;
                if (!form.vroot._formFocus) {
                    changeFocus(form.id);
                }
                else {
                    form.vroot.$refs.form.$data.zIndex = ++info.topLastZIndex;
                }
            }
            else {
                // --- 取消置顶 ---
                form.vroot.$data._topMost = false;
                form.vroot.$refs.form.$data.zIndex = ++info.lastZIndex;
            }
            return;
        }
    };
    // --- 挂载 style ---
    if (style) {
        // --- 窗体的 style ---
        dom.pushStyle(opt.taskId, style, 'form', formId);
    }
    // --- 创建 app 对象 ---
    const rtn: {
        'vapp': types.IVApp;
        'vroot': types.IVue;
    } = await new Promise(function(resolve) {
        const vapp = clickgo.vue.createApp({
            'template': layout.replace(/^<cg-form/, '<cg-form ref="form"'),
            'data': function() {
                return tool.clone(data);
            },
            'methods': methods,
            'computed': computed,

            'beforeCreate': beforeCreate,
            'created': function(this: types.IVue) {
                this.access = tool.clone(access);
                created?.call(this);
            },
            'beforeMount': beforeMount,
            'mounted': async function(this: types.IVue) {
                await this.$nextTick();
                // --- 判断是否有 icon，对 icon 进行第一次读取 ---
                // --- 为啥要在这搞，因为 form 控件中读取，将可能导致下方的 formCreate 事件获取不到 icon 图标 ---
                // --- 而如果用延迟的方式获取，将可能导致 changeFocus 的窗体焦点事件先于 formCreate 触发 ---
                if (this.$refs.form.icon) {
                    const icon = await fs.getContent(this.$refs.form.icon, {
                        'current': t.current,
                        'files': t.app.files
                    });
                    this.$refs.form.iconDataUrl = (icon instanceof Blob) ? await tool.blob2DataUrl(icon) : '';
                }
                // --- 完成 ---
                resolve({
                    'vapp': vapp,
                    'vroot': this
                });
            },
            'beforeUpdate': beforeUpdate,
            'updated': updated,
            'beforeUnmount': beforeUnmount,
            'unmounted': unmounted
        });
        vapp.config.errorHandler = function(err: Error, vm: types.IVue, info: string): void {
            notify({
                'title': 'Runtime Error',
                'content': `Message: ${err.message}\nTask id: ${vm.taskId}\nForm id: ${vm.formId}`,
                'type': 'danger'
            });
            core.trigger('error', vm.taskId, vm.formId, err, info + '(-3,' + vm.taskId + ',' + vm.formId + ')');
        };
        // --- 挂载控件对象到 vapp ---
        for (const key in components) {
            vapp.component(key, components[key]);
        }
        try {
            vapp.mount(el);
        }
        catch (err: any) {
            notify({
                'title': 'Runtime Error',
                'content': `Message: ${err.message}\nTask id: ${opt.taskId}\nForm id: ${formId}`,
                'type': 'danger'
            });
            core.trigger('error', opt.taskId, formId, err, err.message + '(-2)');
        }
    });
    // --- 创建 form 信息对象 ---
    const nform: types.IForm = {
        'id': formId,
        'vapp': rtn.vapp,
        'vroot': rtn.vroot
    };
    // --- 挂载 form ---
    t.forms[formId] = nform;
    // --- 执行 mounted ---
    await tool.sleep(34);
    if (mounted) {
        try {
            await mounted.call(rtn.vroot, opt.data);
        }
        catch (err: any) {
            core.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error.');
            t.forms[formId] = undefined as any;
            delete t.forms[formId];
            rtn.vapp.unmount();
            rtn.vapp._container.remove();
            dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
            return -8;
        }
    }
    // --- 触发 formCreated 事件 ---
    core.trigger('formCreated', opt.taskId, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconDataUrl);
    // --- 判断是否要与 native 实体窗体大小同步 ---
    if (clickgo.isNative() && (formId === 1) && !clickgo.isImmersion() && !clickgo.hasFrame()) {
        rtn.vroot.$refs.form.isNativeSync = true;
        native.invoke('cg-set-size', native.getToken(), rtn.vroot.$refs.form.$el.offsetWidth, rtn.vroot.$refs.form.$el.offsetHeight);
        window.addEventListener('resize', function(): void {
            rtn.vroot.$refs.form.setPropData('width', window.innerWidth);
            rtn.vroot.$refs.form.setPropData('height', window.innerHeight);
        });
    }
    return formId;
}

/**
 * --- 显示一个 dialog ---
 * @param opt 选项或者一段文字
 */
export function dialog(opt: string | types.IFormDialogOptions): Promise<string> {
    return new Promise(function(resolve) {
        if (typeof opt === 'string') {
            opt = {
                'content': opt
            };
        }
        const nopt = opt;
        const taskId = nopt.taskId;
        if (!taskId) {
            resolve('');
            return;
        }
        const t = task.list[taskId];
        if (!t) {
            resolve('');
            return;
        }
        const locale = t.locale.lang || core.config.locale;
        if (nopt.buttons === undefined) {
            nopt.buttons = [info.locale[locale]?.ok ?? info.locale['en'].ok];
        }
        const cls = class extends AbstractForm {
            public buttons = nopt.buttons;

            public get taskId(): number {
                return taskId;
            }

            public select(button: string): void {
                const event = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    }
                };
                nopt.select?.(event as unknown as Event, button);
                if (event.go) {
                    this.dialogResult = button;
                    close(this.formId);
                }
            }
        };
        cls.create(undefined, `<form title="${nopt.title ?? 'dialog'}" min="false" max="false" resize="false" height="0" border="${nopt.title ? 'normal' : 'plain'}" direction="v"><dialog :buttons="buttons" @select="select"${nopt.direction ? ` direction="${nopt.direction}"` : ''}>${nopt.content}</dialog></form>`).then((frm) => {
            if (typeof frm === 'number') {
                resolve('');
                return;
            }
            frm.showDialog().then((v) => {
                resolve(v);
            }).catch(() => {
                resolve('');
            });
        }).catch(() => {
            resolve('');
        });
    });
}

/**
 * --- 显示一个 confirm ---
 * @param opt 选项或者一段文字
 */
export async function confirm(opt: string | types.IFormConfirmOptions): Promise<boolean | number> {
    if (typeof opt === 'string') {
        opt = {
            'content': opt
        };
    }
    const taskId = opt.taskId;
    if (!taskId) {
        return false;
    }
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    const locale = t.locale.lang || core.config.locale;
    const buttons = [info.locale[locale]?.yes ?? info.locale['en'].yes, info.locale[locale]?.no ?? info.locale['en'].no];
    if (opt.cancel) {
        buttons.push(info.locale[locale]?.cancel ?? info.locale['en'].cancel);
    }
    const res = await dialog({
        'taskId': taskId,

        'content': opt.content,
        'buttons': buttons
    });
    if (res === (info.locale[locale]?.yes ?? info.locale['en'].yes)) {
        return true;
    }
    if (res === (info.locale[locale]?.cancel ?? info.locale['en'].cancel)) {
        return 0;
    }
    return false;
}

/**
 * --- 让窗体闪烁 ---
 * @param formId 要闪烁的窗体 id，必填
 * @param taskId 所属的 taskId，必填，App 模式下仅能闪烁本任务的窗体
 */
export function flash(formId: number, taskId?: number): void {
    if (!taskId) {
        return;
    }
    const form = getForm(taskId, formId);
    if (!form) {
        return;
    }
    if (!form.vroot._formFocus) {
        changeFocus(form.id);
    }
    if (form.vroot.$refs.form.flashTimer) {
        clearTimeout(form.vroot.$refs.form.flashTimer);
        form.vroot.$refs.form.flashTimer = undefined;
    }
    form.vroot.$refs.form.flashTimer = setTimeout(() => {
        if (form.vroot.$refs.form) {
            form.vroot.$refs.form.flashTimer = undefined;
        }
    }, 1000);
    // --- 触发 formFlash 事件 ---
    core.trigger('formFlash', taskId, formId);
}

/**
 * --- 显示 launcher 界面 ---
 */
export function showLauncher(): void {
    elements.launcher.style.display = 'flex';
    requestAnimationFrame(function() {
        elements.launcher.classList.add('cg-show');
    });
}

/**
 * --- 隐藏 launcher 界面 ---
 */
export function hideLauncher(): void {
    elements.launcher.classList.remove('cg-show');
    setTimeout(function() {
        if (launcherRoot.folderName !== '') {
            launcherRoot.closeFolder();
        }
        launcherRoot.name = '';
        elements.launcher.style.display = 'none';
    }, 300);
}

// --- 绑定 resize 事件 ---
window.addEventListener('resize', function(): void {
    // --- 触发 screenResize 事件 ---
    task.refreshSystemPosition(); // 会在里面自动触发 screenResize 事件
});
