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
import * as clickgo from '../../clickgo';
import * as lCore from '../core';
import * as lCommand from '../command';
import * as lTask from '../task';
import * as lTool from '../tool';
import * as lDom from '../dom';
import * as lControl from '../control';
import * as lFs from '../fs';
import * as lNative from '../native';
import { AbstractForm } from './abstract-form';
import { AbstractPanel } from './abstract-panel';
import { state, info } from './state';
import { elements, refreshLocaleDirection } from './system';
import { changeFocus } from './window';
import { notify } from './notification';
import { confirm } from './dialog';
import { prepareView, buildLocalComponents } from './view';
import { cleanupPop } from './popup';
/**
 * --- 创建 panel 对象，一般情况下无需使用 ---
 * @param rootPanel 根 panel 控件
 * @param cls 路径字符串或 AbstractPanel 类
 * @param opt 选项
 */
export async function createPanel(rootPanel, cls, opt = {}) {
    if (rootPanel.element.dataset.cgControl !== 'panel') {
        const err = new Error('form.createPanel: -0');
        lCore.trigger('error', '', '', err, err.message).catch(() => { });
        throw err;
    }
    const formWrap = lDom.findParentByData(rootPanel.element, 'form-id');
    if (!formWrap) {
        const err = new Error('form.createPanel: -0');
        lCore.trigger('error', '', '', err, err.message).catch(() => { });
        throw err;
    }
    const formId = formWrap.dataset.formId;
    /** --- 当前的 task 对象 --- */
    const t = lTask.getOrigin(rootPanel.taskId);
    if (!t || t.ending) {
        const err = new Error('form.createPanel: -1');
        lCore.trigger('error', '', '', err, err.message).catch(() => { });
        throw err;
    }
    /** --- 布局内容 --- */
    let layout = '';
    if (opt.layout) {
        layout = opt.layout;
    }
    /** --- 样式内容 --- */
    let style = '';
    /** --- 样式前缀 --- */
    let prep = '';
    if (opt.style) {
        style = opt.style;
    }
    /** --- 文件在包内的路径，不以 / 结尾 --- */
    let filename = '';
    if (typeof cls === 'string') {
        filename = lTool.urlResolve(opt.path ?? '/', cls) + '.js';
        if (!layout) {
            const l = await t.app.package.getContent(filename.slice(0, -3) + '.xml');
            if (typeof l !== 'string') {
                const err = new Error('form.createPanel: -2');
                lCore.trigger('error', '', '', err, err.message).catch(() => { });
                throw err;
            }
            layout = l;
        }
        if (!style) {
            const s = await t.app.package.getContent(filename.slice(0, -3) + '.css');
            if (typeof s === 'string') {
                style = s;
            }
        }
        cls = class extends AbstractPanel {
            get filename() {
                return filename;
            }
        };
    }
    if (lTask.getOrigin(t.id) !== t || t.ending) {
        throw new Error('form.createPanel: task removed');
    }
    // --- 申请 panelId ---
    const panelId = lTool.random(8, lTool.RANDOM_LUN);
    let mountedApp;
    try {
        // --- 其实后面会重写 taskId，这里先提前赋值一下，以使初始化时就能知道 taskId  ---
        Object.defineProperty(cls.prototype, 'taskId', {
            get: () => t.id,
            'configurable': true,
        });
        /** --- 要新建的 panel 类对象 --- */
        const panel = new cls();
        if (!filename) {
            filename = panel.filename;
        }
        const path = filename.slice(0, filename.lastIndexOf('/'));
        // --- 布局 ---
        if (!layout) {
            const l = await t.app.package.getContent(filename.slice(0, -2) + 'xml');
            if (typeof l !== 'string') {
                const err = new Error('form.createPanel: -3');
                lCore.trigger('error', '', '', err, err.message).catch(() => { });
                throw err;
            }
            layout = l;
        }
        // --- 样式 ---
        if (!style) {
            const s = await t.app.package.getContent(filename.slice(0, -2) + 'css');
            if (typeof s === 'string') {
                style = s;
            }
        }
        const prepared = await prepareView(t, path, layout, style);
        if (lTask.getOrigin(t.id) !== t || t.ending || !t.forms[formId] || t.forms[formId].closed
            || !formWrap.contains(rootPanel.element)) {
            throw new Error('form.createPanel: host removed');
        }
        layout = prepared.layout;
        style = prepared.style;
        prep = prepared.prep;
        // --- 给 teleport 做处理 ---
        if (layout.includes('<teleport')) {
            layout = lTool.teleportGlue(layout, formId);
            layout = layout.replaceAll(' data-cg-pop data-cg-pop-none', ` data-cg-panel-owner="${panelId}" data-cg-pop data-cg-pop-none`);
        }
        // --- 获取要定义的控件列表 ---
        const components = lControl.buildComponents(t.id, formId, path);
        if (!components) {
            const err = new Error('form.createPanel: -4');
            lCore.trigger('error', '', '', err, err.message).catch(() => { });
            throw err;
        }
        const localComponents = await buildLocalComponents(t, formId, t.forms[formId].vroot.findex, panel.components, panelId);
        for (const name in localComponents) {
            if (components[name]) {
                throw new Error(`The component name conflicts with a control.\nName: ${name.slice(3)}`);
            }
            components[name] = localComponents[name];
        }
        /** --- class 对象类的属性列表 --- */
        const idata = {};
        const cdata = Object.entries(panel);
        for (const item of cdata) {
            if (item[0] === 'components') {
                continue;
            }
            if (item[0] === 'access') {
                // --- access 属性不放在 data 当中 ---
                continue;
            }
            idata[item[0]] = item[1];
        }
        /** --- class 对象的方法和 getter/setter 列表 --- */
        const prot = lTool.getClassPrototype(panel);
        const methods = prot.method;
        const computed = prot.access;
        computed.taskId = {
            get: function () {
                return t.id;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "taskId".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.formId = {
            get: function () {
                return formId;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "formId".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.panelId = {
            get: function () {
                return panelId;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "panelId".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.path = {
            get: function () {
                return path;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "path".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.prep = {
            get: function () {
                return prep;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "prep".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.rootForm = {
            get: function () {
                return t.forms[formId].vroot;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "rootForm".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.rootPanel = {
            get: function () {
                return rootPanel;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "rootPanel".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        if (lTask.getOrigin(t.id) !== t || t.ending || !t.forms[formId] || t.forms[formId].closed
            || !formWrap.contains(rootPanel.element)) {
            throw new Error('form.createPanel: host removed');
        }
        // --- 插入 dom ---
        rootPanel.element.insertAdjacentHTML('beforeend', `<div data-panel-id="${panelId}"></div>`);
        if (style) {
            lDom.pushStyle(t.id, style, 'form', formId, panelId);
        }
        /** --- panel wrap element 对象 --- */
        const mel = rootPanel.element.children.item(rootPanel.element.children.length - 1);
        mel.style.position = 'absolute';
        /*
    mel.style.pointerEvents = 'none';
    mel.style.opacity = '0';
    */
        mel.style.display = 'none';
        // --- 创建 app 对象 ---
        const rtn = await new Promise(function (resolve, reject) {
            const vapp = clickgo.modules.vue.createApp({
                'template': layout.replace(/^<cg-panel([\s\S]+)-panel>$/, '<cg-layout$1-layout>'),
                'data': function () {
                    return lTool.clone(idata);
                },
                'methods': methods,
                'computed': computed,
                'beforeCreate': panel.onBeforeCreate,
                'created': function () {
                    if (panel.access) {
                        this.access = lTool.clone(panel.access);
                    }
                    this.onCreated();
                },
                'beforeMount': function () {
                    this.onBeforeMount();
                },
                'mounted': async function () {
                    try {
                        await this.$nextTick();
                        if (lTask.getOrigin(t.id) !== t || t.ending) {
                            throw new Error('form.createPanel: task removed');
                        }
                        mel.children.item(0).style.flex = '1';
                        // --- 完成 ---
                        resolve({
                            'vapp': vapp,
                            'vroot': this,
                        });
                    }
                    catch (err) {
                        reject(err);
                    }
                },
                'beforeUpdate': function () {
                    this.onBeforeUpdate();
                },
                'updated': async function () {
                    await this.$nextTick();
                    this.onUpdated();
                },
                'beforeUnmount': function () {
                    lCommand.clearOwner(t.id, formId, panelId);
                    this.onBeforeUnmount();
                },
                'unmounted': async function () {
                    await this.$nextTick();
                    lCommand.clearOwner(t.id, formId, panelId);
                    this.onUnmounted();
                }
            });
            vapp.config.errorHandler = function (err, instance, info) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\nTask id: ${instance?.taskId ?? ''}\nForm id: ${instance?.formId ?? ''}`,
                    'type': 'danger'
                });
                console.error('Runtime Error [form.createPanel.errorHandler]', `Message: ${err.message}\nTask id: ${instance?.taskId ?? ''}\nForm id: ${instance?.formId ?? ''}`, err, info);
                lCore.trigger('error', instance?.taskId ?? '', instance?.formId ?? '', err, info + '(-3,' + (instance?.taskId ?? '') + ',' + (instance?.formId ?? '') + ')').catch(() => { });
            };
            mountedApp = vapp;
            // --- 挂载控件对象到 vapp ---
            for (const key in components) {
                vapp.component(key, components[key]);
            }
            try {
                vapp.mount(mel);
            }
            catch (err) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`,
                    'type': 'danger'
                });
                console.error('Runtime Error [form.createPanel.mount]', `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`, err);
                lCore.trigger('error', t.id, formId, err, err.message).catch(() => { });
                reject(err);
            }
        });
        // --- 等待子控件完成首次挂载，确保 panel mounted 修改的数据能被控件监听到 ---
        await lTool.nextFrame();
        if (lTask.getOrigin(t.id) !== t || t.ending || !t.forms[formId] || t.forms[formId].closed
            || !formWrap.contains(rootPanel.element)) {
            throw new Error('form.createPanel: host removed');
        }
        try {
            await panel.onMounted.call(rtn.vroot);
        }
        catch (err) {
            lCore.trigger('error', t.id, formId, err, 'Create panel mounted error: -5.').catch(() => { });
            throw err;
        }
        if (lTask.getOrigin(t.id) !== t || t.ending || !t.forms[formId] || t.forms[formId].closed
            || !formWrap.contains(rootPanel.element)) {
            throw new Error('form.createPanel: host removed');
        }
        return {
            'id': panelId,
            'vapp': rtn.vapp,
            'vroot': rtn.vroot
        };
    }
    catch (err) {
        lCommand.clearOwner(t.id, formId, panelId);
        const panelElement = rootPanel.element.querySelector('[data-panel-id="' + panelId + '"]');
        if (panelElement) {
            cleanupPop(panelElement);
        }
        const formPop = elements.popList.querySelector('[data-form-id="' + formId + '"]');
        for (const pop of formPop?.querySelectorAll('[data-cg-panel-owner="' + panelId + '"]') ?? []) {
            cleanupPop(pop);
        }
        if (mountedApp) {
            try {
                mountedApp.unmount();
            }
            catch { /* Mount may not have completed. */ }
        }
        rootPanel.element.querySelector('[data-panel-id="' + panelId + '"]')?.remove();
        lDom.removeStyle(t.id, 'form', formId, panelId);
        lDom.clearWatchStyle(formId, panelId);
        lDom.clearWatchProperty(formId, panelId);
        lDom.clearWatchPosition(formId, panelId);
        throw err;
    }
}
/**
 * --- 创建一个窗体 ---
 * @param current 当前任务 ID
 * @param cls 路径字符串或 AbstractForm 类
 * @param data 要传递的对象
 * @param opt 其他替换选项
 */
export async function create(current, cls, data, opt = {}) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    /** --- 当前的 task 对象 --- */
    const t = lTask.getOrigin(current);
    if (!t || t.ending) {
        const err = new Error('form.create: -1');
        lCore.trigger('error', '', '', err, err.message).catch(() => { });
        throw err;
    }
    /** --- 布局内容 --- */
    let layout = '';
    if (opt.layout) {
        layout = opt.layout;
    }
    /** --- 样式内容 --- */
    let style = '';
    /** --- 样式前缀 --- */
    let prep = '';
    if (opt.style) {
        style = opt.style;
    }
    /** --- 文件在包内的路径，不以 / 结尾 --- */
    let filename = '';
    if (typeof cls === 'string') {
        filename = lTool.urlResolve(opt.path ?? '/', cls);
        if (!layout) {
            const l = await t.app.package.getContent(filename + '.xml');
            if (typeof l !== 'string') {
                const err = new Error('form.create: -2');
                lCore.trigger('error', '', '', err, err.message).catch(() => { });
                throw err;
            }
            layout = l;
        }
        if (!style) {
            const s = await t.app.package.getContent(filename + '.css');
            if (typeof s === 'string') {
                style = s;
            }
        }
        filename += '.js';
        cls = class extends AbstractForm {
            get filename() {
                return filename;
            }
        };
    }
    if (lTask.getOrigin(t.id) !== t || t.ending) {
        throw new Error('form.create: task removed');
    }
    // --- 申请 formId ---
    const formId = lTool.random(8, lTool.RANDOM_LUN);
    let mountedApp;
    try {
        const findex = ++state.index;
        // --- 其实后面会重写 taskId，这里先提前赋值一下，以使初始化时就能知道 taskId  ---
        Object.defineProperty(cls.prototype, 'taskId', {
            get: () => t.id,
            'configurable': true,
        });
        /** --- 要新建的窗体类对象 --- */
        const frm = new cls();
        if (!filename) {
            filename = frm.filename;
        }
        const path = filename.slice(0, filename.lastIndexOf('/'));
        // --- 布局 ---
        if (!layout) {
            const l = await t.app.package.getContent(filename.slice(0, -2) + 'xml');
            if (typeof l !== 'string') {
                const err = new Error('form.create: -3');
                lCore.trigger('error', '', '', err, err.message).catch(() => { });
                throw err;
            }
            layout = l;
        }
        // --- 样式 ---
        if (!style) {
            const s = await t.app.package.getContent(filename.slice(0, -2) + 'css');
            if (typeof s === 'string') {
                style = s;
            }
        }
        const prepared = await prepareView(t, path, layout, style);
        if (lTask.getOrigin(t.id) !== t || t.ending) {
            throw new Error('form.create: task removed');
        }
        layout = prepared.layout;
        style = prepared.style;
        prep = prepared.prep;
        // --- 给 teleport 做处理 ---
        if (layout.includes('<teleport')) {
            layout = lTool.teleportGlue(layout, formId);
        }
        // --- 获取要定义的控件列表 ---
        const components = lControl.buildComponents(t.id, formId, path);
        if (!components) {
            const err = new Error('form.create: -4');
            lCore.trigger('error', '', '', err, err.message).catch(() => { });
            throw err;
        }
        const localComponents = await buildLocalComponents(t, formId, findex, frm.components);
        for (const name in localComponents) {
            if (components[name]) {
                throw new Error(`The component name conflicts with a control.\nName: ${name.slice(3)}`);
            }
            components[name] = localComponents[name];
        }
        /** --- class 对象类的属性列表 --- */
        const idata = {};
        const cdata = Object.entries(frm);
        for (const item of cdata) {
            if (item[0] === 'components') {
                continue;
            }
            if (item[0] === 'access') {
                // --- access 属性不放在 data 当中 ---
                continue;
            }
            idata[item[0]] = item[1];
        }
        idata._formFocus = false;
        // --- 判断是否是 native 且无边框的第一个窗体 ---
        if (clickgo.isNative() && (findex === 0) && !clickgo.hasFrame()) {
            idata.isNativeNoFrameFirst = true;
        }
        /** --- class 对象的方法和 getter/setter 列表 --- */
        const prot = lTool.getClassPrototype(frm);
        const methods = prot.method;
        const computed = prot.access;
        computed.findex = {
            get: function () {
                return findex;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "findex".\nPath: ${this.filename}`,
                    'type': 'danger',
                });
                return;
            }
        };
        computed.taskId = {
            get: function () {
                return t.id;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "taskId".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.formId = {
            get: function () {
                return formId;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "formId".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.path = {
            get: function () {
                return path;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "path".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.prep = {
            get: function () {
                return prep;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "prep".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        // --- 是否在底层的窗体 ---
        idata._bottomMost = false;
        computed.bottomMost = {
            get: function () {
                return this._bottomMost;
            },
            set: function (v) {
                if (v) {
                    // --- 置底 ---
                    this._bottomMost = true;
                    this.$el.dataset.cgBottomMost = '';
                    if (this._topMost) {
                        this._topMost = false;
                    }
                    this.$refs.form.$data.zIndex = ++info.bottomLastZIndex;
                }
                else {
                    // --- 取消置底 ---
                    this._bottomMost = false;
                    this.$el.removeAttribute('data-cg-bottom-most');
                    this.$refs.form.$data.zIndex = ++info.lastZIndex;
                }
            }
        };
        // --- 是否在顶层的窗体 ---
        idata._topMost = false;
        computed.topMost = {
            get: function () {
                return this._topMost;
            },
            set: function (v) {
                if (v) {
                    // --- 置顶 ---
                    this._topMost = true;
                    if (this._bottomMost) {
                        this._bottomMost = false;
                        this.$el.removeAttribute('data-cg-bottom-most');
                    }
                    if (!this._formFocus) {
                        changeFocus(this.formId).catch(() => { });
                    }
                    else {
                        this.$refs.form.$data.zIndex = ++info.topLastZIndex;
                    }
                }
                else {
                    // --- 取消置顶 ---
                    this._topMost = false;
                    this.$refs.form.$data.zIndex = ++info.lastZIndex;
                }
            }
        };
        // --- 获取和设置 form hash ---
        idata._historyHash = [];
        idata._formHash = '';
        computed.formHash = {
            get: function () {
                return this._formHash;
            },
            set: function (v) {
                if (v === this._formHash) {
                    return;
                }
                if (Date.now() - this._lastFormHashData > 300) {
                    this._formHashData = {};
                }
                if (this.inStep) {
                    // --- 在 step 中，要判断 step 是否正确 ---
                    (async () => {
                        if (this._stepValues.includes(v)) {
                            this.$refs.form.stepValue = v;
                        }
                        else {
                            // --- 不应该 ---
                            if (!await confirm(current, {
                                'content': info.locale[this.locale]?.confirmExitStep ?? info.locale['en'].confirmExitStep
                            })) {
                                return;
                            }
                            // --- 退出了 ---
                            this._inStep = false;
                            this.$refs.form.stepHide();
                        }
                        if (this._formHash) {
                            this._historyHash.push(this._formHash);
                        }
                        this._formHash = v;
                        lCore.trigger('formHashChange', t.id, formId, v, this._formHashData).catch(() => { });
                    })();
                    return;
                }
                if (this._formHash) {
                    this._historyHash.push(this._formHash);
                }
                this._formHash = v;
                lCore.trigger('formHashChange', t.id, formId, v, this._formHashData).catch(() => { });
            }
        };
        // --- 获取和设置 form hash with data 的数据 ---
        idata._lastFormHashData = 0;
        idata._formHashData = {};
        computed.formHashData = {
            get: function () {
                return this._formHashData;
            },
            set: function (v) {
                this._formHashData = v;
                this._lastFormHashData = Date.now();
            }
        };
        // --- 当前窗体是否显示在任务栏 ---
        idata._showInSystemTask = true;
        computed.showInSystemTask = {
            get: function () {
                return this._showInSystemTask;
            },
            set: function (v) {
                this._showInSystemTask = v;
                lCore.trigger('formShowInSystemTaskChange', t.id, formId, v).catch(() => { });
            }
        };
        // --- ready 方法 ---
        const cbs = [];
        methods.ready = function (cb) {
            if (this.isReady) {
                cb();
                return;
            }
            cbs.push(cb);
        };
        if (lTask.getOrigin(t.id) !== t || t.ending) {
            throw new Error('form.create: task removed');
        }
        // --- 插入 dom ---
        elements.list.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId}" data-task-id="${t.id}"></div>`);
        elements.popList.insertAdjacentHTML('beforeend', `<div data-form-id="${formId}" data-task-id="${t.id}"></div>`);
        refreshLocaleDirection(t.id);
        if (style) {
            lDom.pushStyle(t.id, style, 'form', formId);
        }
        /** --- form wrap element 对象 --- */
        const el = elements.list.children.item(elements.list.children.length - 1);
        // --- 创建 app 对象 ---
        const rtn = await new Promise(function (resolve, reject) {
            const vapp = clickgo.modules.vue.createApp({
                'template': layout.replace(/^<cg-form/, '<cg-form ref="form"'),
                'data': function () {
                    return lTool.clone(idata);
                },
                'methods': methods,
                'computed': computed,
                'beforeCreate': frm.onBeforeCreate,
                'created': function () {
                    if (frm.access) {
                        this.access = lTool.clone(frm.access);
                    }
                    this.onCreated();
                },
                'beforeMount': function () {
                    this.onBeforeMount();
                },
                'mounted': async function () {
                    try {
                        await this.$nextTick();
                        if (lTask.getOrigin(t.id) !== t || t.ending) {
                            throw new Error('form.create: task removed');
                        }
                        // --- 判断是否有 icon，对 icon 进行第一次读取 ---
                        // --- 为啥要在这搞，因为 form 控件中读取，将可能导致下方的 formCreate 事件获取不到 icon 图标 ---
                        // --- 而如果用延迟的方式获取，将可能导致 changeFocus 的窗体焦点事件先于 formCreate 触发 ---
                        if (this.$refs.form.icon) {
                            const icon = await lFs.getContent(current, this.$refs.form.icon);
                            const iconDataUrl = (icon instanceof Blob) ? await lTool.blob2DataUrl(icon) : '';
                            if (lTask.getOrigin(t.id) !== t || t.ending) {
                                throw new Error('form.create: task removed');
                            }
                            this.$refs.form.iconDataUrl = iconDataUrl;
                        }
                        // --- 完成 ---
                        resolve({
                            'vapp': vapp,
                            'vroot': this
                        });
                    }
                    catch (err) {
                        reject(err);
                    }
                },
                'beforeUpdate': function () {
                    this.onBeforeUpdate();
                },
                'updated': async function () {
                    await this.$nextTick();
                    this.onUpdated();
                },
                'beforeUnmount': function () {
                    lCommand.clearOwner(t.id, formId);
                    this.onBeforeUnmount();
                },
                'unmounted': async function () {
                    await this.$nextTick();
                    lCommand.clearOwner(t.id, formId);
                    this.onUnmounted();
                }
            });
            vapp.config.errorHandler = function (err, instance, info) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\nTask id: ${instance?.taskId ?? ''}\nForm id: ${instance?.formId ?? ''}`,
                    'type': 'danger'
                });
                console.error('Runtime Error [form.create.errorHandler]', `Message: ${err.message}\nTask id: ${instance?.taskId ?? ''}\nForm id: ${instance?.formId ?? ''}`, err, info);
                lCore.trigger('error', instance?.taskId ?? 0, instance?.formId ?? 0, err, info + '(-3,' + instance?.taskId + ',' + instance?.formId + ')').catch(() => { });
            };
            mountedApp = vapp;
            // --- 挂载控件对象到 vapp ---
            for (const key in components) {
                vapp.component(key, components[key]);
            }
            try {
                vapp.mount(el);
            }
            catch (err) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`,
                    'type': 'danger'
                });
                console.error('Runtime Error [form.create.mount]', `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`, err);
                lCore.trigger('error', t.id, formId, err, err.message).catch(() => { });
                reject(err);
            }
        });
        if (lTask.getOrigin(t.id) !== t || t.ending) {
            throw new Error('form.create: task removed');
        }
        // --- 创建 form 信息对象 ---
        const nform = {
            'id': formId,
            'vapp': rtn.vapp,
            'vroot': rtn.vroot,
            'closed': false
        };
        // --- 挂载 form ---
        t.forms[formId] = nform;
        // --- 等待子控件完成首次挂载，确保 form mounted 修改的数据能被控件监听到 ---
        await lTool.nextFrame();
        if (lTask.getOrigin(t.id) !== t || t.ending || t.forms[formId] !== nform || nform.closed) {
            throw new Error('form.create: form removed');
        }
        try {
            await frm.onMounted.call(rtn.vroot, data ?? {});
        }
        catch (err) {
            lCore.trigger('error', t.id, formId, err, 'Create form mounted error: -6.').catch(() => { });
            throw err;
        }
        if (lTask.getOrigin(t.id) !== t || t.ending || t.forms[formId] !== nform || nform.closed) {
            throw new Error('form.create: form removed');
        }
        // --- 触发 formCreated 事件 ---
        lCore.trigger('formCreated', t.id, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconDataUrl, rtn.vroot.showInSystemTask).catch(() => { });
        // --- 若无边框，且是第一个窗体，则先设置一下实体窗体大小 ---
        if (rtn.vroot.isNativeNoFrameFirst) {
            await lNative.invokeSys(state.sysId, 'cg-set-size', rtn.vroot.$refs.form.$el.offsetWidth, rtn.vroot.$refs.form.$el.offsetHeight);
            if (lTask.getOrigin(t.id) !== t || t.ending || t.forms[formId] !== nform || nform.closed) {
                throw new Error('form.create: form removed');
            }
            // --- 然后监听外面窗体的大小来设置里面的窗体 ---
            window.addEventListener('resize', function () {
                rtn.vroot.$refs.form.setPropData('width', window.innerWidth);
                rtn.vroot.$refs.form.setPropData('height', window.innerHeight);
            });
        }
        // --- 完全创建完毕 ---
        rtn.vroot.isReady = true;
        for (const cb of cbs) {
            cb.call(rtn.vroot);
        }
        return rtn.vroot;
    }
    catch (err) {
        if (lTask.getOrigin(t.id) === t && t.forms[formId]?.closed) {
            throw err;
        }
        lCommand.clearOwner(t.id, formId);
        delete t.forms[formId];
        const formElement = elements.list.querySelector('[data-form-id="' + formId + '"]');
        const popElement = elements.popList.querySelector('[data-form-id="' + formId + '"]');
        if (formElement) {
            cleanupPop(formElement);
        }
        if (popElement) {
            cleanupPop(popElement);
        }
        if (mountedApp) {
            try {
                mountedApp.unmount();
            }
            catch { /* Mount may not have completed. */ }
        }
        elements.list.querySelector('[data-form-id="' + formId + '"]')?.remove();
        elements.popList.querySelector('[data-form-id="' + formId + '"]')?.remove();
        lControl.clearComponents(t.id, formId);
        lDom.removeStyle(t.id, 'form', formId);
        lDom.clearWatchStyle(formId);
        lDom.clearWatchProperty(formId);
        lDom.clearWatchPosition(formId);
        lNative.clear(t.id, formId);
        throw err;
    }
}
