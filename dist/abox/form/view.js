export function createViewRuntime(deps) {
    const { lTool, lDom, lControl, notify, componentClass: AbstractComponent } = deps;
    const preparedViewCache = new WeakMap();
    async function prepareView(task, path, layout, style) {
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
        const preparing = (async () => {
            let prep = '';
            if (style) {
                const r = lTool.stylePrepend(style);
                prep = r.prep;
                style = await lTool.styleUrl2DataUrl(path + '/', r.style, (filePath) => task.app.package.getContent(filePath));
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
    async function buildLocalComponents(task, formId, findex, componentClasses, panelId, chain = []) {
        const rtn = {};
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
            const childComponents = await buildLocalComponents(task, formId, findex, component.components, panelId, [...chain, cls]);
            for (const childName in childComponents) {
                if (controls[childName]) {
                    throw new Error(`The component name conflicts with a control.\nName: ${childName.slice(3)}`);
                }
                controls[childName] = childComponents[childName];
            }
            const props = {};
            for (const key in component.props) {
                const val = component.props[key];
                props[key] = {
                    'default': (val !== null) && (typeof val === 'object') ? () => lTool.clone(val) : val
                };
            }
            const idata = {};
            let access = null;
            for (const item of Object.entries(component)) {
                if (['components', 'emits', 'packageFiles', 'props', 'slots'].includes(item[0])) {
                    continue;
                }
                if (item[0] === 'access') {
                    access = item[1];
                    continue;
                }
                idata[item[0]] = item[1];
            }
            const prot = lTool.getClassPrototype(component);
            const methods = prot.method;
            const computed = prot.access;
            computed.controlName = {
                get: function () {
                    return name;
                },
                set: function () {
                    notify({
                        'title': 'Error',
                        'content': `The software tries to modify the system variable "controlName".\nComponent: ${name}`,
                        'type': 'danger'
                    });
                }
            };
            computed.taskId = {
                get: function () {
                    return task.id;
                },
                set: function () {
                    notify({
                        'title': 'Error',
                        'content': `The software tries to modify the system variable "taskId".\nComponent: ${name}`,
                        'type': 'danger'
                    });
                }
            };
            computed.formId = {
                get: function () {
                    return formId;
                },
                set: function () {
                    notify({
                        'title': 'Error',
                        'content': `The software tries to modify the system variable "formId".\nComponent: ${name}`,
                        'type': 'danger'
                    });
                }
            };
            computed.findex = {
                get: function () {
                    return findex;
                },
                set: function () {
                    notify({
                        'title': 'Error',
                        'content': `The software tries to modify the system variable "findex".\nComponent: ${name}`,
                        'type': 'danger'
                    });
                }
            };
            computed.path = {
                get: function () {
                    return path;
                },
                set: function () {
                    notify({
                        'title': 'Error',
                        'content': `The software tries to modify the system variable "path".\nComponent: ${name}`,
                        'type': 'danger'
                    });
                }
            };
            computed.prep = {
                get: function () {
                    return prepared.prep;
                },
                set: function () {
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
                'data': function () {
                    return lTool.clone(idata);
                },
                'methods': methods,
                'computed': computed,
                beforeCreate: hasBeforeCreate ? methods.onBeforeCreate : undefined,
                created: function () {
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
                mounted: hasMounted ? async function () {
                    await this.$nextTick();
                    await this.onMounted();
                } : undefined,
                beforeUpdate: hasBeforeUpdate ? methods.onBeforeUpdate : undefined,
                updated: hasUpdated ? async function () {
                    await this.$nextTick();
                    await this.onUpdated();
                } : undefined,
                beforeUnmount: hasBeforeUnmount ? methods.onBeforeUnmount : undefined,
                unmounted: hasUnmounted ? async function () {
                    await this.$nextTick();
                    await this.onUnmounted();
                } : undefined
            };
        }
        return rtn;
    }
    return { prepareView, buildLocalComponents };
}
