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
exports.create = exports.remove = exports.doFocusAndPopEvent = exports.hidePop = exports.showPop = exports.removeFromPop = exports.appendToPop = exports.hideRectangle = exports.showRectangle = exports.moveRectangle = exports.showCircular = exports.getRectByBorder = exports.getMaxZIndexFormID = exports.changeFocus = exports.lastPopZIndex = exports.lastTopZIndex = exports.lastZIndex = exports.lastFormId = exports.popShowing = void 0;
exports.lastFormId = 0;
exports.lastZIndex = 999;
exports.lastTopZIndex = 9999999;
exports.lastPopZIndex = 0;
let formListElement = document.createElement('div');
formListElement.classList.add('cg-form-list');
document.getElementsByTagName('body')[0].appendChild(formListElement);
formListElement.addEventListener('touchmove', function (e) {
    if (e.cancelable) {
        e.preventDefault();
    }
}, {
    'passive': false
});
formListElement.addEventListener('wheel', function (e) {
    e.preventDefault();
}, {
    'passive': false
});
let popListElement = document.createElement('div');
popListElement.id = 'cg-pop-list';
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
circularElement.classList.add('cg-circular');
document.getElementsByTagName('body')[0].appendChild(circularElement);
let rectangleElement = document.createElement('div');
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
                let task = clickgo.task.list[taskId];
                task.forms[dataFormIdNumber].vapp._container.classList.remove('cg-focus');
                task.forms[dataFormIdNumber].vroot.cgFocus = false;
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
                vm.cgFocus = true;
                taskId = vm.taskId;
            }
            else {
                taskId = parseInt((_b = el.getAttribute('data-task-id')) !== null && _b !== void 0 ? _b : '0');
                let task = clickgo.task.list[taskId];
                if (!task.forms[formId].vroot.$data._customZIndex) {
                    if (task.forms[formId].vroot.$data._topMost) {
                        task.forms[formId].vroot.$refs.form.setPropData('zIndex', ++exports.lastTopZIndex);
                    }
                    else {
                        task.forms[formId].vroot.$refs.form.setPropData('zIndex', ++exports.lastZIndex);
                    }
                }
                task.forms[formId].vapp._container.classList.add('cg-focus');
                task.forms[formId].vroot.cgFocus = true;
            }
            clickgo.core.trigger('formFocused', taskId, formId);
        }
    }
}
exports.changeFocus = changeFocus;
function getMaxZIndexFormID() {
    let zIndex = 0;
    let formId = null;
    let fl = document.querySelector('.cg-form-list');
    for (let i = 0; i < fl.children.length; ++i) {
        let root = fl.children.item(i);
        let formWrap = root.children.item(0);
        let z = parseInt(formWrap.style.zIndex);
        if (z > 9999999) {
            continue;
        }
        if (z > zIndex) {
            zIndex = z;
            formId = parseInt(root.getAttribute('data-form-id'));
        }
    }
    return formId;
}
exports.getMaxZIndexFormID = getMaxZIndexFormID;
function getRectByBorder(border) {
    var _a, _b, _c, _d;
    let position = clickgo.getPosition();
    let width, height, left, top;
    if (typeof border === 'string') {
        switch (border) {
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
        width = (_a = border.width) !== null && _a !== void 0 ? _a : position.width;
        height = (_b = border.height) !== null && _b !== void 0 ? _b : position.height;
        left = (_c = border.left) !== null && _c !== void 0 ? _c : position.left;
        top = (_d = border.top) !== null && _d !== void 0 ? _d : position.top;
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
    circularElement.style.transition = 'none';
    requestAnimationFrame(function () {
        circularElement.style.width = '6px';
        circularElement.style.height = '6px';
        circularElement.style.left = x - 3 + 'px';
        circularElement.style.top = y - 3 + 'px';
        circularElement.style.opacity = '1';
        requestAnimationFrame(function () {
            circularElement.style.transition = 'all .3s ease-out';
            requestAnimationFrame(function () {
                circularElement.style.width = '60px';
                circularElement.style.height = '60px';
                circularElement.style.left = x - 30 + 'px';
                circularElement.style.top = y - 30 + 'px';
                circularElement.style.opacity = '0';
            });
        });
    });
}
exports.showCircular = showCircular;
function moveRectangle(border) {
    var _a, _b, _c, _d;
    let dataReady = (_a = rectangleElement.getAttribute('data-ready')) !== null && _a !== void 0 ? _a : '0';
    if (dataReady === '0') {
        return;
    }
    let dataBorder = (_b = rectangleElement.getAttribute('data-border')) !== null && _b !== void 0 ? _b : '';
    let setDataBorder = typeof border === 'string' ? border : 'o-' + border.left + '-' + ((_c = border.top) !== null && _c !== void 0 ? _c : 'n') + '-' + border.width + '-' + ((_d = border.height) !== null && _d !== void 0 ? _d : 'n');
    if (dataBorder === setDataBorder) {
        return;
    }
    rectangleElement.setAttribute('data-dir', setDataBorder);
    let pos = getRectByBorder(border);
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
function showRectangle(x, y, border) {
    rectangleElement.style.transition = 'none';
    requestAnimationFrame(function () {
        rectangleElement.style.width = '20px';
        rectangleElement.style.height = '20px';
        rectangleElement.style.left = x - 10 + 'px';
        rectangleElement.style.top = y - 10 + 'px';
        rectangleElement.style.opacity = '1';
        rectangleElement.setAttribute('data-ready', '0');
        rectangleElement.setAttribute('data-dir', '');
        requestAnimationFrame(function () {
            rectangleElement.style.transition = 'all .2s ease-out';
            requestAnimationFrame(function () {
                rectangleElement.setAttribute('data-ready', '1');
                moveRectangle(border);
            });
        });
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
function showPop(pop, direction, size = {}) {
    var _a, _b, _c;
    if (pop.cgSelfPopOpen) {
        return;
    }
    if (!clickgo.dom.findParentByClass(pop.$el, 'cg-pop-list')) {
        if (exports.popShowing) {
            exports.popShowing.cgHidePop();
        }
        exports.popShowing = pop;
    }
    pop.cgSelfPopOpen = true;
    (_a = pop.cgParentPopLayer.cgChildPopItemShowing) === null || _a === void 0 ? void 0 : _a.cgHidePop();
    pop.cgParentPopLayer.cgChildPopItemShowing = pop;
    if (pop.cgSelfPop === undefined) {
        pop.cgPopPosition = {
            'left': '-5000px',
            'top': '0px',
            'zIndex': '0'
        };
        return;
    }
    let position = clickgo.getPosition();
    let width = (_b = size.width) !== null && _b !== void 0 ? _b : pop.cgSelfPop.$el.offsetWidth;
    let height = (_c = size.height) !== null && _c !== void 0 ? _c : pop.cgSelfPop.$el.offsetHeight;
    let left, top;
    if (typeof direction === 'string') {
        let bcr = pop.$el.getBoundingClientRect();
        if (direction === 'v') {
            left = bcr.left;
            top = bcr.top + bcr.height;
        }
        else {
            left = bcr.left + bcr.width - 2;
            top = bcr.top - 2;
        }
        if (width + left > position.width) {
            if (direction === 'v') {
                left = position.width - width;
            }
            else {
                left = bcr.left - width + 2;
            }
        }
        if (height + top > position.height) {
            if (direction === 'v') {
                top = bcr.top - height;
            }
            else {
                top = position.height - height;
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
        if (width + left > position.width) {
            left = x - width - 5;
        }
        if (height + top > position.height) {
            top = y - height - 5;
        }
    }
    if (left < 0) {
        left = 0;
    }
    if (top < 0) {
        top = 0;
    }
    pop.cgPopPosition = {
        'left': left + 'px',
        'top': top + 'px',
        'zIndex': (++exports.lastPopZIndex).toString()
    };
    if (size.width) {
        pop.cgPopPosition.width = size.width + 'px';
    }
    if (size.height) {
        pop.cgPopPosition.width = size.height + 'px';
    }
}
exports.showPop = showPop;
function hidePop(pop = null) {
    var _a;
    if (!pop) {
        if (!exports.popShowing) {
            return;
        }
        if (!exports.popShowing.cgSelfPopOpen) {
            return;
        }
        exports.popShowing.cgHidePop();
        return;
    }
    if (!pop.cgSelfPopOpen) {
        return;
    }
    pop.cgSelfPopOpen = false;
    if (pop.cgParentPopLayer.cgChildPopItemShowing === pop) {
        pop.cgParentPopLayer.cgChildPopItemShowing = undefined;
    }
    if ((_a = pop.cgSelfPop) === null || _a === void 0 ? void 0 : _a.cgChildPopItemShowing) {
        pop.cgSelfPop.cgChildPopItemShowing.cgHidePop();
    }
    if (pop === exports.popShowing) {
        exports.popShowing = null;
    }
}
exports.hidePop = hidePop;
function doFocusAndPopEvent(e) {
    var _a;
    if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
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
    let parent;
    if (clickgo.dom.findParentByClass(element, ['cg-pop-list', 'cg-pop-open'])) {
        return;
    }
    if ((parent = clickgo.dom.findParentByClass(element, 'cg-form-wrap'))) {
        let formId = parseInt((_a = parent.getAttribute('data-form-id')) !== null && _a !== void 0 ? _a : '0');
        changeFocus(formId);
        hidePop();
        return;
    }
    hidePop();
    changeFocus();
}
exports.doFocusAndPopEvent = doFocusAndPopEvent;
window.addEventListener('touchstart', doFocusAndPopEvent);
window.addEventListener('mousedown', doFocusAndPopEvent);
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
    if (Object.keys(clickgo.task.list[taskId].forms).length === 1) {
        return clickgo.task.end(taskId);
    }
    let title = '';
    let icon = '';
    if (clickgo.task.list[taskId].forms[formId]) {
        title = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.title;
        icon = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.iconData;
        if (clickgo.task.list[taskId].forms[formId].vroot.$refs.form.maskFrom !== undefined) {
            let fid = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.maskFrom;
            clickgo.task.list[taskId].forms[fid].vroot.$refs.form.maskFor = undefined;
        }
        clickgo.task.list[taskId].forms[formId].vroot.$refs.form.$data.showData = false;
        setTimeout(function () {
            clickgo.task.list[taskId].forms[formId].vapp.unmount();
            clickgo.task.list[taskId].forms[formId].vapp._container.remove();
            delete (clickgo.task.list[taskId].forms[formId]);
            clickgo.dom.removeStyle(taskId, 'form', formId);
            clickgo.core.trigger('formRemoved', taskId, formId, title, icon);
            let fid = getMaxZIndexFormID();
            if (fid) {
                changeFocus(fid);
            }
        }, 100);
        return true;
    }
    else {
        return false;
    }
}
exports.remove = remove;
function create(taskId, opt) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __awaiter(this, void 0, void 0, function* () {
        let task = clickgo.task.list[taskId];
        if (!task) {
            return -1;
        }
        let appPkg = task.appPkg;
        let formId = ++exports.lastFormId;
        let components = {};
        for (let controlPath of appPkg.config.controls) {
            let controlPkg;
            if (controlPath.startsWith('/clickgo/')) {
                let path = controlPath.slice(8);
                if (clickgo.control.clickgoControlPkgs[path + '.cgc']) {
                    controlPkg = clickgo.control.clickgoControlPkgs[path + '.cgc'];
                }
                else {
                    return -2;
                }
            }
            else if (task.controlPkgs[controlPath + '.cgc']) {
                controlPkg = task.controlPkgs[controlPath + '.cgc'];
            }
            else {
                return -3;
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
                let layout = '';
                let prep = '';
                if (task.initControls[name]) {
                    layout = task.initControls[name].layout;
                    prep = task.initControls[name].prep;
                }
                else {
                    let styleBlob = item.files[item.config.style + '.css'];
                    if (styleBlob) {
                        let r = clickgo.tool.stylePrepend(yield clickgo.tool.blob2Text(styleBlob));
                        prep = r.prep;
                        clickgo.dom.pushStyle(task.id, yield clickgo.tool.styleUrl2ObjectOrDataUrl(item.config.style, r.style, item), 'control', name);
                    }
                    let layoutBlob = item.files[item.config.layout + '.html'];
                    if (!layoutBlob) {
                        return -4;
                    }
                    let prepList = [
                        'cg-theme-task' + taskId + '-' + name + '_'
                    ];
                    if (prep !== '') {
                        prepList.push(prep);
                    }
                    layout = yield clickgo.tool.blob2Text(layoutBlob);
                    layout = clickgo.tool.layoutAddTagClassAndReTagName(layout, false);
                    layout = clickgo.tool.layoutClassPrepend(layout, prepList);
                    task.initControls[name] = {
                        'layout': layout,
                        'prep': prep
                    };
                }
                props.cgFocus = {
                    'default': false
                };
                data.taskId = taskId;
                data.formId = formId;
                data.controlName = name;
                data.cgPath = (_c = (_b = opt.file) !== null && _b !== void 0 ? _b : opt.path) !== null && _c !== void 0 ? _c : '/';
                data._prep = prep;
                if (data.cgNest === undefined) {
                    data.cgNest = false;
                }
                if (data.cgSelfIsPopLayer === undefined) {
                    data.cgSelfIsPopLayer = false;
                }
                data.cgChildPopItemShowing = undefined;
                data.cgSelfPop = undefined;
                data.cgSelfPopOpen = false;
                data.cgPopPosition = {
                    'left': '-5000px',
                    'top': '0px',
                    'zIndex': '0'
                };
                data.cgRealHover = false;
                data.cgActive = false;
                computed.cgHover = function () {
                    if (clickgo.dom.is.move) {
                        return false;
                    }
                    return this.cgRealHover;
                };
                computed.cgWidthPx = function () {
                    if (this.width !== undefined) {
                        return this.width + 'px';
                    }
                    if (this.flex !== '') {
                        let parent = this.cgParent();
                        return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
                    }
                };
                computed.cgHeightPx = function () {
                    if (this.height !== undefined) {
                        return this.height + 'px';
                    }
                    if (this.flex !== '') {
                        let parent = this.cgParent();
                        return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
                    }
                };
                computed.cgLocal = function () {
                    if (clickgo.task.list[this.taskId].local.name === '') {
                        return clickgo.core.config.local;
                    }
                    return clickgo.task.list[this.taskId].local.name;
                };
                computed.cgParentPopLayer = function () {
                    let parent = this.$parent;
                    while (true) {
                        if (!parent) {
                            return this;
                        }
                        if (parent.controlName === 'form') {
                            return parent;
                        }
                        if (parent.cgSelfIsPopLayer) {
                            return parent;
                        }
                        parent = parent.$parent;
                    }
                };
                methods.l = function (key, data) {
                    var _a, _b, _c, _d;
                    if (data) {
                        return (_b = (_a = data[this.cgLocal]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : 'LocaleError';
                    }
                    else if (this.localData) {
                        return (_d = (_c = this.localData[this.cgLocal]) === null || _c === void 0 ? void 0 : _c[key]) !== null && _d !== void 0 ? _d : 'LocaleError';
                    }
                    else {
                        return 'LocaleError';
                    }
                };
                methods.cgDown = function (e) {
                    if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
                        return;
                    }
                    if (e instanceof TouchEvent) {
                        this.cgRealHover = true;
                        this.$emit('enter', e);
                    }
                    else {
                        let up = () => {
                            window.removeEventListener('mouseup', up);
                            this.cgActive = false;
                            this.$emit('up', e);
                        };
                        window.addEventListener('mouseup', up);
                    }
                    this.cgActive = true;
                    this.$emit('down', e);
                };
                methods.cgUp = function (e) {
                    if (e instanceof MouseEvent) {
                        return;
                    }
                    this.cgRealHover = false;
                    this.$emit('leave', e);
                    this.cgActive = false;
                    this.$emit('up', e);
                };
                methods.cgCancel = function (e) {
                    this.cgRealHover = false;
                    this.cgActive = false;
                    this.$emit('leave', e);
                    this.$emit('up', e);
                };
                methods.cgEnter = function (e) {
                    if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
                        return;
                    }
                    this.cgRealHover = true;
                    this.$emit('enter', e);
                };
                methods.cgLeave = function (e) {
                    if (!this.cgRealHover) {
                        return;
                    }
                    this.cgRealHover = false;
                    this.$emit('leave', e);
                };
                methods.cgTap = function (e) {
                    if (this.$el.className.includes('cg-disabled')) {
                        return;
                    }
                    this.$emit('tap', e);
                };
                methods.cgDblclick = function (e) {
                    e.stopPropagation();
                    if (this.$el.className.includes('cg-disabled')) {
                        return;
                    }
                    this.$emit('dblclick', e);
                };
                methods.cgGetBlob = function (path) {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        if (path.startsWith('/clickgo/')) {
                            return yield clickgo.core.fetchClickGoFile(path.slice(8));
                        }
                        else {
                            path = clickgo.tool.urlResolve(this.$data.cgPath, path);
                            return (_a = task.appPkg.files[path]) !== null && _a !== void 0 ? _a : null;
                        }
                    });
                };
                methods.cgGetObjectUrl = function (file) {
                    file = clickgo.tool.urlResolve(this.$data.cgPath, file);
                    return clickgo.tool.file2ObjectUrl(file, clickgo.task.list[this.taskId]);
                };
                methods.cgGetDataUrl = function (file) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let f = yield this.cgGetBlob(file);
                        return f ? yield clickgo.tool.blob2DataUrl(f) : null;
                    });
                };
                methods.cgClassPrepend = function (cla) {
                    if (typeof cla !== 'string') {
                        return cla;
                    }
                    if (cla.startsWith('cg-')) {
                        return cla;
                    }
                    return `cg-theme-task${this.taskId}-${this.$data.controlName}_${cla} ${this.$data._prep}${cla}`;
                };
                methods.cgSlots = function (name = 'default') {
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
                methods.cgParent = function () {
                    let parent = this.$parent;
                    while (true) {
                        if (!parent) {
                            return null;
                        }
                        if (parent.cgNest) {
                            parent = parent.$parent;
                            continue;
                        }
                        return parent;
                    }
                };
                methods.cgFindParent = function (controlName) {
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
                if (!methods.cgShowPop) {
                    methods.cgShowPop = function (direction, size) {
                        clickgo.form.showPop(this, direction, size);
                    };
                }
                if (!methods.cgHidePop) {
                    methods.cgHidePop = function () {
                        clickgo.form.hidePop(this);
                    };
                }
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
                        var _a, _b;
                        return __awaiter(this, void 0, void 0, function* () {
                            yield this.$nextTick();
                            if (((_b = (_a = this.$el.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.id) === 'cg-pop-list') {
                                this.cgSelfIsPopLayer = true;
                                if (this.$parent) {
                                    this.$parent.cgSelfPop = this;
                                }
                            }
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
                        if (this.cgSelfIsPopLayer && this.$parent) {
                            this.$parent.cgSelfPop = undefined;
                        }
                        if (this.cgParentPopLayer.cgChildPopItemShowing === this) {
                            this.cgHidePop();
                        }
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
        if (layout === undefined) {
            return -5;
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
        let expo = undefined;
        if (appPkg.files[opt.file + '.js']) {
            [expo] = (_e = yield loader.requireMemory((_d = opt.file) !== null && _d !== void 0 ? _d : '', appPkg.files)) !== null && _e !== void 0 ? _e : [];
        }
        else if (opt.code) {
            expo = opt.code;
        }
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
        let prep = '';
        if (style) {
            let r = clickgo.tool.stylePrepend(style);
            prep = r.prep;
            style = yield clickgo.tool.styleUrl2ObjectOrDataUrl((_g = (_f = opt.file) !== null && _f !== void 0 ? _f : opt.path) !== null && _g !== void 0 ? _g : '/', r.style, task);
        }
        layout = clickgo.tool.purify(layout);
        layout = clickgo.tool.layoutAddTagClassAndReTagName(layout, true);
        layout = clickgo.tool.layoutInsertAttr(layout, ':cg-focus=\'cgFocus\'', {
            'include': [/^cg-.+/]
        });
        let prepList = ['cg-task' + taskId + '_'];
        if (prep !== '') {
            prepList.push(prep);
        }
        layout = clickgo.tool.layoutClassPrepend(layout, prepList);
        formListElement.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId.toString()}" data-task-id="${taskId.toString()}"></div>`);
        let el = formListElement.children.item(formListElement.children.length - 1);
        data.taskId = taskId;
        data.formId = formId;
        data.controlName = 'root';
        data.cgFocus = false;
        data.cgPath = (_j = (_h = opt.file) !== null && _h !== void 0 ? _h : opt.path) !== null && _j !== void 0 ? _j : '/';
        data._prep = prep;
        data._customZIndex = false;
        if (opt.topMost) {
            data._topMost = true;
        }
        else {
            data._topMost = false;
        }
        computed.cgLocal = function () {
            if (clickgo.task.list[this.taskId].local.name === '') {
                return clickgo.core.config.local;
            }
            return clickgo.task.list[this.taskId].local.name;
        };
        methods.l = function (key) {
            var _a, _b;
            return (_b = (_a = clickgo.task.list[this.taskId].local.data[this.cgLocal]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : 'LocaleError';
        };
        methods.cgCreateForm = function (paramOpt = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                let inOpt = {
                    'path': this.cgPath
                };
                if (typeof paramOpt === 'string') {
                    inOpt.file = paramOpt;
                }
                else {
                    if (paramOpt.file) {
                        inOpt.file = paramOpt.file;
                    }
                    if (paramOpt.path) {
                        inOpt.path = paramOpt.path;
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
                    if (paramOpt.mask) {
                        this.$refs.form.maskFor = true;
                    }
                }
                if (this.$data._topMost) {
                    inOpt.topMost = true;
                }
                let form = yield create(taskId, inOpt);
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
        methods.cgCloseForm = function () {
            remove(this.formId);
        };
        methods.cgBindFormDrag = function (e) {
            this.$refs.form.moveMethod(e, true);
        };
        methods.cgSetSystemEventListener = function (name, func) {
            clickgo.task.list[this.taskId].forms[this.formId].events[name] = func;
        };
        methods.cgRemoveSystemEventListener = function (name) {
            delete (clickgo.task.list[this.taskId].forms[this.formId].events[name]);
        };
        methods.cgDialog = function (opt) {
            return new Promise((resolve) => {
                var _a;
                if (typeof opt === 'string' || typeof opt === 'number') {
                    opt = {
                        'content': opt
                    };
                }
                if (opt.buttons === undefined) {
                    opt.buttons = ['OK'];
                }
                this.cgCreateForm({
                    'layout': `<form title="${(_a = opt.title) !== null && _a !== void 0 ? _a : 'dialog'}" width="auto" height="auto" :min="false" :max="false" :resize="false" :min-height="50" border="${opt.title ? 'normal' : 'none'}"><dialog :buttons="buttons" @select="select">${opt.content}</dialog></form>`,
                    'code': {
                        data: {
                            'buttons': opt.buttons
                        },
                        methods: {
                            select: function (button) {
                                this.cgCloseForm();
                                resolve(button);
                            }
                        }
                    },
                    'mask': true
                }).catch((e) => {
                    throw e;
                });
            });
        };
        methods.cgGetBlob = function (path) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (path.startsWith('/clickgo/')) {
                    return yield clickgo.core.fetchClickGoFile(path.slice(8));
                }
                else {
                    path = clickgo.tool.urlResolve(this.$data.cgPath, path);
                    return (_a = task.appPkg.files[path]) !== null && _a !== void 0 ? _a : null;
                }
            });
        };
        methods.cgGetObjectUrl = function (file) {
            file = clickgo.tool.urlResolve(this.$data.cgPath, file);
            return clickgo.tool.file2ObjectUrl(file, clickgo.task.list[this.taskId]);
        };
        methods.cgGetDataUrl = function (file) {
            return __awaiter(this, void 0, void 0, function* () {
                let f = yield this.cgGetBlob(file);
                return f ? yield clickgo.tool.blob2DataUrl(f) : null;
            });
        };
        methods.cgLoadTheme = function (path) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield clickgo.theme.load(this.taskId, path);
            });
        };
        methods.cgRemoveTheme = function (path) {
            return __awaiter(this, void 0, void 0, function* () {
                yield clickgo.theme.remove(this.taskId, path);
            });
        };
        methods.cgSetTheme = function (path) {
            return __awaiter(this, void 0, void 0, function* () {
                yield clickgo.theme.clear(this.taskId);
                yield clickgo.theme.load(this.taskId, path);
            });
        };
        methods.cgClearTheme = function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield clickgo.theme.clear(this.taskId);
            });
        };
        methods.cgSetGlobalTheme = function (path) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof path === 'string') {
                    let blob = yield this.cgGetBlob(path);
                    if (blob) {
                        yield clickgo.theme.setGlobal(blob);
                    }
                }
                else {
                    yield clickgo.theme.setGlobal(path);
                }
            });
        };
        methods.cgClearGlobalTheme = function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield clickgo.theme.clearGlobal();
            });
        };
        methods.cgSetTopMost = function (top) {
            this.$data._customZIndex = false;
            if (top) {
                this.$data._topMost = true;
                if (!this.cgFocus) {
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
        methods.cgFlash = function () {
            if (!this.cgFocus) {
                changeFocus(this.formId);
            }
            if (this.$refs.form.flashTimer) {
                clearTimeout(this.$refs.form.flashTimer);
                this.$refs.form.flashTimer = undefined;
            }
            this.$refs.form.flashTimer = setTimeout(() => {
                this.$refs.form.flashTimer = undefined;
            }, 1000);
            clickgo.core.trigger('formFlash', taskId, formId);
        };
        methods.cgShow = function () {
            this.$refs.form.$data.showData = true;
        };
        methods.cgHide = function () {
            this.$refs.form.$data.showData = false;
        };
        methods.cgLoadLocal = function (name, path) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!task.files[path]) {
                    return false;
                }
                let local = yield clickgo.tool.blob2Text(task.files[path]);
                try {
                    let data = JSON.parse(local);
                    this.cgLoadLocalData(name, data);
                    return true;
                }
                catch (_a) {
                    return false;
                }
            });
        };
        methods.cgSetLocal = function (name, path) {
            return __awaiter(this, void 0, void 0, function* () {
                this.cgClearLocal();
                return yield this.cgLoadLocal(name, path);
            });
        };
        methods.cgClearLocal = function () {
            clickgo.task.list[this.taskId].local.data = {};
        };
        methods.cgLoadLocalData = function (name, data, pre = '') {
            for (let k in data) {
                let v = data[k];
                if (typeof v === 'object') {
                    this.cgLoadLocalData(name, v, pre + k + '.');
                }
                else {
                    clickgo.task.list[this.taskId].local.data[name][pre + k] = v;
                }
            }
        };
        methods.cgClassPrepend = function (cla) {
            if (typeof cla !== 'string') {
                return cla;
            }
            if (cla.startsWith('cg-')) {
                return cla;
            }
            return `cg-task${this.taskId}_${cla} ${this.$data._prep}${cla}`;
        };
        if (style) {
            clickgo.dom.pushStyle(taskId, style, 'form', formId);
        }
        let rtn = yield new Promise(function (resolve) {
            const vapp = Vue.createApp({
                'template': layout.replace(/^<cg-form/, '<cg-form ref="form"'),
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
                        resolve({
                            'vapp': vapp,
                            'vroot': this
                        });
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
            for (let key in components) {
                vapp.component(key, components[key]);
            }
            vapp.mount(el);
        });
        let form = {
            'id': formId,
            'vapp': rtn.vapp,
            'vroot': rtn.vroot,
            'win': null,
            'events': {}
        };
        task.forms[formId] = form;
        yield clickgo.tool.sleep(5);
        if (mounted) {
            try {
                yield mounted.call(rtn.vroot);
            }
            catch (err) {
                if (clickgo.core.globalEvents.errorHandler) {
                    clickgo.core.globalEvents.errorHandler(rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error.');
                }
                else {
                    console.log(err);
                }
                task.forms[formId] = undefined;
                delete (task.forms[formId]);
                rtn.vapp.unmount();
                rtn.vapp._container.remove();
                clickgo.dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
                return -6;
            }
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
        if (rtn.vroot.$refs.form.$data.show !== false) {
            rtn.vroot.cgShow();
        }
        clickgo.core.trigger('formCreated', taskId, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconData);
        changeFocus(formId, rtn.vroot);
        return form;
    });
}
exports.create = create;
window.addEventListener('resize', function () {
    let position = clickgo.getPosition();
    for (let i = 0; i < formListElement.children.length; ++i) {
        let el = formListElement.children.item(i);
        let ef = el.children.item(0);
        if (!ef.className.includes('cg-state-max')) {
            continue;
        }
        let taskId = parseInt(el.getAttribute('data-task-id'));
        let formId = parseInt(el.getAttribute('data-form-id'));
        if (!clickgo.task.list[taskId]) {
            continue;
        }
        let vroot = clickgo.task.list[taskId].forms[formId].vroot;
        vroot.$refs.form.setPropData('width', position.width);
        vroot.$refs.form.setPropData('height', position.height);
    }
    clickgo.core.trigger('screenResize', position.width, position.height);
});
