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
exports.buildComponents = exports.init = exports.read = exports.AbstractControl = void 0;
const core = require("./core");
const zip = require("./zip");
const tool = require("./tool");
const task = require("./task");
const dom = require("./dom");
const form = require("./form");
const fs = require("./fs");
class AbstractControl {
    constructor() {
        this.props = {};
    }
    get filename() {
        return '';
    }
    get controlName() {
        return '';
    }
    get taskId() {
        return 0;
    }
    get formId() {
        return 0;
    }
    get formFocus() {
        return this.props.formFocus;
    }
    get path() {
        return '';
    }
    get prep() {
        return '';
    }
    get locale() {
        return task.list[this.taskId].locale.lang || core.config.locale;
    }
    get l() {
        return (key, data) => {
            var _a, _b, _c, _d, _e, _f;
            if (data) {
                return (_c = (_b = (_a = data[this.locale]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : data['en'][key]) !== null && _c !== void 0 ? _c : 'LocaleError';
            }
            else if (this.localeData) {
                return (_f = (_e = (_d = this.localeData[this.locale]) === null || _d === void 0 ? void 0 : _d[key]) !== null && _e !== void 0 ? _e : this.localeData['en'][key]) !== null && _f !== void 0 ? _f : 'LocaleError';
            }
            else {
                return 'LocaleError';
            }
        };
    }
    get classPrepend() {
        return (cla) => {
            if (typeof cla !== 'string') {
                return cla;
            }
            return `cg-theme-task${this.taskId}-${this.controlName}_${cla}${this.prep ? (' ' + this.prep + cla) : ''}`;
        };
    }
    watch(name, cb, opt = {}) {
        return this.$watch(name, cb, opt);
    }
    get refs() {
        return this.$refs;
    }
    get nextTick() {
        return this.$nextTick;
    }
    allowEvent(e) {
        return dom.allowEvent(e);
    }
    trigger(name, param1 = '', param2 = '') {
        if (!['formTitleChanged', 'formIconChanged', 'formStateMinChanged', 'formStateMaxChanged', 'formShowChanged'].includes(name)) {
            return;
        }
        core.trigger(name, this.taskId, this.formId, param1, param2);
    }
    get element() {
        return this.$el;
    }
    emit(name, ...v) {
        this.$emit(name, ...v);
    }
    get slots() {
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
    }
    get parent() {
        return this.$parent;
    }
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
    onBeforeCreate() {
        return;
    }
    onCreated() {
        return;
    }
    onBeforeMount() {
        return;
    }
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
exports.AbstractControl = AbstractControl;
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
function init(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = task.list[taskId];
        if (!t) {
            return false;
        }
        for (let path of t.config.controls) {
            if (!path.endsWith('.cgc')) {
                path += '.cgc';
            }
            path = tool.urlResolve('/', path);
            const file = yield fs.getContent(path, {
                'files': t.app.files,
                'current': t.current
            });
            if (file && typeof file !== 'string') {
                const c = yield read(file);
                if (c) {
                    for (const name in c) {
                        const item = c[name];
                        let prep = '';
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
                        t.controls[name].layout = item.files[item.config.layout + '.html'];
                        if (t.controls[name].layout === undefined) {
                            return false;
                        }
                        t.controls[name].layout = t.controls[name].layout.replace(/^(<[a-zA-Z0-9-]+)( |>)/, '$1 data-cg-control-' + name + '$2');
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
                        t.controls[name].layout = tool.layoutAddTagClassAndReTagName(t.controls[name].layout, false);
                        t.controls[name].layout = tool.layoutClassPrepend(t.controls[name].layout, prepList);
                        if (t.controls[name].layout.includes('<cg-')) {
                            t.controls[name].layout = tool.layoutInsertAttr(t.controls[name].layout, ':form-focus=\'formFocus\'', {
                                'include': [/^cg-.+/]
                            });
                        }
                        t.controls[name].layout = tool.eventsAttrWrap(t.controls[name].layout);
                        let cls;
                        if (item.files[item.config.code + '.js']) {
                            item.files['/invoke/clickgo.js'] = `module.exports = invokeClickgo;`;
                            let expo = [];
                            try {
                                expo = loader.require(item.config.code, item.files, {
                                    'dir': '/',
                                    'invoke': t.invoke,
                                    'preprocess': function (code, path) {
                                        const exec = /eval\W/.exec(code);
                                        if (exec) {
                                            form.notify({
                                                'title': 'Error',
                                                'content': `The "eval" is prohibited.\nFile: "${path}".`,
                                                'type': 'danger'
                                            });
                                            return '';
                                        }
                                        code = code.replace(/extends[\s\S]+?\.\s*AbstractControl\s*{/, (t) => {
                                            return t + 'get filename() {return __filename;}';
                                        });
                                        return code;
                                    },
                                    'map': {
                                        'clickgo': '/invoke/clickgo'
                                    }
                                })[0];
                            }
                            catch (e) {
                                core.trigger('error', taskId, 0, e, e.message + '(-4)');
                                return false;
                            }
                            if (!(expo === null || expo === void 0 ? void 0 : expo.default)) {
                                const msg = '"default" not found on "' + item.config.code + '" of "' + name + '" control.';
                                core.trigger('error', taskId, 0, new Error(msg), msg);
                                return false;
                            }
                            cls = new expo.default();
                        }
                        else {
                            cls = new (class extends AbstractControl {
                                get taskId() {
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
                        const cdata = Object.entries(cls);
                        for (const item of cdata) {
                            if (item[0] === 'access') {
                                t.controls[name].access = item[1];
                                continue;
                            }
                            t.controls[name].data[item[0]] = item[1];
                        }
                        const prot = tool.getClassPrototype(cls);
                        t.controls[name].methods = prot.method;
                        Object.assign(t.controls[name].computed, prot.access);
                        t.controls[name].computed.controlName = {
                            get: function () {
                                return name;
                            },
                            set: function () {
                                form.notify({
                                    'title': 'Error',
                                    'content': `The software tries to modify the system variable "controlName".\nControl: ${name}`,
                                    'type': 'danger'
                                });
                                return;
                            }
                        };
                        t.controls[name].computed.prep = {
                            get: function () {
                                return prep;
                            },
                            set: function () {
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
                    return false;
                }
            }
        }
        t.invoke = undefined;
        delete t.invoke;
        return true;
    });
}
exports.init = init;
function buildComponents(taskId, formId, path) {
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    const components = {};
    for (const name in t.controls) {
        const control = t.controls[name];
        const computed = Object.assign({}, control.computed);
        computed.formId = {
            get: function () {
                return formId;
            },
            set: function () {
                form.notify({
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
                form.notify({
                    'title': 'Error',
                    'content': `The control tries to modify the system variable "path".\nControl: ${name}`,
                    'type': 'danger'
                });
            }
        };
        components['cg-' + name] = {
            'template': control.layout,
            'props': control.props,
            'data': function () {
                return tool.clone(control.data);
            },
            'methods': control.methods,
            'computed': computed,
            beforeCreate: control.methods.onBeforeCreate,
            created: function () {
                this.props = this.$props;
                this.access = tool.clone(control.access);
                this.onCreated();
            },
            beforeMount: function () {
                this.onBeforeMount();
            },
            mounted: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.$nextTick();
                    this.onMounted();
                });
            },
            beforeUpdate: function () {
                this.onBeforeUpdate();
            },
            updated: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.$nextTick();
                    this.onUpdated();
                });
            },
            beforeUnmount: function () {
                this.onBeforeUnmount();
            },
            unmounted: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.$nextTick();
                    this.onUnmounted();
                });
            }
        };
    }
    return components;
}
exports.buildComponents = buildComponents;
