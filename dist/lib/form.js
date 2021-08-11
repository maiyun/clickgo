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
exports.create = exports.remove = exports.doFocusAndPopEvent = exports.hidePop = exports.showPop = exports.removeFromPop = exports.appendToPop = exports.simpletaskRoot = exports.hideNotify = exports.notifyProgress = exports.notify = exports.hideRectangle = exports.showRectangle = exports.moveRectangle = exports.showCircular = exports.getRectByBorder = exports.getMaxZIndexFormID = exports.changeFocus = exports.getList = exports.get = exports.min = exports.getTaskId = exports.refreshMaxPosition = exports.getAvailArea = exports.refreshTaskPosition = exports.clearTask = exports.setTask = exports.getTask = exports.lastPopZIndex = exports.lastTopZIndex = exports.lastZIndex = exports.lastFormId = exports.popShowing = void 0;
exports.lastFormId = 0;
exports.lastZIndex = 999;
exports.lastTopZIndex = 9999999;
exports.lastPopZIndex = 0;
let localData = {
    'en-us': {
        'ok': 'OK',
        'yes': 'Yes',
        'no': 'No',
        'cancel': 'Cancel'
    },
    'zh-cn': {
        'ok': '好',
        'yes': '是',
        'no': '否',
        'cancel': '取消'
    },
    'zh-tw': {
        'ok': '好',
        'yes': '是',
        'no': '否',
        'cancel': '取消'
    },
    'ja-jp': {
        'ok': '好',
        'yes': 'はい',
        'no': 'いいえ',
        'cancel': 'キャンセル'
    }
};
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
let taskInfo = {
    'taskId': 0,
    'formId': 0,
    'length': 0
};
function getTask() {
    return {
        'taskId': taskInfo.taskId,
        'formId': taskInfo.formId,
        'length': taskInfo.length
    };
}
exports.getTask = getTask;
function setTask(taskId, formId) {
    let task = clickgo.task.list[taskId];
    if (!task) {
        return false;
    }
    let form = task.forms[formId];
    if (!form) {
        return false;
    }
    if (form.vroot.position === undefined) {
        notify({
            'title': 'Warning',
            'content': `Task id is "${taskId}" app is not an available task app, position not found.`,
            'type': 'warning'
        });
        return false;
    }
    if (taskInfo.taskId > 0) {
        notify({
            'title': 'Info',
            'content': 'More than 1 system-level task application is currently running.',
            'type': 'info'
        });
    }
    taskInfo.taskId = taskId;
    taskInfo.formId = formId;
    refreshTaskPosition();
    return true;
}
exports.setTask = setTask;
function clearTask(taskId) {
    if (taskInfo.taskId !== taskId) {
        return false;
    }
    taskInfo.taskId = 0;
    taskInfo.formId = 0;
    taskInfo.length = 0;
    clickgo.core.trigger('screenResize');
    return true;
}
exports.clearTask = clearTask;
function refreshTaskPosition() {
    if (taskInfo.taskId > 0) {
        let form = clickgo.task.list[taskInfo.taskId].forms[taskInfo.formId];
        switch (clickgo.core.config['task.position']) {
            case 'left':
            case 'right': {
                form.vroot.$refs.form.setPropData('width', 'auto');
                form.vroot.$refs.form.setPropData('height', window.innerHeight);
                break;
            }
            case 'top':
            case 'bottom': {
                form.vroot.$refs.form.setPropData('width', window.innerWidth);
                form.vroot.$refs.form.setPropData('height', 'auto');
                break;
            }
        }
        setTimeout(function () {
            switch (clickgo.core.config['task.position']) {
                case 'left': {
                    taskInfo.length = form.vroot.$el.offsetWidth;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'right': {
                    taskInfo.length = form.vroot.$el.offsetWidth;
                    form.vroot.$refs.form.setPropData('left', window.innerWidth - taskInfo.length);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'top': {
                    taskInfo.length = form.vroot.$el.offsetHeight;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'bottom': {
                    taskInfo.length = form.vroot.$el.offsetHeight;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', window.innerHeight - taskInfo.length);
                    break;
                }
            }
            clickgo.core.trigger('screenResize');
        }, 50);
    }
    else {
        clickgo.core.trigger('screenResize');
    }
}
exports.refreshTaskPosition = refreshTaskPosition;
function getAvailArea() {
    let left = 0;
    let top = 0;
    let width = 0;
    let height = 0;
    switch (clickgo.core.config['task.position']) {
        case 'left': {
            left = taskInfo.length;
            top = 0;
            width = window.innerWidth - taskInfo.length;
            height = window.innerHeight;
            break;
        }
        case 'right': {
            left = 0;
            top = 0;
            width = window.innerWidth - taskInfo.length;
            height = window.innerHeight;
            break;
        }
        case 'top': {
            left = 0;
            top = taskInfo.length;
            width = window.innerWidth;
            height = window.innerHeight - taskInfo.length;
            break;
        }
        case 'bottom': {
            left = 0;
            top = 0;
            width = window.innerWidth;
            height = window.innerHeight - taskInfo.length;
        }
    }
    return {
        'left': left,
        'top': top,
        'width': width,
        'height': height
    };
}
exports.getAvailArea = getAvailArea;
function refreshMaxPosition() {
    let area = getAvailArea();
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
        vroot.$refs.form.setPropData('left', area.left);
        vroot.$refs.form.setPropData('top', area.top);
        vroot.$refs.form.setPropData('width', area.width);
        vroot.$refs.form.setPropData('height', area.height);
    }
}
exports.refreshMaxPosition = refreshMaxPosition;
function getTaskId(formId) {
    let formElement = formListElement.querySelector(`[data-form-id='${formId}']`);
    if (!formElement) {
        return 0;
    }
    let taskIdAttr = formElement.getAttribute('data-task-id');
    if (!taskIdAttr) {
        return 0;
    }
    return parseInt(taskIdAttr);
}
exports.getTaskId = getTaskId;
function min(formId) {
    let taskId = getTaskId(formId);
    let task = clickgo.task.list[taskId];
    if (!task) {
        return false;
    }
    task.forms[formId].vroot.cgMin();
    return true;
}
exports.min = min;
function get(formId) {
    let taskId = getTaskId(formId);
    let item = clickgo.task.list[taskId].forms[formId];
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
function getList(taskId) {
    if (!clickgo.task.list[taskId]) {
        return {};
    }
    let list = {};
    for (let fid in clickgo.task.list[taskId].forms) {
        let item = clickgo.task.list[taskId].forms[fid];
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
    }
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
                task.forms[dataFormIdNumber].vroot._cgFocus = false;
                clickgo.core.trigger('formBlurred', taskId, dataFormIdNumber);
            }
        }
        else {
            return;
        }
    }
    if (formId === 0) {
        return;
    }
    let el = document.querySelector(`.cg-form-list > [data-form-id='${formId}']`);
    if (!el) {
        return;
    }
    if (el.childNodes.item(0).classList.contains('cg-state-min')) {
        min(formId);
    }
    let taskId = parseInt((_b = el.getAttribute('data-task-id')) !== null && _b !== void 0 ? _b : '0');
    let task = clickgo.task.list[taskId];
    if (!task.forms[formId].vroot.cgCustomZIndex) {
        if (task.forms[formId].vroot.cgTopMost) {
            task.forms[formId].vroot.$refs.form.setPropData('zIndex', ++exports.lastTopZIndex);
        }
        else {
            task.forms[formId].vroot.$refs.form.setPropData('zIndex', ++exports.lastZIndex);
        }
    }
    let maskFor = task.forms[formId].vroot.$refs.form.maskFor;
    if ((typeof maskFor === 'number') && (clickgo.task.list[taskId].forms[maskFor])) {
        if (get(maskFor).stateMin) {
            min(maskFor);
        }
        if (!clickgo.task.list[taskId].forms[maskFor].vroot.cgCustomZIndex) {
            if (clickgo.task.list[taskId].forms[maskFor].vroot.cgTopMost) {
                clickgo.task.list[taskId].forms[maskFor].vroot.$refs.form.setPropData('zIndex', ++exports.lastTopZIndex);
            }
            else {
                clickgo.task.list[taskId].forms[maskFor].vroot.$refs.form.setPropData('zIndex', ++exports.lastZIndex);
            }
        }
        clickgo.task.list[taskId].forms[maskFor].vapp._container.classList.add('cg-focus');
        clickgo.task.list[taskId].forms[maskFor].vroot._cgFocus = true;
        clickgo.core.trigger('formFocused', taskId, maskFor);
        clickgo.task.list[taskId].forms[maskFor].vroot.cgFlash();
    }
    else {
        task.forms[formId].vapp._container.classList.add('cg-focus');
        task.forms[formId].vroot._cgFocus = true;
        clickgo.core.trigger('formFocused', taskId, formId);
    }
}
exports.changeFocus = changeFocus;
function getMaxZIndexFormID(out = {}) {
    var _a, _b;
    let zIndex = 0;
    let formId = null;
    let fl = document.querySelector('.cg-form-list');
    for (let i = 0; i < fl.children.length; ++i) {
        let root = fl.children.item(i);
        let formWrap = root.children.item(0);
        let tid = parseInt(root.getAttribute('data-task-id'));
        if ((_a = out.taskIds) === null || _a === void 0 ? void 0 : _a.includes(tid)) {
            continue;
        }
        let fid = parseInt(root.getAttribute('data-form-id'));
        if ((_b = out.formIds) === null || _b === void 0 ? void 0 : _b.includes(fid)) {
            continue;
        }
        let z = parseInt(formWrap.style.zIndex);
        if (z > 9999999) {
            continue;
        }
        if (z > zIndex) {
            zIndex = z;
            formId = fid;
        }
    }
    return formId;
}
exports.getMaxZIndexFormID = getMaxZIndexFormID;
function getRectByBorder(border) {
    var _a, _b, _c, _d;
    let area = getAvailArea();
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
        rectangleElement.style.width = '5px';
        rectangleElement.style.height = '5px';
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
let systemElement = document.createElement('div');
systemElement.id = 'cg-system';
systemElement.classList.add('cg-system');
systemElement.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
document.getElementsByTagName('body')[0].appendChild(systemElement);
systemElement.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, {
    'passive': false
});
let notifyTop = 10;
let notifyId = 0;
function notify(opt) {
    var _a;
    let nid = ++notifyId;
    let timeout = 5000;
    if (opt.timeout !== undefined) {
        if (opt.timeout <= 0 || opt.timeout > 300000) {
            timeout = 300000;
        }
        else {
            timeout = opt.timeout;
        }
    }
    if (opt.progress && !opt.type) {
        opt.type = 'progress';
    }
    let el = document.createElement('div');
    let y = notifyTop;
    el.classList.add('cg-system-notify');
    el.setAttribute('data-notifyid', nid.toString());
    el.style.transform = `translateY(${y}px) translateX(280px)`;
    el.style.opacity = '1';
    el.innerHTML = `<div class="cg-system-icon cg-system-icon-${clickgo.tool.escapeHTML((_a = opt.type) !== null && _a !== void 0 ? _a : 'primary')}"></div>
<div style="flex: 1;">
    <div class="cg-system-notify-title">${clickgo.tool.escapeHTML(opt.title)}</div>
    <div class="cg-system-notify-content">${clickgo.tool.escapeHTML(opt.content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}</div>
    ${opt.progress ? '<div class="cg-system-notify-progress"></div>' : ''}
</div>`;
    if (opt.icon) {
        el.childNodes.item(0).style.background = 'url(' + opt.icon + ')';
        el.childNodes.item(0).style.backgroundSize = '16px';
    }
    systemElement.appendChild(el);
    notifyTop += el.offsetHeight + 10;
    requestAnimationFrame(function () {
        el.style.transform = `translateY(${y}px) translateX(-10px)`;
        let timer = window.setTimeout(function () {
            hideNotify(nid);
        }, timeout);
        el.setAttribute('data-timer', timer.toString());
    });
    return nid;
}
exports.notify = notify;
function notifyProgress(notifyId, per) {
    let el = systemElement.querySelector(`[data-notifyid="${notifyId}"]`);
    if (!el) {
        return;
    }
    let progress = el.querySelector('.cg-system-notify-progress');
    if (!progress) {
        return;
    }
    if (per > 100) {
        per = 100;
    }
    if (per === 1) {
        let o = parseFloat(progress.style.width);
        if (o > 1) {
            per = 100;
        }
    }
    if (per === 100) {
        progress.style.transitionDelay = '.1s';
    }
    progress.style.width = (per < 1 ? per * 100 : per) + '%';
}
exports.notifyProgress = notifyProgress;
function hideNotify(notifyId) {
    let el = systemElement.querySelector(`[data-notifyid="${notifyId}"]`);
    if (!el) {
        return;
    }
    clearTimeout(parseInt(el.getAttribute('data-timer')));
    let notifyHeight = el.offsetHeight;
    el.style.opacity = '0';
    setTimeout(function () {
        notifyTop -= notifyHeight + 10;
        let notifyElementList = document.getElementsByClassName('cg-system-notify');
        let needSub = false;
        for (let notifyElement of notifyElementList) {
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
let simpletaskElement = document.createElement('div');
simpletaskElement.id = 'cg-simpletask';
simpletaskElement.classList.add('cg-simpletask');
simpletaskElement.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
document.getElementsByTagName('body')[0].appendChild(simpletaskElement);
simpletaskElement.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, {
    'passive': false
});
const simpletaskApp = Vue.createApp({
    'template': '<div v-for="(item, formId) of forms" class="cg-simpletask-item" @click="tap(parseInt(formId))"><div v-if="item.icon" class="cg-simpletask-icon" :style="{\'background-image\': \'url(\' + item.icon + \')\'}"></div><div>{{item.title}}</div></div>',
    'data': function () {
        return {
            'forms': {}
        };
    },
    'watch': {
        'forms': {
            handler: function () {
                let length = Object.keys(this.forms).length;
                if (length > 0) {
                    if (simpletaskElement.style.bottom !== '0px') {
                        simpletaskElement.style.bottom = '0px';
                    }
                }
                else {
                    if (simpletaskElement.style.bottom === '0px') {
                        simpletaskElement.style.bottom = '-46px';
                    }
                }
            },
            'deep': true
        }
    },
    'methods': {
        tap: function (formId) {
            min(formId);
            changeFocus(formId);
        }
    },
    'mounted': function () {
        exports.simpletaskRoot = this;
    }
});
simpletaskApp.mount('#cg-simpletask');
function appendToPop(el) {
    popListElement.appendChild(el);
}
exports.appendToPop = appendToPop;
function removeFromPop(el) {
    popListElement.removeChild(el);
}
exports.removeFromPop = removeFromPop;
function showPop(pop, direction, opt = {}) {
    var _a, _b, _c;
    if (pop.cgSelfPopOpen) {
        return;
    }
    if (opt.null === undefined) {
        opt.null = false;
    }
    if (opt.size === undefined) {
        opt.size = {};
    }
    let doShow = (pop.cgSelfPop !== undefined) ? true : opt.null;
    if (!clickgo.dom.findParentByClass(pop.$el, 'cg-pop-list')) {
        if (exports.popShowing) {
            exports.popShowing.cgHidePop();
        }
        if (doShow) {
            exports.popShowing = pop;
        }
    }
    (_a = pop.cgParentPopLayer.cgChildPopItemShowing) === null || _a === void 0 ? void 0 : _a.cgHidePop();
    if (doShow) {
        pop.cgSelfPopOpen = true;
        pop.cgParentPopLayer.cgChildPopItemShowing = pop;
    }
    if (pop.cgSelfPop === undefined) {
        pop.cgPopPosition = {
            'left': '-5000px',
            'top': '0px',
            'zIndex': '0'
        };
        return;
    }
    let width = (_b = opt.size.width) !== null && _b !== void 0 ? _b : pop.cgSelfPop.$el.offsetWidth;
    let height = (_c = opt.size.height) !== null && _c !== void 0 ? _c : pop.cgSelfPop.$el.offsetHeight;
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
    pop.cgPopPosition = {
        'left': left + 'px',
        'top': top + 'px',
        'zIndex': (++exports.lastPopZIndex).toString()
    };
    if (opt.size.width) {
        pop.cgPopPosition.width = opt.size.width + 'px';
    }
    if (opt.size.height) {
        pop.cgPopPosition.width = opt.size.height + 'px';
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
    let taskId = getTaskId(formId);
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
            let fid = getMaxZIndexFormID({
                'formIds': [formId]
            });
            if (fid) {
                changeFocus(fid);
            }
            if (!clickgo.task.list[taskId]) {
                return true;
            }
            clickgo.task.list[taskId].forms[formId].vapp.unmount();
            clickgo.task.list[taskId].forms[formId].vapp._container.remove();
            delete (clickgo.task.list[taskId].forms[formId]);
            clickgo.dom.removeStyle(taskId, 'form', formId);
            clickgo.core.trigger('formRemoved', taskId, formId, title, icon);
        }, 100);
        return true;
    }
    else {
        return false;
    }
}
exports.remove = remove;
function create(taskId, opt) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        let cgPath = (_b = (_a = opt.file) !== null && _a !== void 0 ? _a : opt.path) !== null && _b !== void 0 ? _b : '/';
        let task = clickgo.task.list[taskId];
        if (!task) {
            return -1;
        }
        let appPkg = task.appPkg;
        let formId = ++exports.lastFormId;
        let invoke = {
            'window': undefined,
            'loader': undefined
        };
        let ks = Object.getOwnPropertyNames(window);
        for (let k of ks) {
            if (k.includes('Event')) {
                continue;
            }
            if (['__awaiter', 'requestAnimationFrame', 'eval', 'Math', 'Array', 'Blob', 'Infinity', 'parseInt', 'parseFloat', 'Promise', 'Date', 'JSON'].includes(k)) {
                continue;
            }
            invoke[k] = undefined;
        }
        invoke.clickgo = {
            'core': {},
            'dom': {},
            'form': {},
            'task': {},
            'tool': {},
            'zip': {}
        };
        for (let k in clickgo.core) {
            if (!['config', 'trigger'].includes(k)) {
                continue;
            }
            invoke.clickgo.core[k] = clickgo.core[k];
        }
        for (let k in clickgo.dom) {
            if (!['setGlobalCursor', 'isMouseAlsoTouchEvent', 'getStyleCount', 'getSize', 'watchSize', 'watch', 'bindDown', 'bindLong', 'is', 'bindMove', 'bindResize'].includes(k)) {
                continue;
            }
            invoke.clickgo.dom[k] = clickgo.dom[k];
        }
        for (let k in clickgo.form) {
            if (!['getTask', 'setTask', 'clearTask', 'getAvailArea', 'refreshMaxPosition', 'getTaskId', 'min', 'get', 'getList', 'changeFocus', 'getMaxZIndexFormID', 'getRectByBorder', 'showCircular', 'moveRectangle', 'showRectangle', 'hideRectangle', 'notify', 'notifyProgress', 'hideNotify', 'showPop', 'hidePop'].includes(k)) {
                continue;
            }
            invoke.clickgo.form[k] = clickgo.form[k];
        }
        for (let k in clickgo.task) {
            if (!['get', 'getList', 'run', 'end'].includes(k)) {
                continue;
            }
            invoke.clickgo.task[k] = clickgo.task[k];
        }
        for (let k in clickgo.tool) {
            if (!['blob2ArrayBuffer', 'clone', 'sleep', 'purify', 'getMimeByPath', 'rand', 'getBoolean', 'escapeHTML', 'includes', 'replace', 'parseUrl', 'urlResolve', 'blob2Text', 'blob2DataUrl'].includes(k)) {
                continue;
            }
            invoke.clickgo.tool[k] = clickgo.tool[k];
        }
        for (let k in clickgo.zip) {
            if (!['get'].includes(k)) {
                continue;
            }
            invoke.clickgo.zip[k] = clickgo.zip[k];
        }
        invoke.console = {
            log: function (message, ...optionalParams) {
                console.log(message, ...optionalParams);
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
        let preprocess = function (code, path) {
            let exec = /eval\W/.exec(code);
            if (exec) {
                notify({
                    'title': 'Error',
                    'content': `The "eval" is prohibited.\nFile: "${path}".`,
                    'type': 'danger'
                });
                return '';
            }
            return code;
        };
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
                    let expo = loader.require(item.config.code, item.files, {
                        'dir': '/',
                        'invoke': invoke,
                        'preprocess': preprocess
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
                let layout = '';
                let prep = '';
                if (task.initControls[name]) {
                    layout = task.initControls[name].layout;
                    prep = task.initControls[name].prep;
                }
                else {
                    let style = item.files[item.config.style + '.css'];
                    if (style) {
                        let r = clickgo.tool.stylePrepend(style.replace(/^\ufeff/, ''));
                        prep = r.prep;
                        clickgo.dom.pushStyle(task.id, yield clickgo.tool.styleUrl2ObjectOrDataUrl(item.config.style, r.style, item), 'control', name);
                    }
                    layout = item.files[item.config.layout + '.html'];
                    if (!layout) {
                        return -4;
                    }
                    layout = layout.replace(/^\ufeff/, '');
                    let prepList = [
                        'cg-theme-task' + taskId + '-' + name + '_'
                    ];
                    if (prep !== '') {
                        prepList.push(prep);
                    }
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
                computed.taskId = {
                    get: function () {
                        return taskId;
                    },
                    set: function () {
                        notify({
                            'title': 'Error',
                            'content': `The control tries to modify the system variable "taskId".\nPath: ${this.cgPath}\nControl: ${name}`,
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
                            'content': `The control tries to modify the system variable "formId".\nPath: ${this.cgPath}\nControl: ${name}`,
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
                        notify({
                            'title': 'Error',
                            'content': `The control tries to modify the system variable "controlName".\nPath: ${this.cgPath}\nControl: ${name}`,
                            'type': 'danger'
                        });
                        return;
                    }
                };
                computed.cgPath = {
                    get: function () {
                        return cgPath;
                    },
                    set: function () {
                        notify({
                            'title': 'Error',
                            'content': `The control tries to modify the system variable "cgPath".\nPath: ${this.cgPath}\nControl: ${name}`,
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
                            'content': `The control tries to modify the system variable "cgPrep".\nPath: ${this.cgPath}\nControl: ${name}`,
                            'type': 'danger'
                        });
                        return;
                    }
                };
                computed.cgSlots = function () {
                    return (name = 'default') => {
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
                };
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
                        let parent = this.cgParent;
                        return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
                    }
                };
                computed.cgHeightPx = function () {
                    if (this.height !== undefined) {
                        return this.height + 'px';
                    }
                    if (this.flex !== '') {
                        let parent = this.cgParent;
                        return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
                    }
                };
                computed.cgLocal = function () {
                    if (clickgo.task.list[this.taskId].local.name === '') {
                        return clickgo.core.config.local;
                    }
                    return clickgo.task.list[this.taskId].local.name;
                };
                computed.l = function () {
                    return (key, data) => {
                        var _a, _b, _c, _d, _e, _f;
                        if (data) {
                            return (_c = (_b = (_a = data[this.cgLocal]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : data['en-us'][key]) !== null && _c !== void 0 ? _c : 'LocaleError';
                        }
                        else if (this.localData) {
                            return (_f = (_e = (_d = this.localData[this.cgLocal]) === null || _d === void 0 ? void 0 : _d[key]) !== null && _e !== void 0 ? _e : this.localData['en-us'][key]) !== null && _f !== void 0 ? _f : 'LocaleError';
                        }
                        else {
                            return 'LocaleError';
                        }
                    };
                };
                computed.cgParent = function () {
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
                methods.cgClose = function () {
                    remove(this.formId);
                };
                methods.cgBindFormResize = function (e, border) {
                    this.cgParentByName('form').resizeMethod(e, border);
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
                methods.cgGetFile = function (path) {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        if (path.startsWith('/clickgo/')) {
                            return yield clickgo.core.fetchClickGoFile(path.slice(8));
                        }
                        else {
                            path = clickgo.tool.urlResolve(this.cgPath, path);
                            return (_a = task.appPkg.files[path]) !== null && _a !== void 0 ? _a : null;
                        }
                    });
                };
                methods.cgGetObjectUrl = function (file) {
                    file = clickgo.tool.urlResolve(this.cgPath, file);
                    if (file.startsWith('/clickgo/')) {
                        return clickgo.cgRootPath + file.slice(9);
                    }
                    return clickgo.tool.file2ObjectUrl(file, clickgo.task.list[this.taskId]);
                };
                methods.cgGetDataUrl = function (file) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let f = yield this.cgGetFile(file);
                        if (!f) {
                            return null;
                        }
                        return f && f instanceof Blob ? yield clickgo.tool.blob2DataUrl(f) : null;
                    });
                };
                methods.cgClassPrepend = function (cla) {
                    if (typeof cla !== 'string') {
                        return cla;
                    }
                    if (cla.startsWith('cg-')) {
                        return cla;
                    }
                    return `cg-theme-task${this.taskId}-${this.controlName}_${cla} ${this.cgPrep}${cla}`;
                };
                methods.cgCreateTimer = function (fun, delay, interval = false) {
                    let timer;
                    if (interval) {
                        timer = window.setInterval(() => {
                            fun();
                        }, delay);
                    }
                    else {
                        timer = window.setTimeout(() => {
                            let i = clickgo.task.list[this.taskId].timers.indexOf(timer);
                            if (i === -1) {
                                return;
                            }
                            clickgo.task.list[this.taskId].timers.splice(i, 1);
                            fun();
                        }, delay);
                    }
                    clickgo.task.list[this.taskId].timers.push(timer);
                    return timer;
                };
                methods.cgRemoveTimer = function (timer) {
                    let i = clickgo.task.list[this.taskId].timers.indexOf(timer);
                    if (i === -1) {
                        return;
                    }
                    clickgo.task.list[this.taskId].timers.splice(i, 1);
                    clearTimeout(timer);
                };
                if (!methods.cgShowPop) {
                    methods.cgShowPop = function (direction, opt) {
                        clickgo.form.showPop(this, direction, opt);
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
            let layoutFile = appPkg.files[opt.file + '.xml'];
            if (layoutFile) {
                layout = layoutFile.replace(/^\ufeff/, '');
            }
            let styleFile = appPkg.files[opt.file + '.css'];
            if (styleFile) {
                style = styleFile.replace(/^\ufeff/, '');
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
        let expo = opt.code;
        if (appPkg.files[opt.file + '.js']) {
            expo = loader.require(opt.file, appPkg.files, {
                'dir': '/',
                'invoke': invoke,
                'preprocess': preprocess
            })[0];
        }
        if (expo) {
            data = (_c = expo.data) !== null && _c !== void 0 ? _c : {};
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
            style = yield clickgo.tool.styleUrl2ObjectOrDataUrl((_e = (_d = opt.file) !== null && _d !== void 0 ? _d : opt.path) !== null && _e !== void 0 ? _e : '/', r.style, task);
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
                return cgPath;
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
        if (opt.topMost) {
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
        computed.cgLocal = function () {
            if (clickgo.task.list[this.taskId].local.name === '') {
                return clickgo.core.config.local;
            }
            return clickgo.task.list[this.taskId].local.name;
        };
        computed.l = function () {
            return (key) => {
                var _a, _b;
                return (_b = (_a = clickgo.task.list[this.taskId].local.data[this.cgLocal]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : 'LocaleError';
            };
        };
        methods.cgCreateForm = function (paramOpt = {}) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                let inOpt = {
                    'path': this.cgPath
                };
                if (typeof paramOpt === 'string') {
                    inOpt.file = clickgo.tool.urlResolve(this.cgPath, paramOpt);
                }
                else {
                    if (paramOpt.file) {
                        inOpt.file = clickgo.tool.urlResolve(this.cgPath, paramOpt.file);
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
                    if (paramOpt.topMost) {
                        inOpt.topMost = paramOpt.topMost;
                    }
                    if (paramOpt.mask) {
                        this.$refs.form.maskFor = true;
                    }
                }
                if (this.cgTopMost) {
                    inOpt.topMost = true;
                }
                let form = yield create(taskId, inOpt);
                if (typeof form === 'number') {
                    if (this.$refs.form) {
                        this.$refs.form.maskFor = undefined;
                    }
                }
                else {
                    if ((_a = this.$refs.form) === null || _a === void 0 ? void 0 : _a.maskFor) {
                        this.$refs.form.maskFor = form.id;
                        form.vroot.$refs.form.maskFrom = this.formId;
                    }
                }
            });
        };
        methods.cgClose = function () {
            remove(this.formId);
        };
        methods.cgMax = function () {
            this.$refs.form.maxMethod();
        };
        methods.cgMin = function () {
            this.$refs.form.minMethod();
        };
        methods.cgBindFormDrag = function (e) {
            this.$refs.form.moveMethod(e, true);
        };
        methods.cgBindFormResize = function (e, border) {
            this.$refs.form.resizeMethod(e, border);
        };
        methods.cgSetSystemEventListener = function (name, func) {
            clickgo.task.list[this.taskId].forms[this.formId].events[name] = func;
        };
        methods.cgRemoveSystemEventListener = function (name) {
            delete (clickgo.task.list[this.taskId].forms[this.formId].events[name]);
        };
        methods.cgDialog = function (opt) {
            return new Promise((resolve) => {
                var _a, _b, _c;
                if (typeof opt === 'string' || typeof opt === 'number') {
                    opt = {
                        'content': opt
                    };
                }
                if (opt.buttons === undefined) {
                    opt.buttons = [(_b = (_a = localData[this.cgLocal]) === null || _a === void 0 ? void 0 : _a.ok) !== null && _b !== void 0 ? _b : localData['en-us'].ok];
                }
                this.cgCreateForm({
                    'layout': `<form title="${(_c = opt.title) !== null && _c !== void 0 ? _c : 'dialog'}" width="auto" height="auto" :min="false" :max="false" :resize="false" :min-height="50" border="${opt.title ? 'normal' : 'plain'}"><dialog :buttons="buttons" @select="select">${opt.content}</dialog></form>`,
                    'code': {
                        data: {
                            'buttons': opt.buttons
                        },
                        methods: {
                            select: function (button) {
                                var _a, _b;
                                let event = {
                                    'go': true,
                                    preventDefault: function () {
                                        this.go = false;
                                    }
                                };
                                (_b = (_a = opt).select) === null || _b === void 0 ? void 0 : _b.call(_a, event, button);
                                if (event.go) {
                                    this.cgClose();
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
        };
        methods.cgConfirm = function (content, cancel = false) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return __awaiter(this, void 0, void 0, function* () {
                let buttons = [(_b = (_a = localData[this.cgLocal]) === null || _a === void 0 ? void 0 : _a.yes) !== null && _b !== void 0 ? _b : localData['en-us'].yes, (_d = (_c = localData[this.cgLocal]) === null || _c === void 0 ? void 0 : _c.no) !== null && _d !== void 0 ? _d : localData['en-us'].no];
                if (cancel) {
                    buttons.push((_f = (_e = localData[this.cgLocal]) === null || _e === void 0 ? void 0 : _e.cancel) !== null && _f !== void 0 ? _f : localData['en-us'].cancel);
                }
                let res = yield this.cgDialog({
                    'content': content,
                    'buttons': buttons
                });
                if (res === ((_h = (_g = localData[this.cgLocal]) === null || _g === void 0 ? void 0 : _g.yes) !== null && _h !== void 0 ? _h : localData['en-us'].yes)) {
                    return true;
                }
                if (res === ((_k = (_j = localData[this.cgLocal]) === null || _j === void 0 ? void 0 : _j.cancel) !== null && _k !== void 0 ? _k : localData['en-us'].cancel)) {
                    return 0;
                }
                return false;
            });
        };
        methods.cgGetFile = function (path) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (path.startsWith('/clickgo/')) {
                    return yield clickgo.core.fetchClickGoFile(path.slice(8));
                }
                else {
                    path = clickgo.tool.urlResolve(this.cgPath, path);
                    return (_a = task.appPkg.files[path]) !== null && _a !== void 0 ? _a : null;
                }
            });
        };
        methods.cgGetObjectUrl = function (file) {
            file = clickgo.tool.urlResolve(this.cgPath, file);
            if (file.startsWith('/clickgo/')) {
                return clickgo.cgRootPath + file.slice(9);
            }
            return clickgo.tool.file2ObjectUrl(file, clickgo.task.list[this.taskId]);
        };
        methods.cgGetDataUrl = function (file) {
            return __awaiter(this, void 0, void 0, function* () {
                let f = yield this.cgGetFile(file);
                if (!f) {
                    return null;
                }
                return f && f instanceof Blob ? yield clickgo.tool.blob2DataUrl(f) : null;
            });
        };
        methods.cgLoadTheme = function (path) {
            return __awaiter(this, void 0, void 0, function* () {
                path = clickgo.tool.urlResolve(this.cgPath, path);
                return yield clickgo.theme.load(this.taskId, path);
            });
        };
        methods.cgRemoveTheme = function (path) {
            return __awaiter(this, void 0, void 0, function* () {
                path = clickgo.tool.urlResolve(this.cgPath, path);
                yield clickgo.theme.remove(this.taskId, path);
            });
        };
        methods.cgSetTheme = function (path) {
            return __awaiter(this, void 0, void 0, function* () {
                path = clickgo.tool.urlResolve(this.cgPath, path);
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
                    let blob = yield this.cgGetFile(path);
                    if (blob instanceof Blob) {
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
            this.$data._cgCustomZIndex = false;
            if (top) {
                this.$data._cgTopMost = true;
                if (!this.cgFocus) {
                    changeFocus(this.formId);
                }
                else {
                    this.$refs.form.setPropData('zIndex', ++exports.lastTopZIndex);
                }
            }
            else {
                this.$data._cgTopMost = false;
                this.$refs.form.setPropData('zIndex', ++exports.lastZIndex);
            }
        };
        methods.cgFlash = function () {
            var _a;
            if (!this.cgFocus) {
                changeFocus(this.formId);
            }
            if ((_a = this.$refs.form) === null || _a === void 0 ? void 0 : _a.flashTimer) {
                clearTimeout(this.$refs.form.flashTimer);
                this.$refs.form.flashTimer = undefined;
            }
            this.$refs.form.flashTimer = setTimeout(() => {
                if (this.$refs.form) {
                    this.$refs.form.flashTimer = undefined;
                }
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
                path = clickgo.tool.urlResolve(this.cgPath, path + '.json');
                if (!task.files[path]) {
                    return false;
                }
                try {
                    let data = JSON.parse(task.files[path]);
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
            clickgo.task.loadLocalData(this.taskId, name, data, pre);
        };
        methods.cgSetLocalName = function (name) {
            clickgo.task.list[this.taskId].local.name = name;
        };
        methods.cgClassPrepend = function (cla) {
            if (typeof cla !== 'string') {
                return cla;
            }
            if (cla.startsWith('cg-')) {
                return cla;
            }
            return `cg-task${this.taskId}_${cla} ${this.cgPrep}${cla}`;
        };
        methods.cgCreateTimer = function (fun, delay, interval = false) {
            let timer;
            if (interval) {
                timer = window.setInterval(() => {
                    fun();
                }, delay);
            }
            else {
                timer = window.setTimeout(() => {
                    let i = clickgo.task.list[this.taskId].timers.indexOf(timer);
                    if (i === -1) {
                        return;
                    }
                    clickgo.task.list[this.taskId].timers.splice(i, 1);
                    fun();
                }, delay);
            }
            clickgo.task.list[this.taskId].timers.push(timer);
            return timer;
        };
        methods.cgRemoveTimer = function (timer) {
            let i = clickgo.task.list[this.taskId].timers.indexOf(timer);
            if (i === -1) {
                return;
            }
            clickgo.task.list[this.taskId].timers.splice(i, 1);
            clearTimeout(timer);
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
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.$nextTick();
                        if (this.$refs.form.icon !== '') {
                            this.$refs.form.iconData = (_a = yield this.cgGetDataUrl(this.$refs.form.icon)) !== null && _a !== void 0 ? _a : '';
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
                    'content': `Message: ${err.message}\nTask id: ${vm.taskId}\nForm id: ${vm.formId}`,
                    'type': 'danger'
                });
                clickgo.core.trigger('error', vm.taskId, vm.formId, err, info);
            };
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
                clickgo.core.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error.');
                task.forms[formId] = undefined;
                delete (task.forms[formId]);
                rtn.vapp.unmount();
                rtn.vapp._container.remove();
                clickgo.dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
                return -6;
            }
        }
        let area = getAvailArea();
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
            rtn.vroot.cgShow();
        }
        clickgo.core.trigger('formCreated', taskId, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconData);
        changeFocus(formId);
        return form;
    });
}
exports.create = create;
window.addEventListener('resize', function () {
    refreshTaskPosition();
});
