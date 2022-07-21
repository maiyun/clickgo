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
exports.hide = exports.show = exports.flash = exports.setTopMost = exports.confirm = exports.dialog = exports.create = exports.remove = exports.doFocusAndPopEvent = exports.hidePop = exports.showPop = exports.removeFromPop = exports.appendToPop = exports.hideNotify = exports.notifyProgress = exports.notify = exports.hideDrag = exports.moveDrag = exports.showDrag = exports.hideRectangle = exports.showRectangle = exports.moveRectangle = exports.showCircular = exports.getRectByBorder = exports.getMaxZIndexID = exports.changeFocus = exports.getList = exports.send = exports.get = exports.getTaskId = exports.refreshMaxPosition = exports.bindDrag = exports.bindResize = exports.close = exports.max = exports.min = exports.simpleSystemTaskRoot = void 0;
const clickgo = require("../clickgo");
const core = require("./core");
const task = require("./task");
const tool = require("./tool");
const dom = require("./dom");
const control = require("./control");
const native = require("./native");
const info = {
    'lastId': 0,
    'lastZIndex': 999,
    'topLastZIndex': 9999999,
    'locale': {
        'sc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消'
        },
        'tc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消'
        },
        'en': {
            'ok': 'OK',
            'yes': 'Yes',
            'no': 'No',
            'cancel': 'Cancel'
        },
        'ja': {
            'ok': '好',
            'yes': 'はい',
            'no': 'いいえ',
            'cancel': 'キャンセル'
        }
    }
};
const popInfo = {
    'list': [],
    'elList': [],
    'lastZIndex': 0
};
const elements = {
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
    'init': function () {
        this.wrap.id = 'cg-wrap';
        document.getElementsByTagName('body')[0].appendChild(this.wrap);
        if (clickgo.getNative() && (clickgo.getPlatform() === 'win32')) {
            this.wrap.addEventListener('mouseenter', function () {
                native.send('cg-mouse-ignore', JSON.stringify({
                    'token': native.getToken(),
                    'param': false
                }));
            });
            this.wrap.addEventListener('mouseleave', function () {
                native.send('cg-mouse-ignore', JSON.stringify({
                    'token': native.getToken(),
                    'param': true
                }));
            });
        }
        this.list.id = 'cg-form-list';
        this.wrap.appendChild(this.list);
        this.list.addEventListener('touchmove', function (e) {
            if (e.cancelable) {
                e.preventDefault();
            }
        }, {
            'passive': false
        });
        this.list.addEventListener('wheel', function (e) {
            e.preventDefault();
        }, {
            'passive': false
        });
        this.list.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        this.popList.id = 'cg-pop-list';
        this.popList.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        this.wrap.appendChild(this.popList);
        this.popList.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, {
            'passive': false
        });
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
        this.system.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        this.wrap.appendChild(this.system);
        this.system.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, {
            'passive': false
        });
        this.simpleSystemtask.id = 'cg-simpletask';
        this.simpleSystemtask.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        this.wrap.appendChild(this.simpleSystemtask);
        this.simpleSystemtask.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, {
            'passive': false
        });
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
                click: function (formId) {
                    changeFocus(formId);
                }
            },
            'mounted': function () {
                exports.simpleSystemTaskRoot = this;
            }
        });
        simpletaskApp.mount('#cg-simpletask');
    }
};
elements.init();
function changeState(state, formId) {
    if (!formId) {
        return false;
    }
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
    for (let i = 0; i < elements.list.children.length; ++i) {
        const el = elements.list.children.item(i);
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
    const formElement = elements.list.querySelector(`[data-form-id='${formId}']`);
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
        'icon': item.vroot.$refs.form.iconData,
        'stateMax': item.vroot.$refs.form.stateMaxData,
        'stateMin': item.vroot.$refs.form.stateMinData,
        'show': item.vroot.$refs.form.showData,
        'focus': item.vroot.cgFocus
    };
}
exports.get = get;
function send(formId, obj) {
    const taskId = getTaskId(formId);
    if (taskId === 0) {
        return;
    }
    const item = task.list[taskId].forms[formId];
    if (!item.vroot.cgReceive) {
        return;
    }
    item.vroot.cgReceive(obj);
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
            'icon': item.vroot.$refs.form.iconData,
            'stateMax': item.vroot.$refs.form.stateMaxData,
            'stateMin': item.vroot.$refs.form.stateMinData,
            'show': item.vroot.$refs.form.showData,
            'focus': item.vroot.cgFocus
        };
    }
    return list;
}
exports.getList = getList;
function changeFocus(formId = 0) {
    var _a, _b;
    if (typeof formId !== 'number') {
        notify({
            'title': 'Warning',
            'content': 'The "formId" of "changeFocus" must be a number type.',
            'type': 'warning'
        });
        return;
    }
    const focusElement = document.querySelector('#cg-form-list > [data-cg-focus]');
    if (focusElement) {
        const dataFormId = focusElement.getAttribute('data-form-id');
        if (dataFormId) {
            const dataFormIdNumber = parseInt(dataFormId);
            if (dataFormIdNumber === formId) {
                return;
            }
            else {
                const taskId = parseInt((_a = focusElement.getAttribute('data-task-id')) !== null && _a !== void 0 ? _a : '0');
                const t = task.list[taskId];
                t.forms[dataFormIdNumber].vapp._container.removeAttribute('data-cg-focus');
                t.forms[dataFormIdNumber].vroot._cgFocus = false;
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
    if (el.children.item(0).dataset.cgMin !== undefined) {
        min(formId);
    }
    const taskId = parseInt((_b = el.getAttribute('data-task-id')) !== null && _b !== void 0 ? _b : '0');
    const t = task.list[taskId];
    if (!t.forms[formId].vroot.cgCustomZIndex) {
        if (t.forms[formId].vroot.cgTopMost) {
            t.forms[formId].vroot.$refs.form.setPropData('zIndex', ++info.topLastZIndex);
        }
        else {
            t.forms[formId].vroot.$refs.form.setPropData('zIndex', ++info.lastZIndex);
        }
    }
    const maskFor = t.forms[formId].vroot.$refs.form.maskFor;
    if ((typeof maskFor === 'number') && (task.list[taskId].forms[maskFor])) {
        if (get(maskFor).stateMin) {
            min(maskFor);
        }
        if (!task.list[taskId].forms[maskFor].vroot.cgCustomZIndex) {
            if (task.list[taskId].forms[maskFor].vroot.cgTopMost) {
                task.list[taskId].forms[maskFor].vroot.$refs.form.setPropData('zIndex', ++info.topLastZIndex);
            }
            else {
                task.list[taskId].forms[maskFor].vroot.$refs.form.setPropData('zIndex', ++info.lastZIndex);
            }
        }
        task.list[taskId].forms[maskFor].vapp._container.dataset.cgFocus = '';
        task.list[taskId].forms[maskFor].vroot._cgFocus = true;
        core.trigger('formFocused', taskId, maskFor);
        clickgo.form.flash(maskFor, taskId);
    }
    else {
        t.forms[formId].vapp._container.dataset.cgFocus = '';
        t.forms[formId].vroot._cgFocus = true;
        core.trigger('formFocused', taskId, formId);
    }
}
exports.changeFocus = changeFocus;
function getMaxZIndexID(out = {}) {
    var _a, _b;
    let zIndex = 0;
    let formId = null;
    for (let i = 0; i < elements.list.children.length; ++i) {
        const formWrap = elements.list.children.item(i);
        const formInner = formWrap.children.item(0);
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
    elements.circular.style.transition = 'none';
    requestAnimationFrame(function () {
        elements.circular.style.width = '6px';
        elements.circular.style.height = '6px';
        elements.circular.style.left = (x - 3).toString() + 'px';
        elements.circular.style.top = (y - 3).toString() + 'px';
        elements.circular.style.opacity = '1';
        requestAnimationFrame(function () {
            elements.circular.style.transition = 'all .3s ease-out';
            requestAnimationFrame(function () {
                elements.circular.style.width = '60px';
                elements.circular.style.height = '60px';
                elements.circular.style.left = (x - 30).toString() + 'px';
                elements.circular.style.top = (y - 30).toString() + 'px';
                elements.circular.style.opacity = '0';
            });
        });
    });
}
exports.showCircular = showCircular;
function moveRectangle(border) {
    var _a, _b, _c, _d;
    const dataReady = (_a = elements.rectangle.getAttribute('data-ready')) !== null && _a !== void 0 ? _a : '0';
    if (dataReady === '0') {
        return;
    }
    const dataBorder = (_b = elements.rectangle.getAttribute('data-border')) !== null && _b !== void 0 ? _b : '';
    const setDataBorder = typeof border === 'string' ? border : `o-${border.left}-${(_c = border.top) !== null && _c !== void 0 ? _c : 'n'}-${border.width}-${(_d = border.height) !== null && _d !== void 0 ? _d : 'n'}`;
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
exports.moveRectangle = moveRectangle;
function showRectangle(x, y, border) {
    elements.rectangle.style.transition = 'none';
    requestAnimationFrame(function () {
        elements.rectangle.style.width = '5px';
        elements.rectangle.style.height = '5px';
        elements.rectangle.style.left = (x - 10).toString() + 'px';
        elements.rectangle.style.top = (y - 10).toString() + 'px';
        elements.rectangle.style.opacity = '1';
        elements.rectangle.setAttribute('data-ready', '0');
        elements.rectangle.setAttribute('data-dir', '');
        requestAnimationFrame(function () {
            elements.rectangle.style.transition = 'all .2s ease-out';
            requestAnimationFrame(function () {
                elements.rectangle.setAttribute('data-ready', '1');
                moveRectangle(border);
            });
        });
    });
}
exports.showRectangle = showRectangle;
function hideRectangle() {
    elements.rectangle.style.opacity = '0';
}
exports.hideRectangle = hideRectangle;
function showDrag() {
    elements.drag.style.opacity = '1';
}
exports.showDrag = showDrag;
function moveDrag(opt) {
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
exports.moveDrag = moveDrag;
function hideDrag() {
    elements.drag.style.opacity = '0';
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
    elements.system.appendChild(el);
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
    const el = elements.system.querySelector(`[data-notifyid="${notifyId}"]`);
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
    const el = elements.system.querySelector(`[data-notifyid="${notifyId}"]`);
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
    elements.popList.appendChild(el);
}
exports.appendToPop = appendToPop;
function removeFromPop(el) {
    elements.popList.removeChild(el);
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
        icon = task.list[taskId].forms[formId].vroot.$refs.form.iconData;
        if (task.list[taskId].forms[formId].vroot.$refs.form.maskFrom !== undefined) {
            const fid = task.list[taskId].forms[formId].vroot.$refs.form.maskFrom;
            task.list[taskId].forms[fid].vroot.$refs.form.maskFor = undefined;
        }
        task.list[taskId].forms[formId].vroot.$refs.form.$data.showData = false;
        setTimeout(function () {
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
            delete task.list[taskId].forms[formId];
            dom.removeStyle(taskId, 'form', formId);
            core.trigger('formRemoved', taskId, formId, title, icon);
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
    if (!taskId) {
        return null;
    }
    const t = task.list[taskId];
    if (!t) {
        return null;
    }
    if (!formId) {
        return null;
    }
    const form = t.forms[formId];
    if (!form) {
        return null;
    }
    return form;
}
function create(opt) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof opt === 'string') {
            return 0;
        }
        if (!opt.taskId) {
            return -1;
        }
        if (opt.path && (!opt.path.endsWith('/') || !((_a = opt.path) === null || _a === void 0 ? void 0 : _a.startsWith('/')))) {
            return -2;
        }
        const taskId = opt.taskId;
        const t = task.list[taskId];
        if (!t) {
            return -3;
        }
        let form = null;
        if (opt.formId) {
            if (!t.forms[opt.formId]) {
                return -4;
            }
            form = t.forms[opt.formId];
        }
        let topMost = (_b = opt.topMost) !== null && _b !== void 0 ? _b : false;
        if (form === null || form === void 0 ? void 0 : form.vroot.cgTopMost) {
            topMost = true;
        }
        if (opt.mask && form) {
            form.vroot.$refs.form.maskFor = 0;
        }
        const base = form ? form.vroot.cgPath : '/';
        let filePath = '', newBase = '';
        if (opt.file) {
            filePath = clickgo.tool.urlResolve(base, opt.file);
            newBase = filePath.slice(0, filePath.lastIndexOf('/') + 1);
        }
        else {
            newBase = (_c = opt.path) !== null && _c !== void 0 ? _c : base;
        }
        const app = t.app;
        const formId = ++info.lastId;
        const invoke = {};
        if (clickgo.getSafe()) {
            invoke.window = undefined;
            invoke.loader = undefined;
            const ks = Object.getOwnPropertyNames(window);
            for (const k of ks) {
                if (k.includes('Event')) {
                    continue;
                }
                if (k.includes('-')) {
                    continue;
                }
                if (/^[0-9]+$/.test(k)) {
                    continue;
                }
                if ([
                    'require',
                    '__awaiter', 'eval', 'Math', 'Array', 'Blob', 'Infinity', 'parseInt', 'parseFloat', 'Promise', 'Date', 'JSON', 'fetch'
                ].includes(k)) {
                    continue;
                }
                invoke[k] = undefined;
            }
            invoke.console = {
                log: function (message, ...optionalParams) {
                    console.log(message, ...optionalParams);
                }
            };
            invoke.loader = {
                require: function (paths, files, opt) {
                    return loader.require(paths, files, opt);
                }
            };
            invoke.Object = {
                defineProperty: function () {
                    return;
                },
                keys: function (o) {
                    return Object.keys(o);
                },
                assign: function (o, o2) {
                    if (o.controlName !== undefined) {
                        return o;
                    }
                    return Object.assign(o, o2);
                }
            };
            invoke.navigator = {};
            if (navigator.clipboard) {
                invoke.navigator.clipboard = navigator.clipboard;
            }
            invoke.invokeClickgo = {
                getVersion: function () {
                    return clickgo.getVersion();
                },
                getNative() {
                    return clickgo.getNative();
                },
                getPlatform() {
                    return clickgo.getPlatform();
                },
                getSafe() {
                    return clickgo.getSafe();
                },
                'control': {
                    read: function (blob) {
                        return clickgo.control.read(blob);
                    }
                },
                'core': {
                    'config': clickgo.core.config,
                    'cdn': loader.cdn,
                    initModules: function (names) {
                        return clickgo.core.initModules(names);
                    },
                    getModule: function (name) {
                        return clickgo.core.getModule(name);
                    },
                    setSystemEventListener: function (name, func, fid) {
                        clickgo.core.setSystemEventListener(name, func, fid !== null && fid !== void 0 ? fid : formId, taskId);
                    },
                    removeSystemEventListener: function (name, fid) {
                        clickgo.core.removeSystemEventListener(name, fid !== null && fid !== void 0 ? fid : formId, taskId);
                    },
                    trigger: function (name, param1 = '', param2 = '') {
                        if (!['formTitleChanged', 'formIconChanged', 'formStateMinChanged', 'formStateMaxChanged', 'formShowChanged'].includes(name)) {
                            return;
                        }
                        clickgo.core.trigger(name, taskId, formId, param1, param2);
                    },
                    readApp: function (blob) {
                        return clickgo.core.readApp(blob);
                    },
                    getAvailArea: function () {
                        return clickgo.core.getAvailArea();
                    }
                },
                'dom': {
                    setGlobalCursor: function (type) {
                        clickgo.dom.setGlobalCursor(type);
                    },
                    hasTouchButMouse: function (e) {
                        return clickgo.dom.hasTouchButMouse(e);
                    },
                    getStyleCount: function (taskId, type) {
                        return clickgo.dom.getStyleCount(taskId, type);
                    },
                    getSize: function (el) {
                        return clickgo.dom.getSize(el);
                    },
                    watchSize: function (el, cb, immediate = false) {
                        return clickgo.dom.watchSize(el, cb, immediate, taskId);
                    },
                    unwatchSize: function (el) {
                        clickgo.dom.unwatchSize(el, taskId);
                    },
                    clearWatchSize() {
                        clickgo.dom.clearWatchSize(taskId);
                    },
                    watch: function (el, cb, mode = 'default', immediate = false) {
                        clickgo.dom.watch(el, cb, mode, immediate, taskId);
                    },
                    unwatch: function (el) {
                        clickgo.dom.unwatch(el, taskId);
                    },
                    clearWatch: function () {
                        clickgo.dom.clearWatch(taskId);
                    },
                    watchStyle: function (el, name, cb, immediate = false) {
                        clickgo.dom.watchStyle(el, name, cb, immediate);
                    },
                    isWatchStyle: function (el) {
                        return clickgo.dom.isWatchStyle(el);
                    },
                    bindDown: function (oe, opt) {
                        clickgo.dom.bindDown(oe, opt);
                    },
                    bindGesture: function (e, opt) {
                        clickgo.dom.bindGesture(e, opt);
                    },
                    bindLong: function (e, long) {
                        clickgo.dom.bindLong(e, long);
                    },
                    bindDrag: function (e, opt) {
                        clickgo.dom.bindDrag(e, opt);
                    },
                    'is': clickgo.dom.is,
                    bindMove: function (e, opt) {
                        return clickgo.dom.bindMove(e, opt);
                    },
                    bindResize: function (e, opt) {
                        clickgo.dom.bindResize(e, opt);
                    },
                    findParentByData: function (el, name) {
                        return clickgo.dom.findParentByData(el, name);
                    },
                    findParentByClass: function (el, name) {
                        return clickgo.dom.findParentByClass(el, name);
                    },
                    siblings: function (el) {
                        return clickgo.dom.siblings(el);
                    },
                    siblingsData: function (el, name) {
                        return clickgo.dom.siblingsData(el, name);
                    },
                    fullscreen: function () {
                        return clickgo.dom.fullscreen();
                    }
                },
                'form': {
                    min: function (fid) {
                        return clickgo.form.min(fid !== null && fid !== void 0 ? fid : formId);
                    },
                    max: function max(fid) {
                        return clickgo.form.max(fid !== null && fid !== void 0 ? fid : formId);
                    },
                    close: function (fid) {
                        return clickgo.form.close(fid !== null && fid !== void 0 ? fid : formId);
                    },
                    bindResize: function (e, border) {
                        clickgo.form.bindResize(e, border);
                    },
                    bindDrag: function (e) {
                        clickgo.form.bindDrag(e);
                    },
                    getTaskId: function (fid) {
                        return clickgo.form.getTaskId(fid);
                    },
                    get: function (fid) {
                        return clickgo.form.get(fid);
                    },
                    send: function (fid, obj) {
                        obj.taskId = taskId;
                        obj.formId = formId;
                        clickgo.form.send(fid, obj);
                    },
                    getList: function (tid) {
                        return clickgo.form.getList(tid);
                    },
                    changeFocus: function (fid = 0) {
                        clickgo.form.changeFocus(fid);
                    },
                    getMaxZIndexID: function (out) {
                        return clickgo.form.getMaxZIndexID(out);
                    },
                    getRectByBorder: function (border) {
                        return clickgo.form.getRectByBorder(border);
                    },
                    showCircular: function (x, y) {
                        clickgo.form.showCircular(x, y);
                    },
                    moveRectangle: function (border) {
                        clickgo.form.moveRectangle(border);
                    },
                    showRectangle: function (x, y, border) {
                        clickgo.form.showRectangle(x, y, border);
                    },
                    hideRectangle: function () {
                        clickgo.form.hideRectangle();
                    },
                    showDrag: function () {
                        clickgo.form.showDrag();
                    },
                    moveDrag: function (opt) {
                        clickgo.form.moveDrag(opt);
                    },
                    hideDrag: function () {
                        clickgo.form.hideDrag();
                    },
                    notify: function (opt) {
                        return clickgo.form.notify(opt);
                    },
                    notifyProgress: function (notifyId, per) {
                        clickgo.form.notifyProgress(notifyId, per);
                    },
                    hideNotify: function (notifyId) {
                        clickgo.form.hideNotify(notifyId);
                    },
                    showPop: function (el, pop, direction, opt = {}) {
                        clickgo.form.showPop(el, pop, direction, opt);
                    },
                    hidePop: function (pop) {
                        clickgo.form.hidePop(pop);
                    },
                    create: function (opt) {
                        if (typeof opt === 'string') {
                            opt = {
                                'file': opt
                            };
                        }
                        opt.taskId = taskId;
                        opt.formId = formId;
                        return clickgo.form.create(opt);
                    },
                    dialog: function (opt) {
                        if (typeof opt === 'string') {
                            opt = {
                                'content': opt
                            };
                        }
                        opt.formId = formId;
                        return clickgo.form.dialog(opt);
                    },
                    confirm: function (opt) {
                        if (typeof opt === 'string') {
                            opt = {
                                'content': opt
                            };
                        }
                        opt.formId = formId;
                        return clickgo.form.confirm(opt);
                    },
                    setTopMost: function (top, opt = {}) {
                        opt.taskId = taskId;
                        opt.formId = formId;
                        clickgo.form.setTopMost(top, opt);
                    },
                    flash: function (fid) {
                        clickgo.form.flash(fid !== null && fid !== void 0 ? fid : formId, taskId);
                    },
                    show: function (fid) {
                        clickgo.form.show(fid !== null && fid !== void 0 ? fid : formId, taskId);
                    },
                    hide: function (fid) {
                        clickgo.form.hide(fid !== null && fid !== void 0 ? fid : formId, taskId);
                    }
                },
                'fs': {
                    getContent: function (path, options = {}) {
                        if (!options.files) {
                            options.files = t.files;
                        }
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.getContent(path, options);
                    },
                    putContent: function (path, data, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.putContent(path, data, options);
                    },
                    readLink: function (path, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.readLink(path, options);
                    },
                    symlink: function (fPath, linkPath, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.symlink(fPath, linkPath, options);
                    },
                    unlink: function (path, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.unlink(path, options);
                    },
                    stats: function (path, options = {}) {
                        if (!options.files) {
                            options.files = t.files;
                        }
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.stats(path, options);
                    },
                    isDir: function (path, options = {}) {
                        if (!options.files) {
                            options.files = t.files;
                        }
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.isDir(path, options);
                    },
                    isFile: function (path, options = {}) {
                        if (!options.files) {
                            options.files = t.files;
                        }
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.isFile(path, options);
                    },
                    mkdir: function (path, mode, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.mkdir(path, mode, options);
                    },
                    rmdir: function (path, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.rmdir(path, options);
                    },
                    rmdirDeep: function (path, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.rmdirDeep(path, options);
                    },
                    chmod: function (path, mod, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.chmod(path, mod, options);
                    },
                    rename(oldPath, newPath, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.rename(oldPath, newPath, options);
                    },
                    readDir(path, options = {}) {
                        if (!options.files) {
                            options.files = t.files;
                        }
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.readDir(path, options);
                    },
                    copyFolder(from, to, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.copyFolder(from, to, options);
                    },
                    copyFile(src, dest, options = {}) {
                        if (!options.current) {
                            options.current = t.path;
                        }
                        return clickgo.fs.copyFile(src, dest, options);
                    }
                },
                'native': {
                    getListeners: function () {
                        return clickgo.native.getListeners();
                    },
                    send: function (name, param, handler) {
                        return clickgo.native.send(name, param, handler, taskId);
                    },
                    on: function (name, handler, id, once = false) {
                        clickgo.native.on(name, handler, id, once, taskId);
                    },
                    once: function (name, handler, id) {
                        clickgo.native.once(name, handler, id, taskId);
                    },
                    off: function (name, handler) {
                        clickgo.native.off(name, handler, taskId);
                    },
                    clearListener: function () {
                        clickgo.native.clearListener(taskId);
                    },
                    max: function () {
                        clickgo.native.max();
                    },
                    min: function () {
                        clickgo.native.min();
                    },
                    restore: function () {
                        clickgo.native.restore();
                    },
                    size: function (width, height) {
                        clickgo.native.size(width, height);
                    }
                },
                'task': {
                    onFrame: function (fun, opt = {}) {
                        opt.taskId = taskId;
                        opt.formId = formId;
                        return clickgo.task.onFrame(fun, opt);
                    },
                    offFrame: function (ft, opt = {}) {
                        opt.taskId = taskId;
                        clickgo.task.offFrame(ft, opt);
                    },
                    get: function (tid) {
                        return clickgo.task.get(tid);
                    },
                    getList: function () {
                        return clickgo.task.getList();
                    },
                    run: function (url, opt = {}) {
                        opt.taskId = taskId;
                        opt.main = false;
                        return clickgo.task.run(url, opt);
                    },
                    end: function (tid) {
                        return clickgo.task.end(tid !== null && tid !== void 0 ? tid : taskId);
                    },
                    loadLocaleData: function (lang, data, pre = '') {
                        clickgo.task.loadLocaleData(lang, data, pre, taskId);
                    },
                    loadLocale: function (lang, path) {
                        return clickgo.task.loadLocale(lang, path, taskId, formId);
                    },
                    clearLocale: function () {
                        clickgo.task.clearLocale(taskId);
                    },
                    setLocale: function (lang, path) {
                        return clickgo.task.setLocale(lang, path, taskId, formId);
                    },
                    setLocaleLang: function (lang) {
                        clickgo.task.setLocaleLang(lang, taskId);
                    },
                    clearLocaleLang: function () {
                        clickgo.task.clearLocaleLang(taskId);
                    },
                    createTimer: function (fun, delay, opt = {}) {
                        opt.taskId = taskId;
                        if (!opt.formId) {
                            opt.formId = formId;
                        }
                        return clickgo.task.createTimer(fun, delay, opt);
                    },
                    removeTimer: function (timer) {
                        clickgo.task.removeTimer(timer, taskId);
                    },
                    sleep: function (fun, delay) {
                        return clickgo.task.sleep(fun, delay, taskId, formId);
                    },
                    systemTaskInfo: clickgo.task.systemTaskInfo,
                    setSystem: function (fid) {
                        return clickgo.task.setSystem(fid !== null && fid !== void 0 ? fid : formId, taskId);
                    },
                    clearSystem: function () {
                        return clickgo.task.clearSystem(taskId);
                    }
                },
                'theme': {
                    read: function (blob) {
                        return clickgo.theme.read(blob);
                    },
                    load: function (theme) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (!theme) {
                                return false;
                            }
                            return clickgo.theme.load(theme, taskId);
                        });
                    },
                    remove: function (name) {
                        return clickgo.theme.remove(name, taskId);
                    },
                    clear: function () {
                        return clickgo.theme.clear(taskId);
                    },
                    setGlobal: function (theme) {
                        return clickgo.theme.setGlobal(theme);
                    },
                    clearGlobal: function () {
                        clickgo.theme.clearGlobal();
                    }
                },
                'tool': {
                    blob2ArrayBuffer: function (blob) {
                        return clickgo.tool.blob2ArrayBuffer(blob);
                    },
                    clone: function (obj) {
                        return clickgo.tool.clone(obj);
                    },
                    sleep: function (ms = 0) {
                        return clickgo.tool.sleep(ms);
                    },
                    purify: function (text) {
                        return clickgo.tool.purify(text);
                    },
                    createObjectURL: function (object) {
                        return clickgo.tool.createObjectURL(object, taskId);
                    },
                    revokeObjectURL: function (url) {
                        clickgo.tool.revokeObjectURL(url, taskId);
                    },
                    rand: function (min, max) {
                        return clickgo.tool.rand(min, max);
                    },
                    'RANDOM_N': clickgo.tool.RANDOM_N,
                    'RANDOM_U': clickgo.tool.RANDOM_U,
                    'RANDOM_L': clickgo.tool.RANDOM_L,
                    'RANDOM_UN': clickgo.tool.RANDOM_UN,
                    'RANDOM_LN': clickgo.tool.RANDOM_LN,
                    'RANDOM_LU': clickgo.tool.RANDOM_LU,
                    'RANDOM_LUN': clickgo.tool.RANDOM_LUN,
                    'RANDOM_V': clickgo.tool.RANDOM_V,
                    'RANDOM_LUNS': clickgo.tool.RANDOM_LUNS,
                    random: function (length = 8, source = clickgo.tool.RANDOM_LN, block = '') {
                        return clickgo.tool.random(length, source, block);
                    },
                    getBoolean: function (param) {
                        return clickgo.tool.getBoolean(param);
                    },
                    escapeHTML: function (html) {
                        return clickgo.tool.escapeHTML(html);
                    },
                    request: function (url, opt) {
                        return clickgo.tool.request(url, opt);
                    },
                    parseUrl: function (url) {
                        return clickgo.tool.parseUrl(url);
                    },
                    urlResolve: function (from, to) {
                        return clickgo.tool.urlResolve(from, to);
                    },
                    blob2Text: function (blob) {
                        return clickgo.tool.blob2Text(blob);
                    },
                    blob2DataUrl: function (blob) {
                        return clickgo.tool.blob2DataUrl(blob);
                    },
                    execCommand: function (ac) {
                        clickgo.tool.execCommand(ac);
                    }
                },
                'zip': {
                    get: function (data) {
                        return clickgo.zip.get(data);
                    }
                }
            };
        }
        else {
            invoke.invokeClickgo = clickgo;
        }
        const preprocess = clickgo.getSafe() ? function (code, path) {
            const exec = /eval\W/.exec(code);
            if (exec) {
                notify({
                    'title': 'Error',
                    'content': `The "eval" is prohibited.\nFile: "${path}".`,
                    'type': 'danger'
                });
                return '';
            }
            return code;
        } : undefined;
        const components = yield control.init(t.id, formId, newBase, preprocess, invoke);
        if (!components) {
            if ((form === null || form === void 0 ? void 0 : form.vroot.$refs.form.maskFor) !== undefined) {
                form.vroot.$refs.form.maskFor = undefined;
            }
            return -5;
        }
        let style = opt.style;
        let layout = opt.layout;
        if (filePath) {
            if (!filePath.startsWith('/package/')) {
                return -6;
            }
            const file = filePath.slice(8);
            const layoutFile = app.files[file + '.xml'];
            if (layoutFile) {
                layout = layoutFile.replace(/^\ufeff/, '');
            }
            const styleFile = app.files[file + '.css'];
            if (styleFile) {
                style = styleFile.replace(/^\ufeff/, '');
            }
        }
        if (layout === undefined) {
            if ((form === null || form === void 0 ? void 0 : form.vroot.$refs.form.maskFor) !== undefined) {
                form.vroot.$refs.form.maskFor = undefined;
            }
            return -7;
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
        let receive = undefined;
        let expo = opt.code;
        if ((filePath === null || filePath === void 0 ? void 0 : filePath.startsWith('/package/')) && app.files[filePath.slice(8) + '.js']) {
            const file = filePath.slice(8);
            if (app.files[file + '.js']) {
                app.files['/invoke/clickgo.js'] = `module.exports = invokeClickgo;`;
                expo = loader.require(file, app.files, {
                    'dir': '/',
                    'invoke': invoke,
                    'preprocess': preprocess,
                    'map': {
                        'clickgo': '/invoke/clickgo'
                    }
                })[0];
            }
        }
        if (expo) {
            data = (_d = expo.data) !== null && _d !== void 0 ? _d : {};
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
            receive = expo.receive;
        }
        let prep = '';
        if (style) {
            const r = tool.stylePrepend(style);
            prep = r.prep;
            style = yield tool.styleUrl2DataUrl(newBase, r.style, app.files);
        }
        layout = tool.purify(layout);
        layout = tool.layoutAddTagClassAndReTagName(layout, true);
        layout = tool.layoutInsertAttr(layout, ':cg-focus=\'cgFocus\'', {
            'include': [/^cg-.+/]
        });
        const prepList = ['cg-task' + opt.taskId.toString() + '_'];
        if (prep !== '') {
            prepList.push(prep);
        }
        layout = tool.layoutClassPrepend(layout, prepList);
        layout = tool.eventsAttrWrap(layout);
        elements.list.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId.toString()}" data-task-id="${opt.taskId.toString()}"></div>`);
        const el = elements.list.children.item(elements.list.children.length - 1);
        computed.taskId = {
            get: function () {
                return taskId;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "taskId".\nPath: ${this.cgPath}`,
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
                    'content': `The software tries to modify the system variable "formId".\nPath: ${this.cgPath}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.controlName = {
            get: function () {
                return 'root';
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "controlName".\nPath: ${this.cgPath}`,
                    'type': 'danger'
                });
                return;
            }
        };
        data._cgFocus = false;
        computed.cgFocus = {
            get: function () {
                return this._cgFocus;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "cgFocus".\nPath: ${this.cgPath}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.cgPath = {
            get: function () {
                return newBase;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "cgPath".\nPath: ${this.cgPath}`,
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
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "cgPrep".\nPath: ${this._cgPath}`,
                    'type': 'danger'
                });
                return;
            }
        };
        data._cgCustomZIndex = false;
        computed.cgCustomZIndex = {
            get: function () {
                return this._cgCustomZIndex;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "cgCustomZIndex".\nPath: ${this.cgPath}`,
                    'type': 'danger'
                });
                return;
            }
        };
        if (topMost) {
            data._cgTopMost = true;
        }
        else {
            data._cgTopMost = false;
        }
        computed.cgTopMost = {
            get: function () {
                return this._cgTopMost;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "cgTopMost".\nPath: ${this.cgPath}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.cgLocale = function () {
            if (task.list[this.taskId].locale.lang === '') {
                return core.config.locale;
            }
            return task.list[this.taskId].locale.lang;
        };
        computed.l = function () {
            return (key) => {
                var _a, _b, _c, _d;
                return (_d = (_b = (_a = task.list[this.taskId].locale.data[this.cgLocale]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : (_c = task.list[this.taskId].locale.data['en']) === null || _c === void 0 ? void 0 : _c[key]) !== null && _d !== void 0 ? _d : 'LocaleError';
            };
        };
        methods.cgClassPrepend = function (cla) {
            if (typeof cla !== 'string') {
                return cla;
            }
            return `cg-task${this.taskId}_${cla} ${this.cgPrep}${cla}`;
        };
        methods.cgAllowEvent = function (e) {
            return dom.allowEvent(e);
        };
        methods.cgReceive = function (obj) {
            receive === null || receive === void 0 ? void 0 : receive.call(this, obj);
        };
        if (style) {
            dom.pushStyle(taskId, style, 'form', formId);
        }
        const rtn = yield new Promise(function (resolve) {
            const vapp = clickgo.vue.createApp({
                'template': layout.replace(/^<cg-form/, '<cg-form ref="form"'),
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
                        if (this.$refs.form.icon !== '') {
                            const icon = yield clickgo.fs.getContent(this.$refs.form.icon);
                            this.$refs.form.iconData = (icon instanceof Blob) ? yield clickgo.tool.blob2DataUrl(icon) : '';
                        }
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
            vapp.config.errorHandler = function (err, vm, info) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\ntask id: ${vm.taskId}\nForm id: ${vm.formId}`,
                    'type': 'danger'
                });
                core.trigger('error', vm.taskId, vm.formId, err, info);
            };
            for (const key in components) {
                vapp.component(key, components[key]);
            }
            vapp.mount(el);
        });
        const nform = {
            'id': formId,
            'vapp': rtn.vapp,
            'vroot': rtn.vroot,
            'events': {}
        };
        t.forms[formId] = nform;
        if (opt.mask && form) {
            form.vroot.$refs.form.maskFor = formId;
            nform.vroot.$refs.form.maskFrom = form.id;
        }
        yield tool.sleep(34);
        if (mounted) {
            try {
                yield mounted.call(rtn.vroot, opt.data);
            }
            catch (err) {
                if ((nform === null || nform === void 0 ? void 0 : nform.vroot.$refs.form.maskFor) !== undefined) {
                    nform.vroot.$refs.form.maskFor = undefined;
                }
                core.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error.');
                t.forms[formId] = undefined;
                delete t.forms[formId];
                rtn.vapp.unmount();
                rtn.vapp._container.remove();
                dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
                return -8;
            }
        }
        const area = core.getAvailArea();
        if (!rtn.vroot.$refs.form.stateMaxData) {
            if (rtn.vroot.$refs.form.left === -1) {
                rtn.vroot.$refs.form.setPropData('left', (area.width - rtn.vroot.$el.offsetWidth) / 2);
            }
            if (rtn.vroot.$refs.form.top === -1) {
                rtn.vroot.$refs.form.setPropData('top', (area.height - rtn.vroot.$el.offsetHeight) / 2);
            }
        }
        if (rtn.vroot.$refs.form.zIndex !== -1) {
            rtn.vroot._cgCustomZIndex = true;
        }
        if (rtn.vroot.$refs.form.$data.show !== false) {
            rtn.vroot.$refs.form.$data.showData = true;
        }
        core.trigger('formCreated', taskId, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconData);
        changeFocus(formId);
        return nform;
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
        const formId = opt.formId;
        if (!formId) {
            resolve('');
            return;
        }
        const taskId = getTaskId(formId);
        const t = task.list[taskId];
        if (!t) {
            resolve('');
            return;
        }
        const locale = t.forms[formId].vroot.cgLocale;
        if (opt.buttons === undefined) {
            opt.buttons = [(_b = (_a = info.locale[locale]) === null || _a === void 0 ? void 0 : _a.ok) !== null && _b !== void 0 ? _b : info.locale['en'].ok];
        }
        create({
            'taskId': taskId,
            'formId': formId,
            'layout': `<form title="${(_c = opt.title) !== null && _c !== void 0 ? _c : 'dialog'}" width="auto" height="auto" :min="false" :max="false" :resize="false" border="${opt.title ? 'normal' : 'plain'}" direction="v"><dialog :buttons="buttons" @select="select"${opt.direction ? ` direction="${opt.direction}"` : ''}>${opt.content}</dialog></form>`,
            'code': {
                data: {
                    'buttons': opt.buttons
                },
                methods: {
                    select: function (button) {
                        var _a, _b;
                        const event = {
                            'go': true,
                            preventDefault: function () {
                                this.go = false;
                            }
                        };
                        (_b = (_a = opt).select) === null || _b === void 0 ? void 0 : _b.call(_a, event, button);
                        if (event.go) {
                            close(this.formId);
                            resolve(button);
                        }
                    }
                }
            },
            'mask': true
        }).catch((e) => {
            throw e;
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
        const formId = opt.formId;
        if (!formId) {
            return false;
        }
        const taskId = getTaskId(formId);
        const t = task.list[taskId];
        if (!t) {
            return false;
        }
        const locale = t.forms[formId].vroot.cgLocale;
        const buttons = [(_b = (_a = info.locale[locale]) === null || _a === void 0 ? void 0 : _a.yes) !== null && _b !== void 0 ? _b : info.locale['en'].yes, (_d = (_c = info.locale[locale]) === null || _c === void 0 ? void 0 : _c.no) !== null && _d !== void 0 ? _d : info.locale['en'].no];
        if (opt.cancel) {
            buttons.push((_f = (_e = info.locale[locale]) === null || _e === void 0 ? void 0 : _e.cancel) !== null && _f !== void 0 ? _f : info.locale['en'].cancel);
        }
        const res = yield dialog({
            'formId': formId,
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
function setTopMost(top, opt = {}) {
    const form = getForm(opt.taskId, opt.formId);
    if (!form) {
        return;
    }
    form.vroot.$data._cgCustomZIndex = false;
    if (top) {
        form.vroot.$data._cgTopMost = true;
        if (!form.vroot.cgFocus) {
            changeFocus(form.id);
        }
        else {
            form.vroot.$refs.form.setPropData('zIndex', ++info.topLastZIndex);
        }
    }
    else {
        form.vroot.$data._cgTopMost = false;
        form.vroot.$refs.form.setPropData('zIndex', ++info.lastZIndex);
    }
}
exports.setTopMost = setTopMost;
function flash(formId, taskId) {
    var _a;
    const form = getForm(taskId, formId);
    if (!form) {
        return;
    }
    if (!form.vroot.cgFocus) {
        changeFocus(form.id);
    }
    if ((_a = form.vroot.$refs.form) === null || _a === void 0 ? void 0 : _a.flashTimer) {
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
function show(formId, taskId) {
    const form = getForm(taskId, formId);
    if (!form) {
        return;
    }
    form.vroot.$refs.form.$data.showData = true;
}
exports.show = show;
function hide(formId, taskId) {
    const form = getForm(taskId, formId);
    if (!form) {
        return;
    }
    form.vroot.$refs.form.$data.showData = false;
}
exports.hide = hide;
window.addEventListener('resize', function () {
    task.refreshSystemPosition();
});
