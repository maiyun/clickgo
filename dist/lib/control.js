"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AbstractControl = void 0;
exports.read = read;
exports.init = init;
exports.buildComponents = buildComponents;
const core = __importStar(require("./core"));
const zip = __importStar(require("./zip"));
const tool = __importStar(require("./tool"));
const task = __importStar(require("./task"));
const dom = __importStar(require("./dom"));
const form = __importStar(require("./form"));
const fs = __importStar(require("./fs"));
class AbstractControl {
    constructor() {
        this._rootForm = null;
        this._rootControl = null;
        this.packageFiles = {};
        this.props = {};
        this.emits = {};
        this.slots = {};
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
    get rootForm() {
        if (!this._rootForm) {
            this._rootForm = this.parentByName('root');
            if (!this._rootForm) {
                form.notify({
                    'title': 'Error',
                    'content': `The "rootForm" is not ready yet.\nFile: "${this.controlName}".`,
                    'type': 'danger'
                });
            }
        }
        return this._rootForm;
    }
    get rootControl() {
        return this._rootControl;
    }
    get formFocus() {
        var _a, _b;
        return (_b = (_a = this.rootForm) === null || _a === void 0 ? void 0 : _a.formFocus) !== null && _b !== void 0 ? _b : false;
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
            var _a, _b;
            const loc = (_b = (_a = this.localeData) === null || _a === void 0 ? void 0 : _a[this.locale][key]) !== null && _b !== void 0 ? _b : '[LocaleError]' + key;
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
    get classPrepend() {
        return (cla) => {
            if (typeof cla !== 'string') {
                return cla;
            }
            return `cg-theme-task${this.taskId}-${this.controlName}_${cla}${this.prep ? (' ' + this.prep + cla) : ''}`;
        };
    }
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
    get propBoolean() {
        return (name) => {
            return tool.getBoolean(this.props[name]);
        };
    }
    get propNumber() {
        return (name) => {
            return tool.getNumber(this.props[name]);
        };
    }
    get propInt() {
        return (name) => {
            return Math.round(this.propNumber(name));
        };
    }
    get propArray() {
        return (name) => {
            return tool.getArray(this.props[name]);
        };
    }
    get element() {
        return this.$el;
    }
    emit(name, ...v) {
        this.$emit(name, ...v);
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
        const list = z.readDir('/');
        for (const sub of list) {
            if (sub.isFile) {
                continue;
            }
            const configContent = yield z.getContent('/' + sub.name + '/config.json');
            if (!configContent) {
                form.notify({
                    'title': 'Error',
                    'content': `Control file not found.\nFile: "${'/' + sub.name + '/config.json'}".`,
                    'type': 'danger'
                });
                continue;
            }
            const config = JSON.parse(configContent);
            controlPkg[config.name] = {
                'type': 'control',
                'config': config,
                'files': {}
            };
            const list = z.readDir('/' + sub.name + '/', {
                'hasChildren': true
            });
            for (const file of list) {
                const pre = file.path.slice(config.name.length + 1);
                const mime = tool.getMimeByPath(file.name);
                if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                    const fab = yield z.getContent(file.path + file.name, 'string');
                    if (!fab) {
                        continue;
                    }
                    controlPkg[config.name].files[pre + file.name] = fab.replace(/^\ufeff/, '');
                }
                else {
                    const fab = yield z.getContent(file.path + file.name, 'arraybuffer');
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
    });
}
function init(taskId, invoke, cache) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = task.list[taskId];
        if (!t) {
            return -1;
        }
        for (let path of t.app.config.controls) {
            if (!path.endsWith('.cgc')) {
                path += '.cgc';
            }
            path = tool.urlResolve('/', path);
            const file = yield fs.getContent(path, {
                'cache': cache
            }, taskId);
            if (file && typeof file !== 'string') {
                const c = yield read(file);
                if (c) {
                    for (const name in c) {
                        const item = c[name];
                        let prep = '';
                        t.controls[name] = {
                            'layout': '',
                            'files': item.files,
                            'props': {},
                            'emits': {},
                            'data': {},
                            'access': {},
                            'methods': {},
                            'computed': {}
                        };
                        t.controls[name].layout = item.files[item.config.layout + '.html'];
                        if (t.controls[name].layout === undefined) {
                            return -2;
                        }
                        t.controls[name].layout = t.controls[name].layout.replace(/^(<[a-zA-Z0-9-]+)( |>)/, '$1 data-cg-control="' + name + '"$2');
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
                        t.controls[name].layout = tool.eventsAttrWrap(t.controls[name].layout);
                        if (t.controls[name].layout.includes('<teleport')) {
                            t.controls[name].layout = tool.teleportGlue(t.controls[name].layout, '{{{formId}}}');
                        }
                        t.controls[name].access['cgPCMap'] = tool.random(8, tool.RANDOM_LUNS, '"<>$');
                        t.controls[name].layout = t.controls[name].layout.replace(/(<cg-[a-zA-Z0-9-_]+)/g, `$1 data-cg-rootcontrol="${t.controls[name].access['cgPCMap']}"`);
                        let cls;
                        if (item.files[item.config.code + '.js']) {
                            item.files['/invoke/clickgo.js'] = `module.exports = invokeClickgo;`;
                            let expo = [];
                            try {
                                expo = loader.require(item.config.code, item.files, {
                                    'dir': '/',
                                    'invoke': invoke,
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
                                return -3;
                            }
                            if (!(expo === null || expo === void 0 ? void 0 : expo.default)) {
                                const msg = '"default" not found on "' + item.config.code + '" of "' + name + '" control.';
                                core.trigger('error', taskId, 0, new Error(msg), msg);
                                return -4;
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
                        if (cls.emits) {
                            for (const key in cls.emits) {
                                t.controls[name].emits[key] = cls.emits[key];
                            }
                        }
                        const cdata = Object.entries(cls);
                        for (const item of cdata) {
                            if (item[0] === 'files') {
                                continue;
                            }
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
                    return -5;
                }
            }
        }
        return 1;
    });
}
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
            'template': control.layout.replace(/{{{formId}}}/g, formId.toString()),
            'props': control.props,
            'emits': control.emits,
            'data': function () {
                const data = tool.clone(control.data);
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
                this.access = tool.clone(control.access);
                this.packageFiles = {};
                for (const fname in control.files) {
                    this.packageFiles[fname] = control.files[fname];
                }
                this.onCreated();
            },
            beforeMount: function () {
                this.onBeforeMount();
            },
            mounted: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (((_a = this.element.dataset) === null || _a === void 0 ? void 0 : _a.cgRootcontrol) !== undefined) {
                        const rc = this.parentByAccess('cgPCMap', this.element.dataset.cgRootcontrol);
                        if (rc) {
                            this._rootControl = rc;
                        }
                    }
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
