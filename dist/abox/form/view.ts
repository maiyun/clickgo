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
import type * as lTask from '../../lib/task';
import type * as lCore from '../../lib/core';
import type { AbstractComponent as ComponentType } from '../../lib/form/abstract-component';
import type { IViewDependencies, IPreparedView } from '../../lib/form/view';

type AbstractComponent = ComponentType;

export function createViewRuntime(deps: IViewDependencies) {
    const { lTool, lDom, lControl, notify, componentClass: AbstractComponent } = deps;
const preparedViewCache = new WeakMap<lTask.ITask, Map<string, Map<string, Map<string, Promise<IPreparedView>>>>>();

async function prepareView(task: lTask.ITask, path: string, layout: string, style: string): Promise<IPreparedView> {
    const styleKey = style;
    let taskCache = preparedViewCache.get(task);
    if (!taskCache) {
        taskCache = new Map();
        preparedViewCache.set(task, taskCache);
    }
    let pathCache = taskCache.get(path);
    if (!pathCache) {
        pathCache = new Map();
        taskCache.set(path, pathCache);
    }
    let layoutCache = pathCache.get(layout);
    if (!layoutCache) {
        layoutCache = new Map();
        pathCache.set(layout, layoutCache);
    }
    const cached = layoutCache.get(styleKey);
    if (cached) {
        return cached;
    }
    const preparing = (async (): Promise<IPreparedView> => {
        let prep = '';
        if (style) {
            const r = lTool.stylePrepend(style);
            prep = r.prep;
            style = await lTool.styleUrl2DataUrl(
                path + '/', r.style, (filePath) => task.app.package.getContent(filePath)
            );
        }
        layout = lTool.purify(layout);
        layout = lTool.layoutAddTagClassAndReTagName(layout, true);
        const prepList = ['cg-task' + task.id + '_'];
        if (prep) {
            prepList.push(prep);
        }
        layout = lTool.layoutClassPrepend(layout, prepList);
        layout = lTool.eventsAttrWrap(layout);
        if (layout.includes('@click="')) {
            layout = layout.replaceAll('@click="', '@tap="');
        }
        return {
            'layout': layout,
            'style': style,
            'prep': prep
        };
    })();
    layoutCache.set(styleKey, preparing);
    try {
        return await preparing;
    }
    catch (err) {
        if (layoutCache.get(styleKey) === preparing) {
            layoutCache.delete(styleKey);
        }
        throw err;
    }
}

async function buildLocalComponents(
    task: lTask.ITask,
    formId: string,
    findex: number,
    componentClasses: Record<string, new () => AbstractComponent>,
    panelId?: string,
    chain: Array<new () => AbstractComponent> = []
): Promise<Record<string, any>> {
    const rtn: Record<string, any> = {};
    for (const name in componentClasses) {
        if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/.test(name)) {
            throw new Error(`The component name must be lowercase kebab-case and contain "-".\nName: ${name}`);
        }
        const cls = componentClasses[name];
        if (chain.includes(cls)) {
            throw new Error(`Circular local component registration.\nName: ${name}`);
        }
        Object.defineProperty(cls.prototype, 'taskId', {
            get: () => task.id,
            'configurable': true,
        });
        const component = new cls();
        const filename = component.filename;
        if (!filename) {
            throw new Error(`The component filename is empty.\nName: ${name}`);
        }
        const path = filename.slice(0, filename.lastIndexOf('/'));
        const layoutSource = await task.app.package.getContent(filename.slice(0, -2) + 'xml');
        if (typeof layoutSource !== 'string') {
            throw new Error(`The component layout was not found.\nFile: ${filename.slice(0, -2)}xml`);
        }
        const styleSource = await task.app.package.getContent(filename.slice(0, -2) + 'css');
        const prepared = await prepareView(task, path, layoutSource, typeof styleSource === 'string' ? styleSource : '');
        let layout = prepared.layout;
        if (layout.includes('<teleport')) {
            layout = lTool.teleportGlue(layout, formId);
            if (panelId) {
                layout = layout.replaceAll(' data-cg-pop data-cg-pop-none', ` data-cg-panel-owner="${panelId}" data-cg-pop data-cg-pop-none`);
            }
        }
        if (prepared.style) {
            lDom.pushStyle(task.id, prepared.style, 'form', formId, panelId);
        }
        const controls = lControl.buildComponents(task.id, formId, path);
        if (!controls) {
            throw new Error(`Build controls failed.\nComponent: ${name}`);
        }
        const childComponents = await buildLocalComponents(
            task,
            formId,
            findex,
            component.components,
            panelId,
            [...chain, cls]
        );
        for (const childName in childComponents) {
            if (controls[childName]) {
                throw new Error(`The component name conflicts with a control.\nName: ${childName.slice(3)}`);
            }
            controls[childName] = childComponents[childName];
        }

        const props: Record<string, { 'default': unknown | (() => unknown); }> = {};
        for (const key in component.props) {
            const val = (component.props as Record<string, unknown>)[key];
            props[key] = {
                'default': (val !== null) && (typeof val === 'object') ? (): unknown => lTool.clone(val) : val
            };
        }
        const idata: Record<string, unknown> = {};
        let access: Record<string, unknown> | null = null;
        for (const item of Object.entries(component)) {
            if (['components', 'emits', 'packageFiles', 'props', 'slots'].includes(item[0])) {
                continue;
            }
            if (item[0] === 'access') {
                access = item[1] as Record<string, unknown>;
                continue;
            }
            idata[item[0]] = item[1];
        }
        const prot = lTool.getClassPrototype(component);
        const methods = prot.method;
        const computed = prot.access;
        computed.controlName = {
            get: function(): string {
                return name;
            },
            set: function(): void {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "controlName".\nComponent: ${name}`,
                    'type': 'danger'
                });
            }
        };
        computed.taskId = {
            get: function(): string {
                return task.id;
            },
            set: function(): void {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "taskId".\nComponent: ${name}`,
                    'type': 'danger'
                });
            }
        };
        computed.formId = {
            get: function(): string {
                return formId;
            },
            set: function(): void {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "formId".\nComponent: ${name}`,
                    'type': 'danger'
                });
            }
        };
        computed.findex = {
            get: function(): number {
                return findex;
            },
            set: function(): void {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "findex".\nComponent: ${name}`,
                    'type': 'danger'
                });
            }
        };
        computed.path = {
            get: function(): string {
                return path;
            },
            set: function(): void {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "path".\nComponent: ${name}`,
                    'type': 'danger'
                });
            }
        };
        computed.prep = {
            get: function(): string {
                return prepared.prep;
            },
            set: function(): void {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "prep".\nComponent: ${name}`,
                    'type': 'danger'
                });
            }
        };

        const hasBeforeCreate = methods.onBeforeCreate !== AbstractComponent.prototype.onBeforeCreate;
        const hasCreated = methods.onCreated !== AbstractComponent.prototype.onCreated;
        const hasBeforeMount = methods.onBeforeMount !== AbstractComponent.prototype.onBeforeMount;
        const hasMounted = methods.onMounted !== AbstractComponent.prototype.onMounted;
        const hasBeforeUpdate = methods.onBeforeUpdate !== AbstractComponent.prototype.onBeforeUpdate;
        const hasUpdated = methods.onUpdated !== AbstractComponent.prototype.onUpdated;
        const hasBeforeUnmount = methods.onBeforeUnmount !== AbstractComponent.prototype.onBeforeUnmount;
        const hasUnmounted = methods.onUnmounted !== AbstractComponent.prototype.onUnmounted;
        rtn['cg-' + name] = {
            'template': layout,
            'components': controls,
            'props': props,
            'emits': component.emits,
            'data': function(): Record<string, unknown> {
                return lTool.clone(idata);
            },
            'methods': methods,
            'computed': computed,
            beforeCreate: hasBeforeCreate ? methods.onBeforeCreate : undefined,
            created: function(this: lCore.IVue): void {
                this.props = this.$props;
                this.slots = this.$slots;
                if (access) {
                    this.access = lTool.clone(access);
                }
                if (hasCreated) {
                    this.onCreated();
                }
            },
            beforeMount: hasBeforeMount ? methods.onBeforeMount : undefined,
            mounted: hasMounted ? async function(this: lCore.IVue): Promise<void> {
                await this.$nextTick();
                await this.onMounted();
            } : undefined,
            beforeUpdate: hasBeforeUpdate ? methods.onBeforeUpdate : undefined,
            updated: hasUpdated ? async function(this: lCore.IVue): Promise<void> {
                await this.$nextTick();
                await this.onUpdated();
            } : undefined,
            beforeUnmount: hasBeforeUnmount ? methods.onBeforeUnmount : undefined,
            unmounted: hasUnmounted ? async function(this: lCore.IVue): Promise<void> {
                await this.$nextTick();
                await this.onUnmounted();
            } : undefined
        };
    }
    return rtn;
}


return { prepareView, buildLocalComponents };
}
