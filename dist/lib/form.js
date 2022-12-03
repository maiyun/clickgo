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
exports.hideLauncher = exports.showLauncher = exports.flash = exports.confirm = exports.dialog = exports.create = exports.remove = exports.doFocusAndPopEvent = exports.hidePop = exports.showPop = exports.removeFromPop = exports.appendToPop = exports.hideNotify = exports.notifyProgress = exports.notify = exports.hideDrag = exports.moveDrag = exports.showDrag = exports.hideRectangle = exports.showRectangle = exports.moveRectangle = exports.showCircular = exports.getRectByBorder = exports.getMaxZIndexID = exports.changeFocus = exports.getFocus = exports.getList = exports.send = exports.get = exports.getTaskId = exports.refreshMaxPosition = exports.bindDrag = exports.bindResize = exports.close = exports.max = exports.min = exports.elements = exports.launcherRoot = exports.simpleSystemTaskRoot = exports.AbstractForm = void 0;
const clickgo = require("../clickgo");
const core = require("./core");
const task = require("./task");
const tool = require("./tool");
const dom = require("./dom");
const control = require("./control");
const fs = require("./fs");
const native = require("./native");
let focusId = null;
const info = {
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
class AbstractForm {
    constructor() {
        this._firstShow = true;
        this.dialogResult = '';
    }
    static create(data, layout) {
        return __awaiter(this, void 0, void 0, function* () {
            const frm = new this();
            const code = {
                'data': {},
                'methods': {},
                'computed': {},
                beforeCreate: frm.onBeforeCreate,
                created: function () {
                    this.onCreated();
                },
                beforeMount: function () {
                    this.onBeforeMount();
                },
                mounted: function (data) {
                    this.onMounted(data);
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
            const cdata = Object.entries(frm);
            for (const item of cdata) {
                if (item[0] === 'access') {
                    continue;
                }
                code.data[item[0]] = item[1];
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
            let style = undefined;
            const fstyle = task.list[frm.taskId].app.files[frm.filename.slice(0, -2) + 'css'];
            if (typeof fstyle === 'string') {
                style = fstyle;
            }
            const fid = yield create({
                'code': code,
                'layout': layout,
                'style': style,
                'path': frm.filename.slice(0, frm.filename.lastIndexOf('/')),
                'data': data,
                'taskId': frm.taskId
            });
            if (fid > 0) {
                return task.list[frm.taskId].forms[fid].vroot;
            }
            else {
                return fid;
            }
        });
    }
    get filename() {
        return '';
    }
    get controlName() {
        return 'root';
    }
    set controlName(v) {
        notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "controlName".\nPath: ${this.filename}`,
            'type': 'danger'
        });
        return;
    }
    get taskId() {
        return 0;
    }
    get formId() {
        return 0;
    }
    get formFocus() {
        return this._formFocus;
    }
    set formFocus(b) {
        notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "formFocus".\nPath: ${this.filename}`,
            'type': 'danger'
        });
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
        return (key) => {
            var _a, _b, _c, _d;
            return (_d = (_b = (_a = task.list[this.taskId].locale.data[this.locale]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : (_c = task.list[this.taskId].locale.data['en']) === null || _c === void 0 ? void 0 : _c[key]) !== null && _d !== void 0 ? _d : 'LocaleError';
        };
    }
    get classPrepend() {
        return (cla) => {
            if (typeof cla !== 'string') {
                return cla;
            }
            return `cg-task${this.taskId}_${cla}${this.prep ? (' ' + this.prep + cla) : ''}`;
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
    createForm(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            path = tool.urlResolve(this.filename, path);
            const taskId = this.taskId;
            const cls = class extends AbstractForm {
                get filename() {
                    return path + '.js';
                }
                get taskId() {
                    return taskId;
                }
            };
            return cls.create(data);
        });
    }
    get topMost() {
        return false;
    }
    set topMost(v) {
    }
    send(fid, obj) {
        obj.taskId = this.taskId;
        obj.formId = this.formId;
        send(fid, obj);
    }
    get isMask() {
        return !task.list[this.taskId].runtime.dialogFormIds.length ||
            task.list[this.taskId].runtime.dialogFormIds[task.list[this.taskId].runtime.dialogFormIds.length - 1]
                === this.formId ? false : true;
    }
    show() {
        const v = this;
        v.$refs.form.$data.isShow = true;
        if (this._firstShow) {
            this._firstShow = false;
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
    showDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            this.topMost = true;
            this.show();
            task.list[this.taskId].runtime.dialogFormIds.push(this.formId);
            return new Promise((resolve) => {
                this.cgDialogCallback = () => {
                    resolve(this.dialogResult);
                };
            });
        });
    }
    hide() {
        const v = this;
        v.$refs.form.$data.isShow = false;
    }
    close() {
        clickgo.form.close(this.formId);
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
    onReceive() {
        return;
    }
    onScreenResize() {
        return;
    }
    onConfigChanged() {
        return;
    }
    onFormCreated() {
        return;
    }
    onFormRemoved() {
        return;
    }
    onFormTitleChanged() {
        return;
    }
    onFormIconChanged() {
        return;
    }
    onFormStateMinChanged() {
        return;
    }
    onFormStateMaxChanged() {
        return;
    }
    onFormShowChanged() {
        return;
    }
    onFormFocused() {
        return;
    }
    onFormBlurred() {
        return;
    }
    onFormFlash() {
        return;
    }
    onTaskStarted() {
        return;
    }
    onTaskEnded() {
        return;
    }
    onLauncherFolderNameChanged() {
        return;
    }
}
exports.AbstractForm = AbstractForm;
const popInfo = {
    'list': [],
    'elList': [],
    'lastZIndex': 0
};
exports.elements = {
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
    'init': function () {
        this.wrap.id = 'cg-wrap';
        document.getElementsByTagName('body')[0].appendChild(this.wrap);
        this.wrap.addEventListener('touchmove', function (e) {
            if (e.cancelable) {
                e.preventDefault();
            }
        }, {
            'passive': false
        });
        this.wrap.addEventListener('wheel', function (e) {
            e.preventDefault();
        }, {
            'passive': false
        });
        this.wrap.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        if (clickgo.isImmersion()) {
            this.wrap.addEventListener('mouseenter', function () {
                native.invoke('cg-mouse-ignore', native.getToken(), false);
            });
            this.wrap.addEventListener('mouseleave', function () {
                native.invoke('cg-mouse-ignore', native.getToken(), true);
            });
        }
        this.list.id = 'cg-form-list';
        this.wrap.appendChild(this.list);
        this.popList.id = 'cg-pop-list';
        this.wrap.appendChild(this.popList);
        this.circular.id = 'cg-circular';
        this.wrap.appendChild(this.circular);
        this.rectangle.setAttribute('data-pos', '');
        this.rectangle.id = 'cg-rectangle';
        this.wrap.appendChild(this.rectangle);
        this.gesture.id = 'cg-gesture';
        this.wrap.appendChild(this.gesture);
        this.drag.id = 'cg-drag';
        this.drag.innerHTML = '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L40 40" stroke="#FFF" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M8 40L40 8" stroke="#FFF" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/></svg>';
        this.dragIcon = this.drag.childNodes[0];
        this.wrap.appendChild(this.drag);
        this.system.id = 'cg-system';
        this.wrap.appendChild(this.system);
        this.simpleSystemtask.id = 'cg-simpletask';
        this.wrap.appendChild(this.simpleSystemtask);
        const simpletaskApp = clickgo.vue.createApp({
            'template': '<div v-for="(item, formId) of forms" class="cg-simpletask-item" @click="click(parseInt(formId))"><div v-if="item.icon" class="cg-simpletask-icon" :style="{\'background-image\': \'url(\' + item.icon + \')\'}"></div><div>{{item.title}}</div></div>',
            'data': function () {
                return {
                    'forms': {}
                };
            },
            'watch': {
                'forms': {
                    handler: function () {
                        const length = Object.keys(this.forms).length;
                        if (length > 0) {
                            if (exports.elements.simpleSystemtask.style.bottom !== '0px') {
                                exports.elements.simpleSystemtask.style.bottom = '0px';
                                core.trigger('screenResize');
                            }
                        }
                        else {
                            if (exports.elements.simpleSystemtask.style.bottom === '0px') {
                                exports.elements.simpleSystemtask.style.bottom = '-46px';
                                core.trigger('screenResize');
                            }
                        }
                    },
                    'deep': true
                }
            },
            'methods': {
                click: function (formId) {
                    changeFocus(formId);
                }
            },
            'mounted': function () {
                exports.simpleSystemTaskRoot = this;
            }
        });
        simpletaskApp.mount('#cg-simpletask');
        this.launcher.id = 'cg-launcher';
        this.wrap.appendChild(this.launcher);
        const waiting = function () {
            if (!core.config) {
                setTimeout(function () {
                    waiting();
                }, 150);
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
                'data': function () {
                    return {
                        'name': '',
                        'folderName': ''
                    };
                },
                'computed': {
                    'search': function () {
                        var _a, _b;
                        return (_b = (_a = info.locale[core.config.locale]) === null || _a === void 0 ? void 0 : _a.search) !== null && _b !== void 0 ? _b : info.locale['en'].search;
                    },
                    'list': function () {
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
                    mousedown: function (e) {
                        this.md = e.pageX + e.pageY;
                    },
                    listClick: function (e) {
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
                    iconClick: function (e, item) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (this.md !== e.pageX + e.pageY) {
                                return;
                            }
                            hideLauncher();
                            yield clickgo.task.run(item.path, {
                                'icon': item.icon
                            });
                        });
                    },
                    subIconClick: function (e, item) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (this.md !== e.pageX + e.pageY) {
                                return;
                            }
                            hideLauncher();
                            yield clickgo.task.run(item.path, {
                                'icon': item.icon
                            });
                        });
                    },
                    closeFolder: function () {
                        this.folderName = '';
                        const el = this.folderEl;
                        const rect = el.parentNode.getBoundingClientRect();
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
                    openFolder: function (e, item) {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        if (e.currentTarget.childNodes[0] !== e.target) {
                            return;
                        }
                        if (this.folderName !== '') {
                            this.closeFolder();
                            return;
                        }
                        this.folderName = item.name;
                        this.folderItem = item;
                        const el = e.currentTarget.childNodes.item(0);
                        this.folderEl = el;
                        const searchEl = document.getElementsByClassName('cg-launcher-search')[0];
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
                    folderNameChange: function (e) {
                        var _a;
                        const input = e.target;
                        const val = input.value.trim();
                        if (val === '') {
                            input.value = this.folderName;
                            return;
                        }
                        this.folderName = val;
                        core.trigger('launcherFolderNameChanged', (_a = this.folderItem.id) !== null && _a !== void 0 ? _a : '', val);
                    }
                },
                'mounted': function () {
                    exports.launcherRoot = this;
                }
            });
            launcherApp.mount('#cg-launcher');
        };
        waiting();
    }
};
exports.elements.init();
function changeState(state, formId) {
    const tid = getTaskId(formId);
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
function min(formId) {
    return changeState('min', formId);
}
exports.min = min;
function max(formId) {
    return changeState('max', formId);
}
exports.max = max;
function close(formId) {
    return changeState('close', formId);
}
exports.close = close;
function bindResize(e, border) {
    const formWrap = dom.findParentByClass(e.target, 'cg-form-wrap');
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
exports.bindResize = bindResize;
function bindDrag(e) {
    const formWrap = dom.findParentByClass(e.target, 'cg-form-wrap');
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
exports.bindDrag = bindDrag;
function refreshMaxPosition() {
    const area = core.getAvailArea();
    for (let i = 0; i < exports.elements.list.children.length; ++i) {
        const el = exports.elements.list.children.item(i);
        const ef = el.children.item(0);
        if (ef.dataset.cgMax === undefined) {
            continue;
        }
        const taskId = parseInt(el.getAttribute('data-task-id'));
        const formId = parseInt(el.getAttribute('data-form-id'));
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
exports.refreshMaxPosition = refreshMaxPosition;
function getTaskId(formId) {
    const formElement = exports.elements.list.querySelector(`[data-form-id='${formId}']`);
    if (!formElement) {
        return 0;
    }
    const taskIdAttr = formElement.getAttribute('data-task-id');
    if (!taskIdAttr) {
        return 0;
    }
    return parseInt(taskIdAttr);
}
exports.getTaskId = getTaskId;
function get(formId) {
    const taskId = getTaskId(formId);
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
exports.get = get;
function send(formId, obj) {
    const taskId = getTaskId(formId);
    if (taskId === 0) {
        return;
    }
    const item = task.list[taskId].forms[formId];
    item.vroot.onReceive(obj);
}
exports.send = send;
function getList(taskId) {
    if (!task.list[taskId]) {
        return {};
    }
    const list = {};
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
exports.getList = getList;
function getFocus() {
    return focusId;
}
exports.getFocus = getFocus;
function changeFocus(formId = 0) {
    var _a;
    if (typeof formId !== 'number') {
        notify({
            'title': 'Warning',
            'content': 'The "formId" of "changeFocus" must be a number type.',
            'type': 'warning'
        });
        return;
    }
    const dataFormId = getFocus();
    if (dataFormId) {
        if (dataFormId === formId) {
            return;
        }
        else {
            const t = task.list[task.getFocus()];
            t.forms[dataFormId].vapp._container.removeAttribute('data-form-focus');
            t.forms[dataFormId].vroot._formFocus = false;
            core.trigger('formBlurred', t.id, dataFormId);
        }
    }
    focusId = null;
    task.setFocus();
    if (formId === 0) {
        return;
    }
    const el = exports.elements.list.querySelector(`.cg-form-wrap[data-form-id='${formId}']`);
    if (!el) {
        return;
    }
    if (el.children.item(0).dataset.cgMin !== undefined) {
        min(formId);
    }
    const taskId = parseInt((_a = el.getAttribute('data-task-id')) !== null && _a !== void 0 ? _a : '0');
    const t = task.list[taskId];
    if (t.runtime.dialogFormIds.length) {
        const dialogFormId = t.runtime.dialogFormIds[t.runtime.dialogFormIds.length - 1];
        if (get(dialogFormId).stateMin) {
            min(dialogFormId);
        }
        if (t.forms[dialogFormId].vroot._topMost) {
            t.forms[dialogFormId].vroot.$refs.form.$data.zIndex = ++info.topLastZIndex;
        }
        else {
            t.forms[dialogFormId].vroot.$refs.form.$data.zIndex = ++info.lastZIndex;
        }
        t.forms[dialogFormId].vapp._container.dataset.formFocus = '';
        t.forms[dialogFormId].vroot._formFocus = true;
        focusId = dialogFormId;
        task.setFocus(t.id);
        core.trigger('formFocused', taskId, dialogFormId);
        if (dialogFormId !== formId) {
            clickgo.form.flash(dialogFormId, taskId);
        }
    }
    else {
        if (t.forms[formId].vroot._topMost) {
            t.forms[formId].vroot.$refs.form.$data.zIndex = ++info.topLastZIndex;
        }
        else {
            t.forms[formId].vroot.$refs.form.$data.zIndex = ++info.lastZIndex;
        }
        t.forms[formId].vapp._container.dataset.formFocus = '';
        t.forms[formId].vroot._formFocus = true;
        focusId = formId;
        task.setFocus(t.id);
        core.trigger('formFocused', taskId, formId);
    }
}
exports.changeFocus = changeFocus;
function getMaxZIndexID(out = {}) {
    var _a, _b;
    let zIndex = 0;
    let formId = null;
    for (let i = 0; i < exports.elements.list.children.length; ++i) {
        const formWrap = exports.elements.list.children.item(i);
        const formInner = formWrap.children.item(0);
        if (!formInner) {
            continue;
        }
        const z = parseInt(formInner.style.zIndex);
        if (z > 9999999) {
            continue;
        }
        if (formInner.dataset.cgMin !== undefined) {
            continue;
        }
        const tid = parseInt(formWrap.getAttribute('data-task-id'));
        if ((_a = out.taskIds) === null || _a === void 0 ? void 0 : _a.includes(tid)) {
            continue;
        }
        const fid = parseInt(formWrap.getAttribute('data-form-id'));
        if ((_b = out.formIds) === null || _b === void 0 ? void 0 : _b.includes(fid)) {
            continue;
        }
        if (z > zIndex) {
            zIndex = z;
            formId = fid;
        }
    }
    return formId;
}
exports.getMaxZIndexID = getMaxZIndexID;
function getRectByBorder(border) {
    var _a, _b, _c, _d;
    const area = core.getAvailArea();
    let width, height, left, top;
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
        width = (_a = border.width) !== null && _a !== void 0 ? _a : area.width;
        height = (_b = border.height) !== null && _b !== void 0 ? _b : area.height;
        left = (_c = border.left) !== null && _c !== void 0 ? _c : area.left;
        top = (_d = border.top) !== null && _d !== void 0 ? _d : area.top;
    }
    return {
        'width': width,
        'height': height,
        'left': left,
        'top': top
    };
}
exports.getRectByBorder = getRectByBorder;
function showCircular(x, y) {
    exports.elements.circular.style.transition = 'none';
    requestAnimationFrame(function () {
        exports.elements.circular.style.width = '6px';
        exports.elements.circular.style.height = '6px';
        exports.elements.circular.style.left = (x - 3).toString() + 'px';
        exports.elements.circular.style.top = (y - 3).toString() + 'px';
        exports.elements.circular.style.opacity = '1';
        requestAnimationFrame(function () {
            exports.elements.circular.style.transition = 'all .3s ease-out';
            requestAnimationFrame(function () {
                exports.elements.circular.style.width = '60px';
                exports.elements.circular.style.height = '60px';
                exports.elements.circular.style.left = (x - 30).toString() + 'px';
                exports.elements.circular.style.top = (y - 30).toString() + 'px';
                exports.elements.circular.style.opacity = '0';
            });
        });
    });
}
exports.showCircular = showCircular;
function moveRectangle(border) {
    var _a, _b, _c, _d;
    const dataReady = (_a = exports.elements.rectangle.getAttribute('data-ready')) !== null && _a !== void 0 ? _a : '0';
    if (dataReady === '0') {
        return;
    }
    const dataBorder = (_b = exports.elements.rectangle.getAttribute('data-border')) !== null && _b !== void 0 ? _b : '';
    const setDataBorder = typeof border === 'string' ? border : `o-${border.left}-${(_c = border.top) !== null && _c !== void 0 ? _c : 'n'}-${border.width}-${(_d = border.height) !== null && _d !== void 0 ? _d : 'n'}`;
    if (dataBorder === setDataBorder) {
        return;
    }
    exports.elements.rectangle.setAttribute('data-dir', setDataBorder);
    const pos = getRectByBorder(border);
    const width = pos.width - 20;
    const height = pos.height - 20;
    const left = pos.left + 10;
    const top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        exports.elements.rectangle.style.width = width.toString() + 'px';
        exports.elements.rectangle.style.height = height.toString() + 'px';
        exports.elements.rectangle.style.left = left.toString() + 'px';
        exports.elements.rectangle.style.top = top.toString() + 'px';
    }
}
exports.moveRectangle = moveRectangle;
function showRectangle(x, y, border) {
    exports.elements.rectangle.style.transition = 'none';
    requestAnimationFrame(function () {
        exports.elements.rectangle.style.width = '5px';
        exports.elements.rectangle.style.height = '5px';
        exports.elements.rectangle.style.left = (x - 10).toString() + 'px';
        exports.elements.rectangle.style.top = (y - 10).toString() + 'px';
        exports.elements.rectangle.style.opacity = '1';
        exports.elements.rectangle.setAttribute('data-ready', '0');
        exports.elements.rectangle.setAttribute('data-dir', '');
        requestAnimationFrame(function () {
            exports.elements.rectangle.style.transition = 'all .2s ease-out';
            requestAnimationFrame(function () {
                exports.elements.rectangle.setAttribute('data-ready', '1');
                moveRectangle(border);
            });
        });
    });
}
exports.showRectangle = showRectangle;
function hideRectangle() {
    exports.elements.rectangle.style.opacity = '0';
}
exports.hideRectangle = hideRectangle;
function showDrag() {
    exports.elements.drag.style.opacity = '1';
}
exports.showDrag = showDrag;
function moveDrag(opt) {
    if (opt.top) {
        exports.elements.drag.style.top = opt.top.toString() + 'px';
    }
    if (opt.left) {
        exports.elements.drag.style.left = opt.left.toString() + 'px';
    }
    if (opt.width) {
        exports.elements.drag.style.width = opt.width.toString() + 'px';
    }
    if (opt.height) {
        exports.elements.drag.style.height = opt.height.toString() + 'px';
    }
    if (opt.icon) {
        if (exports.elements.dragIcon) {
            exports.elements.dragIcon.style.display = 'block';
        }
    }
    else {
        if (exports.elements.dragIcon) {
            exports.elements.dragIcon.style.display = 'none';
        }
    }
}
exports.moveDrag = moveDrag;
function hideDrag() {
    exports.elements.drag.style.opacity = '0';
}
exports.hideDrag = hideDrag;
let notifyTop = 10;
let notifyId = 0;
function notify(opt) {
    var _a;
    const nid = ++notifyId;
    let timeout = 5000;
    if (opt.timeout !== undefined) {
        if (opt.timeout <= 0 || opt.timeout > 30000) {
            timeout = 30000;
        }
        else {
            timeout = opt.timeout;
        }
    }
    if (opt.progress && !opt.type) {
        opt.type = 'progress';
    }
    const el = document.createElement('div');
    const y = notifyTop;
    el.classList.add('cg-system-notify');
    el.setAttribute('data-notifyid', nid.toString());
    el.style.transform = `translateY(${y}px) translateX(280px)`;
    el.style.opacity = '1';
    el.innerHTML = `<div class="cg-system-icon cg-${tool.escapeHTML((_a = opt.type) !== null && _a !== void 0 ? _a : 'primary')}"></div>
<div style="flex: 1;">
    <div class="cg-system-notify-title">${tool.escapeHTML(opt.title)}</div>
    <div class="cg-system-notify-content">${tool.escapeHTML(opt.content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}</div>
    ${opt.progress ? '<div class="cg-system-notify-progress"></div>' : ''}
</div>`;
    if (opt.icon) {
        el.childNodes.item(0).style.background = 'url(' + opt.icon + ')';
        el.childNodes.item(0).style.backgroundSize = '16px';
    }
    exports.elements.system.appendChild(el);
    notifyTop += el.offsetHeight + 10;
    requestAnimationFrame(function () {
        el.style.transform = `translateY(${y}px) translateX(-10px)`;
        const timer = window.setTimeout(function () {
            hideNotify(nid);
        }, timeout);
        el.setAttribute('data-timer', timer.toString());
    });
    return nid;
}
exports.notify = notify;
function notifyProgress(notifyId, per) {
    const el = exports.elements.system.querySelector(`[data-notifyid="${notifyId}"]`);
    if (!el) {
        return;
    }
    const progress = el.querySelector('.cg-system-notify-progress');
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
exports.notifyProgress = notifyProgress;
function hideNotify(notifyId) {
    const el = exports.elements.system.querySelector(`[data-notifyid="${notifyId}"]`);
    if (!el) {
        return;
    }
    clearTimeout(parseInt(el.getAttribute('data-timer')));
    const notifyHeight = el.offsetHeight;
    el.style.opacity = '0';
    setTimeout(function () {
        notifyTop -= notifyHeight + 10;
        const notifyElementList = document.getElementsByClassName('cg-system-notify');
        let needSub = false;
        for (const notifyElement of notifyElementList) {
            if (notifyElement === el) {
                needSub = true;
                continue;
            }
            if (needSub) {
                notifyElement.style.transform = notifyElement.style.transform.replace(/translateY\(([0-9]+)px\)/, function (t, t1) {
                    return `translateY(${parseInt(t1) - notifyHeight - 10}px)`;
                });
            }
        }
        el.remove();
    }, 100);
}
exports.hideNotify = hideNotify;
function appendToPop(el) {
    exports.elements.popList.appendChild(el);
}
exports.appendToPop = appendToPop;
function removeFromPop(el) {
    exports.elements.popList.removeChild(el);
}
exports.removeFromPop = removeFromPop;
let lastShowPopTime = 0;
function showPop(el, pop, direction, opt = {}) {
    var _a, _b;
    if (opt.null === undefined) {
        opt.null = false;
    }
    if (opt.size === undefined) {
        opt.size = {};
    }
    if (!pop && !opt.null) {
        return;
    }
    const now = Date.now();
    if (now - lastShowPopTime < 5) {
        lastShowPopTime = now;
        return;
    }
    lastShowPopTime = now;
    if (el.dataset.cgPopOpen !== undefined) {
        return;
    }
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
        hidePop();
    }
    if (!pop) {
        popInfo.elList.push(el);
        el.dataset.cgPopOpen = '';
        el.dataset.cgLevel = (popInfo.elList.length - 1).toString();
        return;
    }
    const width = (_a = opt.size.width) !== null && _a !== void 0 ? _a : (pop ? pop.offsetWidth : 0);
    const height = (_b = opt.size.height) !== null && _b !== void 0 ? _b : (pop ? pop.offsetHeight : 0);
    let left, top;
    if (typeof direction === 'string') {
        const bcr = el.getBoundingClientRect();
        if (direction === 'v') {
            left = bcr.left;
            top = bcr.top + bcr.height;
        }
        else {
            left = bcr.left + bcr.width - 2;
            top = bcr.top - 2;
        }
        if (width + left > window.innerWidth) {
            if (direction === 'v') {
                left = bcr.left + bcr.width - width;
            }
            else {
                left = bcr.left - width + 2;
            }
        }
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
        let x;
        let y;
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
        if (width + left > window.innerWidth) {
            left = x - width - 5;
        }
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
exports.showPop = showPop;
function hidePop(pop) {
    if (!pop) {
        if (popInfo.elList.length === 0) {
            return;
        }
        hidePop(popInfo.elList[0]);
        return;
    }
    let isPop = false;
    if (pop.dataset.cgPopOpen !== undefined) {
    }
    else if (pop.dataset.cgOpen !== undefined) {
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
exports.hidePop = hidePop;
function doFocusAndPopEvent(e) {
    var _a, _b;
    if (dom.hasTouchButMouse(e)) {
        return;
    }
    const target = e.target;
    if (!target) {
        return;
    }
    const element = target;
    if (element.dataset.cgPopOpen !== undefined) {
        return;
    }
    const paths = (_a = e.path) !== null && _a !== void 0 ? _a : (e.composedPath ? e.composedPath() : []);
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
        if (item.id === 'cg-pop-list') {
            return;
        }
        if (item.dataset.cgPopOpen !== undefined) {
            return;
        }
    }
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
        if (item.classList.contains('cg-form-wrap')) {
            const formId = parseInt((_b = item.getAttribute('data-form-id')) !== null && _b !== void 0 ? _b : '0');
            changeFocus(formId);
            hidePop();
            return;
        }
    }
    hidePop();
    changeFocus();
}
exports.doFocusAndPopEvent = doFocusAndPopEvent;
window.addEventListener('touchstart', doFocusAndPopEvent, {
    'passive': true
});
window.addEventListener('mousedown', doFocusAndPopEvent);
function remove(formId) {
    const taskId = getTaskId(formId);
    let title = '';
    let icon = '';
    if (task.list[taskId].forms[formId]) {
        title = task.list[taskId].forms[formId].vroot.$refs.form.title;
        icon = task.list[taskId].forms[formId].vroot.$refs.form.iconDataUrl;
        const io = task.list[taskId].runtime.dialogFormIds.indexOf(formId);
        if (io > -1) {
            task.list[taskId].runtime.dialogFormIds.splice(io, 1);
        }
        task.list[taskId].forms[formId].vroot.$refs.form.$data.isShow = false;
        setTimeout(function () {
            var _a;
            const fid = getMaxZIndexID({
                'formIds': [formId]
            });
            if (fid) {
                changeFocus(fid);
            }
            else {
                changeFocus();
            }
            if (!task.list[taskId]) {
                return true;
            }
            task.list[taskId].forms[formId].vapp.unmount();
            task.list[taskId].forms[formId].vapp._container.remove();
            (_a = exports.elements.popList.querySelector('[data-form-id="' + formId.toString() + '"]')) === null || _a === void 0 ? void 0 : _a.remove();
            if (io > -1) {
                task.list[taskId].forms[formId].vroot.cgDialogCallback();
            }
            delete task.list[taskId].forms[formId];
            dom.removeStyle(taskId, 'form', formId);
            core.trigger('formRemoved', taskId, formId, title, icon);
            dom.clearWatchStyle(formId);
            dom.clearPropertyStyle(formId);
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
exports.remove = remove;
function getForm(taskId, formId) {
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
function create(opt) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        if (!opt.taskId) {
            return -1;
        }
        const t = task.list[opt.taskId];
        if (!t) {
            return -2;
        }
        const formId = ++info.lastId;
        const components = control.buildComponents(t.id, formId, (_a = opt.path) !== null && _a !== void 0 ? _a : '');
        if (!components) {
            return -3;
        }
        let data = {};
        let access = {};
        let methods = undefined;
        let computed = {};
        let beforeCreate = undefined;
        let created = undefined;
        let beforeMount = undefined;
        let mounted = undefined;
        let beforeUpdate = undefined;
        let updated = undefined;
        let beforeUnmount = undefined;
        let unmounted = undefined;
        if (opt.code) {
            data = (_b = opt.code.data) !== null && _b !== void 0 ? _b : {};
            access = (_c = opt.code.access) !== null && _c !== void 0 ? _c : {};
            methods = opt.code.methods;
            computed = (_d = opt.code.computed) !== null && _d !== void 0 ? _d : {};
            beforeCreate = opt.code.beforeCreate;
            created = opt.code.created;
            beforeMount = opt.code.beforeMount;
            mounted = opt.code.mounted;
            beforeUpdate = opt.code.beforeUpdate;
            updated = opt.code.updated;
            beforeUnmount = opt.code.beforeUnmount;
            unmounted = opt.code.unmounted;
        }
        let style = '';
        let prep = '';
        if (opt.style) {
            const r = tool.stylePrepend(opt.style);
            prep = r.prep;
            style = yield tool.styleUrl2DataUrl((_e = opt.path) !== null && _e !== void 0 ? _e : '/', r.style, t.app.files);
        }
        let layout = tool.purify(opt.layout);
        layout = tool.layoutAddTagClassAndReTagName(layout, true);
        layout = tool.layoutInsertAttr(layout, ':form-focus=\'formFocus\'', {
            'include': [/^cg-.+/]
        });
        const prepList = ['cg-task' + opt.taskId.toString() + '_'];
        if (prep !== '') {
            prepList.push(prep);
        }
        layout = tool.layoutClassPrepend(layout, prepList);
        layout = tool.eventsAttrWrap(layout);
        if (layout.includes('<teleport')) {
            layout = tool.teleportGlue(layout, formId);
        }
        exports.elements.list.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId.toString()}" data-task-id="${opt.taskId.toString()}"></div>`);
        exports.elements.popList.insertAdjacentHTML('beforeend', `<div data-form-id="${formId.toString()}" data-task-id="${opt.taskId.toString()}"></div>`);
        const el = exports.elements.list.children.item(exports.elements.list.children.length - 1);
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
        data._formFocus = false;
        computed.path = {
            get: function () {
                var _a;
                return (_a = opt.path) !== null && _a !== void 0 ? _a : '';
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
                    'content': `The software tries to modify the system variable "cgPrep".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        data._topMost = false;
        computed.topMost = {
            get: function () {
                return this._topMost;
            },
            set: function (v) {
                const form = t.forms[formId];
                if (!form) {
                    return;
                }
                if (v) {
                    form.vroot.$data._topMost = true;
                    if (!form.vroot._formFocus) {
                        changeFocus(form.id);
                    }
                    else {
                        form.vroot.$refs.form.$data.zIndex = ++info.topLastZIndex;
                    }
                }
                else {
                    form.vroot.$data._topMost = false;
                    form.vroot.$refs.form.$data.zIndex = ++info.lastZIndex;
                }
                return;
            }
        };
        if (style) {
            dom.pushStyle(opt.taskId, style, 'form', formId);
        }
        const rtn = yield new Promise(function (resolve) {
            const vapp = clickgo.vue.createApp({
                'template': layout.replace(/^<cg-form/, '<cg-form ref="form"'),
                'data': function () {
                    return tool.clone(data);
                },
                'methods': methods,
                'computed': computed,
                'beforeCreate': beforeCreate,
                'created': function () {
                    this.access = tool.clone(access);
                    created === null || created === void 0 ? void 0 : created.call(this);
                },
                'beforeMount': beforeMount,
                'mounted': function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.$nextTick();
                        if (this.$refs.form.icon) {
                            const icon = yield fs.getContent(this.$refs.form.icon, {
                                'current': t.current,
                                'files': t.app.files
                            });
                            this.$refs.form.iconDataUrl = (icon instanceof Blob) ? yield tool.blob2DataUrl(icon) : '';
                        }
                        resolve({
                            'vapp': vapp,
                            'vroot': this
                        });
                    });
                },
                'beforeUpdate': beforeUpdate,
                'updated': updated,
                'beforeUnmount': beforeUnmount,
                'unmounted': unmounted
            });
            vapp.config.errorHandler = function (err, vm, info) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\nTask id: ${vm.taskId}\nForm id: ${vm.formId}`,
                    'type': 'danger'
                });
                core.trigger('error', vm.taskId, vm.formId, err, info + '(-3,' + vm.taskId + ',' + vm.formId + ')');
            };
            for (const key in components) {
                vapp.component(key, components[key]);
            }
            try {
                vapp.mount(el);
            }
            catch (err) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\nTask id: ${opt.taskId}\nForm id: ${formId}`,
                    'type': 'danger'
                });
                core.trigger('error', opt.taskId, formId, err, err.message + '(-2)');
            }
        });
        const nform = {
            'id': formId,
            'vapp': rtn.vapp,
            'vroot': rtn.vroot
        };
        t.forms[formId] = nform;
        yield tool.sleep(34);
        if (mounted) {
            try {
                yield mounted.call(rtn.vroot, opt.data);
            }
            catch (err) {
                core.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error.');
                delete t.forms[formId];
                try {
                    rtn.vapp.unmount();
                }
                catch (err) {
                    const msg = `Message: ${err.message}\nTask id: ${opt.taskId}\nForm id: ${formId}\nFunction: form.create, unmount.`;
                    notify({
                        'title': 'Form Unmount Error',
                        'content': msg,
                        'type': 'danger'
                    });
                    console.log('Form Unmount Error', msg, err);
                }
                rtn.vapp._container.remove();
                (_f = exports.elements.popList.querySelector('[data-form-id="' + rtn.vroot.formId + '"]')) === null || _f === void 0 ? void 0 : _f.remove();
                dom.clearWatchStyle(rtn.vroot.formId);
                dom.clearPropertyStyle(rtn.vroot.formId);
                dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
                return -8;
            }
        }
        core.trigger('formCreated', opt.taskId, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconDataUrl);
        if (clickgo.isNative() && (formId === 1) && !clickgo.isImmersion() && !clickgo.hasFrame()) {
            rtn.vroot.$refs.form.isNativeSync = true;
            native.invoke('cg-set-size', native.getToken(), rtn.vroot.$refs.form.$el.offsetWidth, rtn.vroot.$refs.form.$el.offsetHeight);
            window.addEventListener('resize', function () {
                rtn.vroot.$refs.form.setPropData('width', window.innerWidth);
                rtn.vroot.$refs.form.setPropData('height', window.innerHeight);
            });
        }
        return formId;
    });
}
exports.create = create;
function dialog(opt) {
    return new Promise(function (resolve) {
        var _a, _b, _c;
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
            nopt.buttons = [(_b = (_a = info.locale[locale]) === null || _a === void 0 ? void 0 : _a.ok) !== null && _b !== void 0 ? _b : info.locale['en'].ok];
        }
        const cls = class extends AbstractForm {
            constructor() {
                super(...arguments);
                this.buttons = nopt.buttons;
            }
            get taskId() {
                return taskId;
            }
            select(button) {
                var _a;
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    }
                };
                (_a = nopt.select) === null || _a === void 0 ? void 0 : _a.call(nopt, event, button);
                if (event.go) {
                    this.dialogResult = button;
                    close(this.formId);
                }
            }
        };
        cls.create(undefined, `<form title="${(_c = nopt.title) !== null && _c !== void 0 ? _c : 'dialog'}" min="false" max="false" resize="false" height="0" width="0" border="${nopt.title ? 'normal' : 'plain'}" direction="v"><dialog :buttons="buttons" @select="select"${nopt.direction ? ` direction="${nopt.direction}"` : ''}>${nopt.content}</dialog></form>`).then((frm) => {
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
exports.dialog = dialog;
function confirm(opt) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function* () {
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
        const buttons = [(_b = (_a = info.locale[locale]) === null || _a === void 0 ? void 0 : _a.yes) !== null && _b !== void 0 ? _b : info.locale['en'].yes, (_d = (_c = info.locale[locale]) === null || _c === void 0 ? void 0 : _c.no) !== null && _d !== void 0 ? _d : info.locale['en'].no];
        if (opt.cancel) {
            buttons.push((_f = (_e = info.locale[locale]) === null || _e === void 0 ? void 0 : _e.cancel) !== null && _f !== void 0 ? _f : info.locale['en'].cancel);
        }
        const res = yield dialog({
            'taskId': taskId,
            'content': opt.content,
            'buttons': buttons
        });
        if (res === ((_h = (_g = info.locale[locale]) === null || _g === void 0 ? void 0 : _g.yes) !== null && _h !== void 0 ? _h : info.locale['en'].yes)) {
            return true;
        }
        if (res === ((_k = (_j = info.locale[locale]) === null || _j === void 0 ? void 0 : _j.cancel) !== null && _k !== void 0 ? _k : info.locale['en'].cancel)) {
            return 0;
        }
        return false;
    });
}
exports.confirm = confirm;
function flash(formId, taskId) {
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
    core.trigger('formFlash', taskId, formId);
}
exports.flash = flash;
function showLauncher() {
    exports.elements.launcher.style.display = 'flex';
    requestAnimationFrame(function () {
        exports.elements.launcher.classList.add('cg-show');
    });
}
exports.showLauncher = showLauncher;
function hideLauncher() {
    exports.elements.launcher.classList.remove('cg-show');
    setTimeout(function () {
        if (exports.launcherRoot.folderName !== '') {
            exports.launcherRoot.closeFolder();
        }
        exports.launcherRoot.name = '';
        exports.elements.launcher.style.display = 'none';
    }, 300);
}
exports.hideLauncher = hideLauncher;
window.addEventListener('resize', function () {
    task.refreshSystemPosition();
});
