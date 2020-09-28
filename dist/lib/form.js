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
exports.create = exports.remove = exports.doFocusAndPopEvent = exports.hidePop = exports.showPop = exports.removeFromPop = exports.appendToPop = exports.hideRectangle = exports.showRectangle = exports.moveRectangle = exports.showCircular = exports.getRectByDir = exports.changeFocus = exports.lastPopZIndex = exports.lastTopZIndex = exports.lastZIndex = exports.lastFormId = exports.popShowing = void 0;
exports.lastFormId = 0;
exports.lastZIndex = 999;
exports.lastTopZIndex = 9999999;
exports.lastPopZIndex = 0;
let formListElement = document.createElement('div');
formListElement.style.zoom = clickgo.zoom.toString();
formListElement.classList.add('cg-form-list');
document.getElementsByTagName('body')[0].appendChild(formListElement);
formListElement.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, {
    'passive': false
});
let popListElement = document.createElement('div');
popListElement.id = 'cg-pop-list';
popListElement.style.zoom = clickgo.zoom.toString();
popListElement.classList.add('cg-pop-list');
popListElement.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
document.getElementsByTagName('body')[0].appendChild(popListElement);
popListElement.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, {
    'passive': false
});
let circularElement = document.createElement('div');
circularElement.style.zoom = clickgo.zoom.toString();
circularElement.classList.add('cg-circular');
document.getElementsByTagName('body')[0].appendChild(circularElement);
let rectangleElement = document.createElement('div');
rectangleElement.style.zoom = clickgo.zoom.toString();
rectangleElement.setAttribute('data-pos', '');
rectangleElement.classList.add('cg-rectangle');
document.getElementsByTagName('body')[0].appendChild(rectangleElement);
function changeFocus(formId = 0, vm) {
    var _a, _b;
    let focusElement = document.querySelector('.cg-form-list > .cg-focus');
    if (focusElement) {
        let dataFormId = focusElement.getAttribute('data-form-id');
        if (dataFormId) {
            let dataFormIdNumber = parseInt(dataFormId);
            if (dataFormIdNumber === formId) {
                return;
            }
            else {
                let taskId = parseInt((_a = focusElement.getAttribute('data-task-id')) !== null && _a !== void 0 ? _a : '0');
                let task = clickgo.core.tasks[taskId];
                task.forms[dataFormIdNumber].vapp._container.classList.remove('cg-focus');
                task.forms[dataFormIdNumber].vroot.focus = false;
                clickgo.core.trigger('formBlurred', taskId, dataFormIdNumber);
            }
        }
        else {
            return;
        }
    }
    if (formId !== 0) {
        let el = document.querySelector(`.cg-form-list > [data-form-id='${formId}']`);
        if (el) {
            let taskId;
            if (vm) {
                if (!vm.$data._customZIndex) {
                    if (vm.$data._topMost) {
                        vm.$refs.form.setPropData('zIndex', ++exports.lastTopZIndex);
                    }
                    else {
                        vm.$refs.form.setPropData('zIndex', ++exports.lastZIndex);
                    }
                }
                vm.$el.parentNode.classList.add('cg-focus');
                vm.focus = true;
                taskId = vm.taskId;
            }
            else {
                taskId = parseInt((_b = el.getAttribute('data-task-id')) !== null && _b !== void 0 ? _b : '0');
                let task = clickgo.core.tasks[taskId];
                if (!task.forms[formId].vroot.$data._customZIndex) {
                    if (task.forms[formId].vroot.$data._topMost) {
                        task.forms[formId].vroot.$refs.form.setPropData('zIndex', ++exports.lastTopZIndex);
                    }
                    else {
                        task.forms[formId].vroot.$refs.form.setPropData('zIndex', ++exports.lastZIndex);
                    }
                }
                task.forms[formId].vapp._container.classList.add('cg-focus');
                task.forms[formId].vroot.focus = true;
            }
            clickgo.core.trigger('formFocused', taskId, formId);
        }
    }
}
exports.changeFocus = changeFocus;
function getRectByDir(dir) {
    var _a, _b, _c, _d;
    let position = clickgo.getPosition();
    let width, height, left, top;
    if (typeof dir === 'string') {
        switch (dir) {
            case 'lt': {
                width = position.width / 2;
                height = position.height / 2;
                left = position.left;
                top = position.top;
                break;
            }
            case 't': {
                width = position.width;
                height = position.height;
                left = position.left;
                top = position.top;
                break;
            }
            case 'tr': {
                width = position.width / 2;
                height = position.height / 2;
                left = position.left + position.width / 2;
                top = position.top;
                break;
            }
            case 'r': {
                width = position.width / 2;
                height = position.height;
                left = position.left + position.width / 2;
                top = position.top;
                break;
            }
            case 'rb': {
                width = position.width / 2;
                height = position.height / 2;
                left = position.left + position.width / 2;
                top = position.top + position.height / 2;
                break;
            }
            case 'b': {
                width = position.width;
                height = position.height / 2;
                left = position.left;
                top = position.top + position.height / 2;
                break;
            }
            case 'bl': {
                width = position.width / 2;
                height = position.height / 2;
                left = position.left;
                top = position.top + position.height / 2;
                break;
            }
            case 'l': {
                width = position.width / 2;
                height = position.height;
                left = position.left;
                top = position.top;
                break;
            }
        }
    }
    else {
        width = (_a = dir.width) !== null && _a !== void 0 ? _a : position.width;
        height = (_b = dir.height) !== null && _b !== void 0 ? _b : position.height;
        left = (_c = dir.left) !== null && _c !== void 0 ? _c : position.left;
        top = (_d = dir.top) !== null && _d !== void 0 ? _d : position.top;
    }
    return {
        'width': width,
        'height': height,
        'left': left,
        'top': top
    };
}
exports.getRectByDir = getRectByDir;
function showCircular(x, y) {
    circularElement.style.transition = 'none';
    circularElement.style.width = '6px';
    circularElement.style.height = '6px';
    circularElement.style.left = x - 3 + 'px';
    circularElement.style.top = y - 3 + 'px';
    circularElement.style.opacity = '1';
    requestAnimationFrame(function () {
        circularElement.style.transition = 'all .3s ease-out';
        circularElement.style.width = '60px';
        circularElement.style.height = '60px';
        circularElement.style.left = x - 30 + 'px';
        circularElement.style.top = y - 30 + 'px';
        circularElement.style.opacity = '0';
    });
}
exports.showCircular = showCircular;
function moveRectangle(dir) {
    var _a, _b, _c, _d;
    let dataReady = (_a = rectangleElement.getAttribute('data-ready')) !== null && _a !== void 0 ? _a : '0';
    if (dataReady === '0') {
        return;
    }
    let dataDir = (_b = rectangleElement.getAttribute('data-dir')) !== null && _b !== void 0 ? _b : '';
    let setDataDir = typeof dir === 'string' ? dir : 'o-' + dir.left + '-' + ((_c = dir.top) !== null && _c !== void 0 ? _c : 'n') + '-' + dir.width + '-' + ((_d = dir.height) !== null && _d !== void 0 ? _d : 'n');
    if (dataDir === setDataDir) {
        return;
    }
    rectangleElement.setAttribute('data-dir', setDataDir);
    let pos = getRectByDir(dir);
    let width = pos.width - 20;
    let height = pos.height - 20;
    let left = pos.left + 10;
    let top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        rectangleElement.style.width = width + 'px';
        rectangleElement.style.height = height + 'px';
        rectangleElement.style.left = left + 'px';
        rectangleElement.style.top = top + 'px';
    }
}
exports.moveRectangle = moveRectangle;
function showRectangle(x, y, pos) {
    rectangleElement.style.transition = 'none';
    rectangleElement.style.width = '20px';
    rectangleElement.style.height = '20px';
    rectangleElement.style.left = x - 10 + 'px';
    rectangleElement.style.top = y - 10 + 'px';
    rectangleElement.style.opacity = '1';
    rectangleElement.setAttribute('data-ready', '0');
    rectangleElement.setAttribute('data-dir', '');
    requestAnimationFrame(function () {
        rectangleElement.style.transition = 'all .2s ease-out';
        rectangleElement.setAttribute('data-ready', '1');
        moveRectangle(pos);
    });
}
exports.showRectangle = showRectangle;
function hideRectangle() {
    rectangleElement.style.opacity = '0';
}
exports.hideRectangle = hideRectangle;
function appendToPop(el) {
    popListElement.appendChild(el);
}
exports.appendToPop = appendToPop;
function removeFromPop(el) {
    popListElement.removeChild(el);
}
exports.removeFromPop = removeFromPop;
function showPop(pop, x, y = 0) {
    if (!clickgo.element.findParentByClass(pop.$el, 'cg-pop-list')) {
        if (exports.popShowing) {
            exports.popShowing.hidePop();
        }
        exports.popShowing = pop;
    }
    let position = clickgo.getPosition();
    let left, top;
    if (typeof x === 'string') {
        let bcr = pop.$el.getBoundingClientRect();
        if (x === 'v') {
            left = bcr.left;
            top = bcr.top + bcr.height;
        }
        else {
            left = bcr.left + bcr.width - 2;
            top = bcr.top - 2;
        }
        if (pop.$el.offsetWidth + left > position.width) {
            if (y === 0) {
                left = position.width - pop.$el.offsetWidth;
            }
            else {
                left = bcr.left - pop.$el.offsetWidth + 2;
            }
        }
        if (pop.$el.offsetHeight + top > position.height) {
            if (y === 0) {
                top = bcr.top - pop.$el.offsetHeight;
            }
            else {
                top = position.height - pop.$el.offsetHeight;
            }
        }
    }
    else {
        left = x + 5;
        top = y + 7;
        if (pop.$el.offsetWidth + left > position.width) {
            left = x - pop.$el.offsetWidth - 5;
        }
        if (pop.$el.offsetHeight + top > position.height) {
            top = y - pop.$el.offsetHeight - 5;
        }
    }
    if (left < 0) {
        left = 0;
    }
    if (top < 0) {
        top = 0;
    }
    return {
        'left': left + 'px',
        'top': top + 'px',
        'zIndex': (++exports.lastPopZIndex).toString()
    };
}
exports.showPop = showPop;
function hidePop(pop = null) {
    if (!pop) {
        if (!exports.popShowing) {
            return;
        }
        pop = exports.popShowing;
        exports.popShowing = null;
    }
    else if (pop === exports.popShowing) {
        exports.popShowing = null;
    }
    pop.hidePop();
}
exports.hidePop = hidePop;
function doFocusAndPopEvent(e) {
    var _a;
    if (e instanceof MouseEvent && clickgo.hasTouch) {
        return;
    }
    let target = e.target;
    if (!target) {
        return;
    }
    let element = target;
    if (element.classList.contains('cg-pop-open')) {
        return;
    }
    element = element.parentNode;
    while (element) {
        if (!element.classList) {
            break;
        }
        if (element.classList.contains('cg-form-wrap')) {
            let formId = parseInt((_a = element.getAttribute('data-form-id')) !== null && _a !== void 0 ? _a : '0');
            changeFocus(formId);
            hidePop();
            return;
        }
        if (element.classList.contains('cg-pop-list') || element.classList.contains('cg-pop-open')) {
            return;
        }
        element = element.parentNode;
    }
    hidePop();
    changeFocus();
}
exports.doFocusAndPopEvent = doFocusAndPopEvent;
if ('ontouchstart' in document.documentElement) {
    window.addEventListener('touchstart', doFocusAndPopEvent);
}
else {
    window.addEventListener('mousedown', doFocusAndPopEvent);
}
function remove(formId) {
    let formElement = formListElement.querySelector(`[data-form-id='${formId}']`);
    if (!formElement) {
        return false;
    }
    let taskIdAttr = formElement.getAttribute('data-task-id');
    if (!taskIdAttr) {
        return false;
    }
    let taskId = parseInt(taskIdAttr);
    if (Object.keys(clickgo.core.tasks[taskId].forms).length === 1) {
        return clickgo.core.endTask(taskId);
    }
    let title = '';
    if (clickgo.core.tasks[taskId].forms[formId]) {
        title = clickgo.core.tasks[taskId].forms[formId].vroot.$refs.form.title;
        if (clickgo.core.tasks[taskId].forms[formId].vroot.$refs.form.maskFrom !== undefined) {
            let fid = clickgo.core.tasks[taskId].forms[formId].vroot.$refs.form.maskFrom;
            clickgo.core.tasks[taskId].forms[fid].vroot.$refs.form.maskFor = undefined;
        }
        clickgo.core.tasks[taskId].forms[formId].vapp.unmount();
        delete (clickgo.core.tasks[taskId].forms[formId]);
    }
    clickgo.tool.removeStyle(taskId, formId);
    formListElement.removeChild(formElement);
    clickgo.core.trigger('formRemoved', taskId, formId, { 'title': title });
    return true;
}
exports.remove = remove;
function create(opt) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        if (!opt.taskId) {
            return -109;
        }
        if (!opt.dir) {
            opt.dir = opt.file;
        }
        let appPkg = clickgo.core.tasks[opt.taskId].appPkg;
        let formId = ++exports.lastFormId;
        let controlsStyle = '';
        let components = {};
        for (let controlPath of appPkg.config.controls) {
            let controlPkg;
            if (controlPath.slice(0, 9) === '/clickgo/') {
                let path = controlPath.slice(8);
                if (clickgo.core.clickgoControlPkgs[path + '.cgc']) {
                    controlPkg = clickgo.core.clickgoControlPkgs[path + '.cgc'];
                }
                else {
                    return -108;
                }
            }
            else if (clickgo.core.tasks[opt.taskId].controlPkgs[controlPath + '.cgc']) {
                controlPkg = clickgo.core.tasks[opt.taskId].controlPkgs[controlPath + '.cgc'];
            }
            else {
                let controlBlob = appPkg.files[controlPath + '.cgc'];
                if (!controlBlob) {
                    return -101;
                }
                controlPkg = yield clickgo.tool.controlBlob2Pkg(controlBlob);
                if (!controlPkg) {
                    return -102;
                }
                clickgo.core.tasks[opt.taskId].controlPkgs[controlPath + '.cgc'] = controlPkg;
            }
            for (let name in controlPkg) {
                let item = controlPkg[name];
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
                if (item.files[item.config.code + '.js']) {
                    let [expo] = (_a = yield loader.requireMemory(item.config.code, item.files)) !== null && _a !== void 0 ? _a : [];
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
                let rand = '';
                let styleBlob = item.files[item.config.style + '.css'];
                if (styleBlob) {
                    let r = clickgo.tool.stylePrepend(yield clickgo.tool.blob2Text(styleBlob));
                    rand = r.rand;
                    controlsStyle += yield clickgo.tool.styleUrl2DataUrl(item.config.style, r.style, item.files);
                }
                let layoutBlob = item.files[item.config.layout + '.html'];
                if (!layoutBlob) {
                    return -103;
                }
                let randList = [
                    'cg-theme-global-' + name + '_',
                    'cg-theme-task' + opt.taskId + '-' + name + '_'
                ];
                if (rand !== '') {
                    randList.push(rand);
                }
                let r = clickgo.tool.layoutClassPrepend(yield clickgo.tool.blob2Text(layoutBlob), randList);
                let layout = r.layout;
                props.focus = {
                    'focus': {
                        'default': false
                    }
                };
                data.taskId = opt.taskId;
                data.formId = formId;
                data._dir = (_b = opt.dir) !== null && _b !== void 0 ? _b : '/';
                data._scope = rand;
                data._controlName = name;
                methods.cgStopPropagation = function (e) {
                    if (e instanceof MouseEvent && clickgo.hasTouch) {
                        return;
                    }
                    e.stopPropagation();
                    doFocusAndPopEvent(e);
                };
                methods.cgDown = function (e) {
                    if (e instanceof MouseEvent && clickgo.hasTouch) {
                        return;
                    }
                    this.$emit('down', e);
                };
                methods.cgTap = function (e) {
                    if (this.$el.className.indexOf('cg-disabled') !== -1) {
                        return;
                    }
                    this.$emit('tap', e);
                };
                methods.cgDblclick = function (e) {
                    e.stopPropagation();
                    if (this.$el.className.indexOf('cg-disabled') !== -1) {
                        return;
                    }
                    this.$emit('dblclick', e);
                };
                methods.cgGetBlob = function (file) {
                    var _a;
                    file = clickgo.tool.pathResolve(this.$data._dir, file);
                    return (_a = clickgo.core.tasks[this.taskId].appPkg.files[file]) !== null && _a !== void 0 ? _a : null;
                };
                methods.cgGetDataUrl = function (file) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let f = this.cgGetBlob(file);
                        return f ? yield clickgo.tool.blob2DataUrl(f) : null;
                    });
                };
                methods.cgClassPrepend = function (cla) {
                    if (typeof cla !== 'string') {
                        return cla;
                    }
                    if (cla.slice(0, 3) === 'cg-') {
                        return cla;
                    }
                    return `cg-theme-global-${this.$data._controlName}_${cla} cg-theme-task${this.taskId}-${this.$data._controlName}_${cla} ${this.$data._scope}${cla}`;
                };
                methods.cgSlos = function (name = 'default') {
                    let d = this.$slots[name];
                    if (!d) {
                        return [];
                    }
                    let slots = [];
                    let list = d();
                    for (let item of list) {
                        if (typeof item.type === 'symbol') {
                            for (let item2 of item.children) {
                                slots.push(item2);
                            }
                        }
                        else {
                            slots.push(item);
                        }
                    }
                    return slots;
                };
                components['cg-' + name] = {
                    'template': layout,
                    'props': props,
                    'data': function () {
                        return clickgo.tool.clone(data);
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
                    'beforeUnmount': beforeUnmount,
                    'unmounted': unmounted,
                    'components': {}
                };
            }
        }
        for (let name in components) {
            let reg = /<cg-(.+?)[ >]/g;
            let match;
            while ((match = reg.exec(components[name].template))) {
                if (!components['cg-' + match[1]]) {
                    continue;
                }
                components[name].components['cg-' + match[1]] = components['cg-' + match[1]];
            }
        }
        let style = opt.style;
        let layout = opt.layout;
        if (opt.file) {
            let layoutBlob = appPkg.files[opt.file + '.xml'];
            if (layoutBlob) {
                layout = yield clickgo.tool.blob2Text(layoutBlob);
            }
            let styleBlob = appPkg.files[opt.file + '.css'];
            if (styleBlob) {
                style = yield clickgo.tool.blob2Text(styleBlob);
            }
        }
        if (!layout) {
            return -104;
        }
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
        if (appPkg.files[opt.file + '.js']) {
            let [expo] = (_d = yield loader.requireMemory((_c = opt.file) !== null && _c !== void 0 ? _c : '', appPkg.files)) !== null && _d !== void 0 ? _d : [];
            if (expo) {
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
        let rand = '';
        if (style) {
            let r = clickgo.tool.stylePrepend(style);
            rand = r.rand;
            style = yield clickgo.tool.styleUrl2DataUrl((_e = opt.dir) !== null && _e !== void 0 ? _e : '/', r.style, appPkg.files);
        }
        layout = clickgo.tool.layoutInsertAttr(layout, ':focus=\'focus\'');
        layout = clickgo.tool.purify(layout.replace(/<(\/{0,1})(.+?)>/g, function (t, t1, t2) {
            if (t2 === 'template') {
                return t;
            }
            else {
                return '<' + t1 + 'cg-' + t2 + '>';
            }
        }));
        let randList = ['cg-task' + opt.taskId + '_'];
        if (rand !== '') {
            randList.push(rand);
        }
        let r = clickgo.tool.layoutClassPrepend(layout, randList);
        formListElement.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId.toString()}" data-task-id="${opt.taskId.toString()}">${r.layout}</div>`);
        let el = formListElement.children.item(formListElement.children.length - 1);
        (_f = el.children.item(0)) === null || _f === void 0 ? void 0 : _f.setAttribute('ref', 'form');
        data.taskId = opt.taskId;
        data.formId = formId;
        data._dir = (_g = opt.dir) !== null && _g !== void 0 ? _g : '/';
        data._scope = rand;
        data.focus = false;
        data._customZIndex = false;
        if (opt.topMost) {
            data._topMost = true;
        }
        else {
            data._topMost = false;
        }
        methods.createForm = function (paramOpt, cfOpt = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                let inOpt = {
                    'taskId': opt.taskId
                };
                if (typeof paramOpt === 'string') {
                    inOpt.file = paramOpt;
                }
                else {
                    if (paramOpt.dir) {
                        inOpt.dir = paramOpt.dir;
                    }
                    if (paramOpt.file) {
                        inOpt.file = paramOpt.file;
                    }
                    if (paramOpt.code) {
                        inOpt.code = paramOpt.code;
                    }
                    if (paramOpt.layout) {
                        inOpt.layout = paramOpt.layout;
                    }
                    if (paramOpt.style) {
                        inOpt.style = paramOpt.style;
                    }
                }
                if (cfOpt.mask) {
                    this.$refs.form.maskFor = true;
                }
                if (this.$data._topMost) {
                    inOpt.topMost = true;
                }
                let form = yield create(inOpt);
                if (typeof form === 'number') {
                    this.$refs.form.maskFor = undefined;
                }
                else {
                    if (this.$refs.form.maskFor) {
                        this.$refs.form.maskFor = form.id;
                        form.vroot.$refs.form.maskFrom = this.formId;
                    }
                }
            });
        };
        methods.closeForm = function () {
            remove(this.formId);
        };
        methods.bindFormDrag = function (e) {
            this.$refs.form.moveMethod(e);
        };
        methods.setSystemEventListener = function (name, func) {
            this.cgEventList[name] = func;
        };
        methods.removeSystemEventListener = function (name) {
            delete (this.cgEventList[name]);
        };
        methods.getBlob = function (file) {
            var _a;
            file = clickgo.tool.pathResolve(this.$data._dir, file);
            return (_a = clickgo.core.tasks[this.taskId].appPkg.files[file]) !== null && _a !== void 0 ? _a : null;
        };
        methods.getDataUrl = function (file) {
            return __awaiter(this, void 0, void 0, function* () {
                let f = this.cgGetBlob(file);
                return f ? yield clickgo.tool.blob2DataUrl(f) : null;
            });
        };
        methods.loadTheme = function (path) {
            return __awaiter(this, void 0, void 0, function* () {
                yield clickgo.theme.load(path, this.taskId);
            });
        };
        methods.clearTheme = function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield clickgo.theme.clear(this.taskId);
            });
        };
        methods.setTheme = function (path) {
            return __awaiter(this, void 0, void 0, function* () {
                yield clickgo.theme.clear(this.taskId);
                yield clickgo.theme.load(path, this.taskId);
            });
        };
        methods.setTopMost = function (top) {
            this.$data._customZIndex = false;
            if (top) {
                this.$data._topMost = true;
                if (!this.focus) {
                    changeFocus(this.formId, this);
                }
                else {
                    this.$refs.form.setPropData('zIndex', ++exports.lastTopZIndex);
                }
            }
            else {
                this.$data._topMost = false;
                this.$refs.form.setPropData('zIndex', ++exports.lastZIndex);
            }
        };
        methods.flash = function () {
            if (!this.focus) {
                changeFocus(this.formId);
            }
            if (this.$refs.form.flashTimer) {
                clearTimeout(this.$refs.form.flashTimer);
                this.$refs.form.flashTimer = undefined;
            }
            this.$refs.form.flashTimer = setTimeout(() => {
                this.$refs.form.flashTimer = undefined;
            }, 1000);
            clickgo.core.trigger('formFlash', opt.taskId, formId);
        };
        methods.cgClassPrepend = function (cla) {
            if (typeof cla !== 'string') {
                return cla;
            }
            if (cla.slice(0, 3) === 'cg-') {
                return cla;
            }
            return `cg-task${this.taskId}_${cla} ${this.$data._scope}${cla}`;
        };
        let rtn = yield new Promise(function (resolve) {
            const vapp = Vue.createApp({
                'data': function () {
                    return clickgo.tool.clone(data);
                },
                'methods': methods,
                'computed': computed,
                'watch': watch,
                'components': components,
                'beforeCreate': beforeCreate,
                'created': created,
                'beforeMount': beforeMount,
                'mounted': function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.$nextTick();
                        if (this.$el.getAttribute !== undefined) {
                            resolve({
                                'vapp': vapp,
                                'vroot': this
                            });
                        }
                        else {
                            if (this.$el.parentNode) {
                                vapp.unmount();
                                clickgo.tool.removeStyle(this.taskId, this.formId);
                                formListElement.removeChild(vapp._container);
                            }
                            resolve(null);
                        }
                    });
                },
                'beforeUpdate': beforeUpdate,
                'updated': function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.$nextTick();
                        updated === null || updated === void 0 ? void 0 : updated.call(this);
                    });
                },
                'beforeUnmount': beforeUnmount,
                'unmounted': unmounted,
            });
            vapp.mount(el);
        });
        if (!rtn) {
            return -106;
        }
        rtn.vapp.config.globalProperties.cgEventList = {};
        if (controlsStyle !== '') {
            clickgo.tool.pushStyle(controlsStyle, opt.taskId, 'controls', formId);
        }
        if (style) {
            clickgo.tool.pushStyle(style, opt.taskId, 'forms', formId);
        }
        let position = clickgo.getPosition();
        if (!rtn.vroot.$refs.form.stateMaxData) {
            if (rtn.vroot.$refs.form.left === -1) {
                rtn.vroot.$refs.form.setPropData('left', (position.width - rtn.vroot.$el.offsetWidth) / 2);
            }
            if (rtn.vroot.$refs.form.top === -1) {
                rtn.vroot.$refs.form.setPropData('top', (position.height - rtn.vroot.$el.offsetHeight) / 2);
            }
        }
        if (rtn.vroot.$refs.form.zIndex !== -1) {
            rtn.vroot.$data._customZIndex = true;
        }
        if (mounted) {
            try {
                mounted.call(rtn.vroot);
            }
            catch (err) {
                formListElement.removeChild(rtn.vroot.$el);
                clickgo.tool.removeStyle(rtn.vroot.taskId, rtn.vroot.formId);
                if (clickgo.core.globalEvents.errorHandler) {
                    clickgo.core.globalEvents.errorHandler(rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error.');
                }
                else {
                    console.log(err);
                }
                return -105;
            }
        }
        changeFocus(formId, rtn.vroot);
        let form = {
            'id': formId,
            'vapp': rtn.vapp,
            'vroot': rtn.vroot,
            'win': null,
            'events': {}
        };
        if (!clickgo.core.tasks[opt.taskId]) {
            rtn.vapp.unmount();
            clickgo.tool.removeStyle(opt.taskId, formId);
            formListElement.removeChild(rtn.vapp._container);
            return -107;
        }
        clickgo.core.tasks[opt.taskId].forms[formId] = form;
        clickgo.core.trigger('formCreated', opt.taskId, formId, { 'title': rtn.vroot.$refs.form.title, 'icon': rtn.vroot.$refs.form.iconData });
        return form;
    });
}
exports.create = create;
window.addEventListener('resize', function () {
    for (let i = 0; i < formListElement.children.length; ++i) {
        let el = formListElement.children.item(i);
        let ef = el.children.item(0);
        if (ef.className.indexOf('cg-state-max') === -1) {
            continue;
        }
        let taskId = parseInt(el.getAttribute('data-task-id'));
        let formId = parseInt(el.getAttribute('data-form-id'));
        if (!clickgo.core.tasks[taskId]) {
            continue;
        }
        let vroot = clickgo.core.tasks[taskId].forms[formId].vroot;
        let position = clickgo.getPosition();
        vroot.$refs.form.setPropData('width', position.width);
        vroot.$refs.form.setPropData('height', position.height);
    }
    clickgo.core.trigger('screenResize');
});
