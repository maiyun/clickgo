"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.read = void 0;
const core = require("./core");
const zip = require("./zip");
const tool = require("./tool");
const task = require("./task");
const dom = require("./dom");
const form = require("./form");
function read(blob) {
    return __awaiter(this, void 0, void 0, function* () {
        const z = yield zip.get(blob);
        if (!z) {
            return false;
        }
        const controlPkg = {};
        let controlProcessed = 0;
        const controls = z.readDir();
        yield new Promise(function (resolve) {
            const controlCb = function () {
                ++controlProcessed;
                if (controlProcessed < controls.length) {
                    return;
                }
                resolve();
            };
            for (const control of controls) {
                if (control.isFile) {
                    controlCb();
                    continue;
                }
                z.getContent('/' + control.name + '/config.json').then(function (configContent) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!configContent) {
                            controlCb();
                            return;
                        }
                        const config = JSON.parse(configContent);
                        const files = {};
                        const filesLength = Object.keys(config.files).length;
                        let fileLoadedLength = 0;
                        yield new Promise(function (resolve) {
                            const loadedCb = function () {
                                ++fileLoadedLength;
                                if (fileLoadedLength < filesLength) {
                                    return;
                                }
                                resolve();
                            };
                            for (const file of config.files) {
                                const mime = tool.getMimeByPath(file);
                                if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                                    z.getContent('/' + control.name + file, 'string').then(function (fab) {
                                        if (!fab) {
                                            loadedCb();
                                            return;
                                        }
                                        files[file] = fab.replace(/^\ufeff/, '');
                                        loadedCb();
                                    }).catch(function () {
                                        loadedCb();
                                    });
                                }
                                else {
                                    z.getContent('/' + control.name + file, 'arraybuffer').then(function (fab) {
                                        if (!fab) {
                                            loadedCb();
                                            return;
                                        }
                                        files[file] = new Blob([fab], {
                                            'type': mime.mime
                                        });
                                        loadedCb();
                                    }).catch(function () {
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
                    });
                }).catch(function () {
                    controlCb();
                });
            }
        });
        return controlPkg;
    });
}
exports.read = read;
function init(taskId, formId, path, preprocess, invoke) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = task.list[taskId];
        if (!t) {
            return false;
        }
        const components = {};
        for (let cpath of t.app.config.controls) {
            if (!cpath.endsWith('.cgc')) {
                cpath += '.cgc';
            }
            const control = t.controls.loaded[cpath];
            if (!control) {
                return false;
            }
            for (const name in control) {
                const item = control[name];
                let props = {};
                let data = {};
                let methods = {};
                let computed = {};
                let watch = {};
                let beforeCreate = undefined;
                let created = undefined;
                let beforeMount = undefined;
                let mounted = undefined;
                let beforeUpdate = undefined;
                let updated = undefined;
                let beforeUnmount = undefined;
                let unmounted = undefined;
                let layout = '', prep = '';
                if (t.controls.layout[name]) {
                    layout = t.controls.layout[name];
                    prep = t.controls.prep[name];
                }
                else {
                    layout = item.files[item.config.layout + '.html'];
                    if (layout === undefined) {
                        return false;
                    }
                    layout = layout.replace(/^(<[a-zA-Z0-9-]+)( |>)/, '$1 data-cg-control-' + name + '$2');
                    const style = item.files[item.config.style + '.css'];
                    if (style) {
                        const r = tool.stylePrepend(style);
                        prep = r.prep;
                        dom.pushStyle(t.id, yield tool.styleUrl2DataUrl(item.config.style, r.style, item.files), 'control', name);
                    }
                    const prepList = [
                        'cg-theme-task' + t.id.toString() + '-' + name + '_'
                    ];
                    if (prep !== '') {
                        prepList.push(prep);
                    }
                    layout = tool.layoutAddTagClassAndReTagName(layout, false);
                    layout = tool.layoutClassPrepend(layout, prepList);
                    if (layout.includes('<cg-')) {
                        layout = tool.layoutInsertAttr(layout, ':cg-focus=\'cgFocus\'', {
                            'include': [/^cg-.+/]
                        });
                    }
                    layout = tool.eventsAttrWrap(layout);
                    t.controls.layout[name] = layout;
                    t.controls.prep[name] = prep;
                }
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
                props.cgFocus = {
                    'default': false
                };
                computed.taskId = {
                    get: function () {
                        return taskId;
                    },
                    set: function () {
                        form.notify({
                            'title': 'Error',
                            'content': `The control tries to modify the system variable "taskId".\nPath: ${this.cgPath}\nControl: ${name}`,
                            'type': 'danger'
                        });
                        return;
                    }
                };
                computed.controlName = {
                    get: function () {
                        return name;
                    },
                    set: function () {
                        form.notify({
                            'title': 'Error',
                            'content': `The control tries to modify the system variable "controlName".\nPath: ${this.cgPath}\nControl: ${name}`,
                            'type': 'danger'
                        });
                        return;
                    }
                };
                computed.cgPrep = {
                    get: function () {
                        return prep;
                    },
                    set: function () {
                        form.notify({
                            'title': 'Error',
                            'content': `The control tries to modify the system variable "cgPrep".\nPath: ${this.cgPath}\nControl: ${name}`,
                            'type': 'danger'
                        });
                        return;
                    }
                };
                computed.cgSlots = function () {
                    return (name = 'default') => {
                        const d = this.$slots[name];
                        if (!d) {
                            return [];
                        }
                        const slots = [];
                        const list = d();
                        for (const item of list) {
                            if (typeof item.type === 'symbol') {
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
                computed.cgLocale = function () {
                    if (task.list[this.taskId].locale.lang === '') {
                        return core.config.locale;
                    }
                    return task.list[this.taskId].locale.lang;
                };
                computed.l = function () {
                    return (key, data) => {
                        var _a, _b, _c, _d, _e, _f;
                        if (data) {
                            return (_c = (_b = (_a = data[this.cgLocale]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : data['en'][key]) !== null && _c !== void 0 ? _c : 'LocaleError';
                        }
                        else if (this.localeData) {
                            return (_f = (_e = (_d = this.localeData[this.cgLocale]) === null || _d === void 0 ? void 0 : _d[key]) !== null && _e !== void 0 ? _e : this.localeData['en'][key]) !== null && _f !== void 0 ? _f : 'LocaleError';
                        }
                        else {
                            return 'LocaleError';
                        }
                    };
                };
                computed.cgParentByName = function () {
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
                };
                computed.formId = {
                    get: function () {
                        return formId;
                    },
                    set: function () {
                        form.notify({
                            'title': 'Error',
                            'content': `The control tries to modify the system variable "formId".\nPath: ${this.cgPath}\nControl: ${name}`,
                            'type': 'danger'
                        });
                    }
                };
                computed.cgPath = {
                    get: function () {
                        return path;
                    },
                    set: function () {
                        form.notify({
                            'title': 'Error',
                            'content': `The control tries to modify the system variable "cgPath".\nPath: ${this.cgPath}\nControl: ${name}`,
                            'type': 'danger'
                        });
                    }
                };
                methods.cgClassPrepend = function (cla) {
                    if (typeof cla !== 'string') {
                        return cla;
                    }
                    return `cg-theme-task${this.taskId}-${this.controlName}_${cla}${this.cgPrep ? (' ' + this.cgPrep + cla) : ''}`;
                };
                methods.cgAllowEvent = function (e) {
                    return dom.allowEvent(e);
                };
                components['cg-' + name] = {
                    'template': layout,
                    'props': props,
                    'data': function () {
                        return tool.clone(data);
                    },
                    'methods': methods,
                    'computed': computed,
                    'watch': watch,
                    'beforeCreate': beforeCreate,
                    'created': created,
                    'beforeMount': beforeMount,
                    'mounted': function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield this.$nextTick();
                            mounted === null || mounted === void 0 ? void 0 : mounted.call(this);
                        });
                    },
                    'beforeUpdate': beforeUpdate,
                    'updated': function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield this.$nextTick();
                            updated === null || updated === void 0 ? void 0 : updated.call(this);
                        });
                    },
                    'beforeUnmount': function () {
                        beforeUnmount === null || beforeUnmount === void 0 ? void 0 : beforeUnmount.call(this);
                    },
                    'unmounted': function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield this.$nextTick();
                            unmounted === null || unmounted === void 0 ? void 0 : unmounted.call(this);
                        });
                    }
                };
            }
        }
        return components;
    });
}
exports.init = init;
