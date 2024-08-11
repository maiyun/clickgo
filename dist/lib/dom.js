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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.is = void 0;
exports.inPage = inPage;
exports.setGlobalCursor = setGlobalCursor;
exports.hasTouchButMouse = hasTouchButMouse;
exports.createToStyleList = createToStyleList;
exports.removeFromStyleList = removeFromStyleList;
exports.pushStyle = pushStyle;
exports.removeStyle = removeStyle;
exports.getStyleCount = getStyleCount;
exports.watchPosition = watchPosition;
exports.unwatchPosition = unwatchPosition;
exports.isWatchPosition = isWatchPosition;
exports.clearWatchPosition = clearWatchPosition;
exports.getWatchSizeCount = getWatchSizeCount;
exports.watchSize = watchSize;
exports.unwatchSize = unwatchSize;
exports.isWatchSize = isWatchSize;
exports.clearWatchSize = clearWatchSize;
exports.getWatchCount = getWatchCount;
exports.watch = watch;
exports.unwatch = unwatch;
exports.isWatch = isWatch;
exports.clearWatch = clearWatch;
exports.watchStyle = watchStyle;
exports.isWatchStyle = isWatchStyle;
exports.clearWatchStyle = clearWatchStyle;
exports.watchProperty = watchProperty;
exports.isWatchProperty = isWatchProperty;
exports.clearWatchProperty = clearWatchProperty;
exports.getWatchInfo = getWatchInfo;
exports.bindClick = bindClick;
exports.bindDblClick = bindDblClick;
exports.bindDown = bindDown;
exports.bindScale = bindScale;
exports.bindGesture = bindGesture;
exports.allowEvent = allowEvent;
exports.bindLong = bindLong;
exports.setDragData = setDragData;
exports.bindDrag = bindDrag;
exports.bindMove = bindMove;
exports.bindResize = bindResize;
exports.findParentByData = findParentByData;
exports.findParentByClass = findParentByClass;
exports.findParentByTag = findParentByTag;
exports.index = index;
exports.siblings = siblings;
exports.siblingsData = siblingsData;
exports.fullscreen = fullscreen;
exports.exitFullscreen = exitFullscreen;
exports.createElement = createElement;
const clickgo = __importStar(require("../clickgo"));
const form = __importStar(require("./form"));
const core = __importStar(require("./core"));
const tool = __importStar(require("./tool"));
const topClass = ['#cg-form-list', '#cg-pop-list', '#cg-notify', '#cg-alert', '#cg-simpletask', '#cg-launcher', '#cg-confirm'];
function classUnfold(after, out = []) {
    const arr = [];
    for (const name of topClass) {
        if (out.includes(name)) {
            continue;
        }
        arr.push(name + (after ? (' ' + after) : ''));
    }
    return arr.join(', ');
}
const styleList = document.createElement('div');
styleList.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(styleList);
styleList.insertAdjacentHTML('beforeend', '<style id=\'cg-global-cursor\'></style>');
styleList.insertAdjacentHTML('beforeend', `<style id='cg-global'>
${classUnfold()} {-webkit-user-select: none; user-select: none; cursor: default; box-sizing: border-box;}
${topClass.slice(0, 4).join(', ')} {left: 0; top: 0; width: 0; height: 0; position: absolute;}
${classUnfold('img')} {vertical-align: bottom;}
${classUnfold('::selection', ['#cg-launcher'])} {background-color: rgba(0, 0, 0, .1);}
${classUnfold('*')}, ${classUnfold('*::after')}, ${classUnfold('*::before')} {box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}
${classUnfold(' > div')} {font-family: var(--g-family); font-size: var(--g-size); line-height: 1; -webkit-font-smoothing: antialiased;}
</style>`);
function inPage(el) {
    return document.body.contains(el);
}
let globalCursorStyle;
function setGlobalCursor(type) {
    if (!globalCursorStyle) {
        globalCursorStyle = document.getElementById('cg-global-cursor');
    }
    if (type) {
        globalCursorStyle.innerHTML = `* {cursor: ${type} !important;}`;
    }
    else {
        globalCursorStyle.innerHTML = '';
    }
}
let lastTouchTime = 0;
document.addEventListener('touchstart', function () {
    lastTouchTime = Date.now();
    return;
}, {
    'passive': true
});
function hasTouchButMouse(e) {
    if (e instanceof TouchEvent || e.type === 'touchstart') {
        return false;
    }
    if ((e.pointerType === 'touch') && (e.type === 'contextmenu')) {
        return true;
    }
    const now = Date.now();
    if (now - lastTouchTime < 1000 * 60) {
        return true;
    }
    return false;
}
function createToStyleList(taskId) {
    styleList.insertAdjacentHTML('beforeend', `<div id="cg-style-task${taskId}"><div class="cg-style-control"></div><div class="cg-style-theme"></div><style class="cg-style-global"></style><div class="cg-style-form"></div></div>`);
}
function removeFromStyleList(taskId) {
    var _a;
    (_a = document.getElementById('cg-style-task' + taskId.toString())) === null || _a === void 0 ? void 0 : _a.remove();
}
function pushStyle(taskId, style, type = 'global', formId = 0, panelId) {
    const el = document.querySelector(`#cg-style-task${taskId} > .cg-style-${type}`);
    if (!el) {
        return;
    }
    if (type === 'global') {
        el.innerHTML = style;
    }
    else if (type === 'theme' || type === 'control') {
        el.insertAdjacentHTML('beforeend', `<style data-name="${formId}">${style}</style>`);
    }
    else {
        el.insertAdjacentHTML('beforeend', `<style class="cg-style-form${formId}" data-panel="${panelId ? panelId.toString() : ''}">${style}</style>`);
    }
}
function removeStyle(taskId, type = 'global', formId = 0, panelId) {
    const styleTask = document.getElementById('cg-style-task' + taskId.toString());
    if (!styleTask) {
        return;
    }
    if (type === 'global') {
        const el = styleTask.querySelector(`.cg-style-global`);
        if (!el) {
            return;
        }
        el.innerHTML = '';
    }
    else if (type === 'theme' || type === 'control') {
        if (formId === 0) {
            const el = styleTask.querySelector(`.cg-style-${type}`);
            if (!el) {
                return;
            }
            el.innerHTML = '';
        }
        else {
            const elist = styleTask.querySelectorAll(`.cg-style-${type} > [data-name='${formId}']`);
            for (let i = 0; i < elist.length; ++i) {
                elist.item(i).remove();
            }
        }
    }
    else {
        const elist = styleTask.querySelectorAll('.cg-style-form' + formId.toString() + (panelId ? '[data-panel="' + panelId.toString() + '"]' : ''));
        for (let i = 0; i < elist.length; ++i) {
            elist.item(i).remove();
        }
    }
}
function getStyleCount(taskId, type) {
    return document.querySelectorAll(`#cg-style-task${taskId} > .cg-style-${type} > style`).length;
}
const watchPositionObjects = {};
let watchPositionIndex = 0;
function watchPosition(el, cb, immediate = false) {
    if (isWatchPosition(el)) {
        return false;
    }
    if (immediate) {
        try {
            const r = cb({
                'position': false,
                'size': false
            });
            if (r instanceof Promise) {
                r.catch(function (e) {
                    console.log('dom.watchPosition', e);
                });
            }
        }
        catch (e) {
            console.log('dom.watchPosition', e);
        }
    }
    const formWrap = findParentByData(el, 'form-id');
    if (!formWrap) {
        return false;
    }
    const formId = formWrap.dataset.formId;
    const panelWrap = findParentByData(el, 'panel-id');
    const panelId = panelWrap ? panelWrap.dataset.panelId : 'default';
    if (!watchPositionObjects[formId]) {
        watchPositionObjects[formId] = {};
    }
    if (!watchPositionObjects[formId][panelId]) {
        watchPositionObjects[formId][panelId] = {};
    }
    watchPositionObjects[formId][panelId][watchPositionIndex] = {
        'el': el,
        'rect': el.getBoundingClientRect(),
        'handler': cb
    };
    el.dataset.cgPoindex = watchPositionIndex.toString();
    ++watchPositionIndex;
    return true;
}
function unwatchPosition(el) {
    const index = el.dataset.cgPoindex;
    if (index === undefined) {
        return;
    }
    const formWrap = findParentByData(el, 'form-id');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId;
    const panelWrap = findParentByData(el, 'panel-id');
    const panelId = panelWrap ? panelWrap.dataset.panelId : 'default';
    el.removeAttribute('data-cg-poindex');
    delete watchPositionObjects[formId][panelId][index];
    if (Object.keys(watchPositionObjects[formId][panelId]).length) {
        return;
    }
    delete watchPositionObjects[formId][panelId];
    if (Object.keys(watchPositionObjects[formId]).length) {
        return;
    }
    delete watchPositionObjects[formId];
}
function isWatchPosition(el) {
    return el.dataset.cgPoindex ? true : false;
}
function clearWatchPosition(formId, panelId) {
    if (!watchPositionObjects[formId]) {
        return;
    }
    for (const panel in watchPositionObjects[formId]) {
        if (panelId) {
            if (panel !== panelId.toString()) {
                continue;
            }
        }
        for (const index in watchPositionObjects[formId][panel]) {
            const item = watchPositionObjects[formId][panel][index];
            item.el.removeAttribute('data-cg-poindex');
        }
        delete watchPositionObjects[formId][panel];
    }
    if (Object.keys(watchPositionObjects[formId]).length) {
        return;
    }
    delete watchPositionObjects[formId];
}
const watchSizeList = {};
function getWatchSizeCount(taskId) {
    if (!taskId) {
        return Object.keys(watchSizeList).length;
    }
    let count = 0;
    for (const id in watchSizeList) {
        if (watchSizeList[id].taskId !== taskId) {
            continue;
        }
        ++count;
    }
    return count;
}
let watchSizeIndex = 0;
const resizeObserver = new ResizeObserver(function (entries) {
    for (const entrie of entries) {
        const el = entrie.target;
        if (!document.body.contains(el)) {
            resizeObserver.unobserve(el);
            if (watchSizeList[el.dataset.cgRoindex]) {
                delete watchSizeList[el.dataset.cgRoindex];
            }
            continue;
        }
        const item = watchSizeList[el.dataset.cgRoindex];
        try {
            const r = item.handler();
            if (r instanceof Promise) {
                r.catch(function (e) {
                    console.log('ResizeObserver', e);
                });
            }
        }
        catch (e) {
            console.log('ResizeObserver', e);
        }
    }
});
function watchSize(el, cb, immediate = false, taskId) {
    if (isWatchSize(el)) {
        return false;
    }
    if (immediate) {
        try {
            const r = cb();
            if (r instanceof Promise) {
                r.catch(function (e) {
                    console.log('dom.watchSize', e);
                });
            }
        }
        catch (e) {
            console.log('dom.watchSize', e);
        }
    }
    resizeObserver.observe(el);
    watchSizeList[watchSizeIndex] = {
        'el': el,
        'handler': cb,
        'taskId': taskId
    };
    el.dataset.cgRoindex = watchSizeIndex.toString();
    ++watchSizeIndex;
    return true;
}
function unwatchSize(el, taskId) {
    const index = el.dataset.cgRoindex;
    if (index === undefined) {
        return;
    }
    const item = watchSizeList[index];
    if (taskId && item.taskId !== taskId) {
        return;
    }
    resizeObserver.unobserve(el);
    el.removeAttribute('data-cg-roindex');
    delete watchSizeList[index];
}
function isWatchSize(el) {
    return el.dataset.cgRoindex ? true : false;
}
function clearWatchSize(taskId) {
    for (const index in watchSizeList) {
        const item = watchSizeList[index];
        if (taskId !== item.taskId) {
            continue;
        }
        resizeObserver.unobserve(item.el);
        item.el.removeAttribute('data-cg-roindex');
        delete watchSizeList[index];
    }
}
const watchList = {};
function getWatchCount(taskId) {
    if (!taskId) {
        return Object.keys(watchList).length;
    }
    let count = 0;
    for (const id in watchList) {
        if (watchList[id].taskId !== taskId) {
            continue;
        }
        ++count;
    }
    return count;
}
let watchIndex = 0;
function watch(el, cb, mode = 'default', immediate = false, taskId) {
    if (isWatch(el)) {
        return false;
    }
    if (immediate) {
        try {
            const r = cb([]);
            if (r instanceof Promise) {
                r.catch(function (e) {
                    console.log('dom.watch', e);
                });
            }
        }
        catch (e) {
            console.log('dom.watch', e);
        }
    }
    const index = watchIndex;
    let moi;
    switch (mode) {
        case 'child': {
            moi = {
                'childList': true
            };
            break;
        }
        case 'childsub': {
            moi = {
                'childList': true,
                'subtree': true
            };
            break;
        }
        case 'style': {
            moi = {
                'attributeFilter': ['style', 'class'],
                'attributeOldValue': true,
                'attributes': true
            };
            break;
        }
        case 'text': {
            moi = {
                'characterData': true,
                'childList': true,
                'subtree': true
            };
            break;
        }
        default: {
            moi = {
                'attributeFilter': ['style', 'class'],
                'attributeOldValue': true,
                'attributes': true,
                'characterData': true,
                'childList': true,
                'subtree': true
            };
        }
    }
    const mo = new MutationObserver((mutations) => {
        if (!document.body.contains(el)) {
            mo.disconnect();
            if (watchList[index]) {
                delete watchList[index];
            }
            return;
        }
        try {
            const r = cb(mutations);
            if (r instanceof Promise) {
                r.catch(function (e) {
                    console.log('dom.watch', e);
                });
            }
        }
        catch (e) {
            console.log('dom.watch', e);
        }
    });
    mo.observe(el, moi);
    watchList[index] = {
        'el': el,
        'mo': mo,
        'taskId': taskId
    };
    el.dataset.cgMoindex = index.toString();
    ++watchIndex;
    return true;
}
function unwatch(el, taskId) {
    const index = el.dataset.cgMoindex;
    if (index === undefined) {
        return;
    }
    const item = watchList[index];
    if (taskId && item.taskId !== taskId) {
        return;
    }
    el.removeAttribute('data-cg-moindex');
    watchList[index].mo.disconnect();
    delete watchList[index];
}
function isWatch(el) {
    return el.dataset.cgMoindex ? true : false;
}
function clearWatch(taskId) {
    for (const index in watchList) {
        const item = watchList[index];
        if (taskId !== item.taskId) {
            continue;
        }
        item.el.removeAttribute('data-cg-moindex');
        item.mo.disconnect();
        delete watchList[index];
    }
}
const watchCgTimerHandler = function () {
    for (const index in watchSizeList) {
        const item = watchSizeList[index];
        if (document.body.contains(item.el)) {
            continue;
        }
        delete watchSizeList[index];
    }
    for (const index in watchList) {
        const item = watchList[index];
        if (document.body.contains(item.el)) {
            continue;
        }
        delete watchList[index];
    }
    window.setTimeout(watchCgTimerHandler, 1000 * 60 * 7);
};
watchCgTimerHandler();
const watchStyleList = {};
let watchStyleIndex = 0;
function watchStyle(el, name, cb, immediate = false) {
    if (typeof name === 'string') {
        name = [name];
    }
    const formWrap = findParentByData(el, 'form-id');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId;
    const panelWrap = findParentByData(el, 'panel-id');
    const panelId = panelWrap ? panelWrap.dataset.panelId : 'default';
    const index = el.dataset.cgStyleindex;
    if (index) {
        const item = watchStyleList[formId][panelId][index];
        for (const n of name) {
            if (!item.names[n]) {
                item.names[n] = {
                    'val': item.sd[n],
                    'cb': [cb]
                };
            }
            else {
                item.names[n].cb.push(cb);
            }
            if (immediate) {
                cb(n, item.sd[n], '');
            }
        }
        return;
    }
    if (!watchStyleList[formId]) {
        watchStyleList[formId] = {};
    }
    if (!watchStyleList[formId][panelId]) {
        watchStyleList[formId][panelId] = {};
    }
    const sd = getComputedStyle(el);
    watchStyleList[formId][panelId][watchStyleIndex] = {
        'el': el,
        'sd': sd,
        'names': {}
    };
    const item = watchStyleList[formId][panelId][watchStyleIndex];
    for (const n of name) {
        item.names[n] = {
            'val': item.sd[n],
            'cb': [cb]
        };
        if (immediate) {
            cb(n, item.sd[n], '');
        }
    }
    el.dataset.cgStyleindex = watchStyleIndex.toString();
    ++watchStyleIndex;
}
function isWatchStyle(el) {
    return el.dataset.cgStyleindex ? true : false;
}
function clearWatchStyle(formId, panelId) {
    if (!watchStyleList[formId]) {
        return;
    }
    for (const panel in watchStyleList[formId]) {
        if (panelId) {
            if (panel !== panelId.toString()) {
                continue;
            }
        }
        for (const index in watchStyleList[formId][panel]) {
            const item = watchStyleList[formId][panel][index];
            item.el.removeAttribute('data-cg-styleindex');
        }
        delete watchStyleList[formId][panel];
    }
    if (Object.keys(watchStyleList[formId]).length) {
        return;
    }
    delete watchStyleList[formId];
}
const watchPropertyObjects = {};
let watchPropertyIndex = 0;
function watchProperty(el, name, cb, immediate = false) {
    if (typeof name === 'string') {
        name = [name];
    }
    const formWrap = findParentByData(el, 'form-id');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId;
    const panelWrap = findParentByData(el, 'panel-id');
    const panelId = panelWrap ? panelWrap.dataset.panelId : 'default';
    const index = el.dataset.cgPropertyindex;
    if (index) {
        const item = watchPropertyObjects[formId][panelId][index];
        for (const n of name) {
            if (!item.names[n]) {
                item.names[n] = {
                    'val': item.el[n],
                    'cb': [cb]
                };
            }
            else {
                item.names[n].cb.push(cb);
            }
            if (immediate) {
                cb(n, item.el[n]);
            }
        }
        return;
    }
    if (!watchPropertyObjects[formId]) {
        watchPropertyObjects[formId] = {};
    }
    if (!watchPropertyObjects[formId][panelId]) {
        watchPropertyObjects[formId][panelId] = {};
    }
    watchPropertyObjects[formId][panelId][watchPropertyIndex] = {
        'el': el,
        'names': {}
    };
    const item = watchPropertyObjects[formId][panelId][watchPropertyIndex];
    for (const n of name) {
        item.names[n] = {
            'val': item.el[n],
            'cb': [cb]
        };
        if (immediate) {
            cb(n, item.el[n]);
        }
    }
    el.dataset.cgPropertyindex = watchPropertyIndex.toString();
    ++watchPropertyIndex;
}
function isWatchProperty(el) {
    return el.dataset.cgPropertyindex ? true : false;
}
function clearWatchProperty(formId, panelId) {
    if (!watchPropertyObjects[formId]) {
        return;
    }
    for (const panel in watchPropertyObjects[formId]) {
        if (panelId) {
            if (panel !== panelId.toString()) {
                continue;
            }
        }
        for (const index in watchPropertyObjects[formId][panel]) {
            const item = watchPropertyObjects[formId][panel][index];
            item.el.removeAttribute('data-cg-propertyindex');
        }
        delete watchPropertyObjects[formId][panel];
    }
    if (Object.keys(watchPropertyObjects[formId]).length) {
        return;
    }
    delete watchPropertyObjects[formId];
}
function getWatchInfo() {
    var _a, _b;
    const rtn = {
        'formId': 0,
        'default': {},
        'panels': {}
    };
    const formId = form.getFocus();
    if (!formId) {
        return rtn;
    }
    rtn.formId = formId;
    const panelIds = form.getActivePanel(formId);
    const handler = (item, type, panelId) => {
        var _a, _b, _c;
        if (panelId) {
            if (!rtn.panels[panelId]) {
                rtn.panels[panelId] = {};
            }
        }
        const ritem = panelId ? rtn.panels[panelId] : rtn.default;
        const cname = (_c = (_a = item.el.dataset.cgControl) !== null && _a !== void 0 ? _a : (_b = findParentByData(item.el, 'cg-control')) === null || _b === void 0 ? void 0 : _b.dataset.cgControl) !== null && _c !== void 0 ? _c : 'unknown';
        if (!ritem[cname]) {
            ritem[cname] = {
                'style': {
                    'count': 0,
                    'list': []
                },
                'property': {
                    'count': 0,
                    'list': []
                },
                'position': {
                    'count': 0
                }
            };
        }
        ++ritem[cname][type].count;
        if (item.names && type !== 'position') {
            for (const name in item.names) {
                if (ritem[cname][type].list.includes(name)) {
                    continue;
                }
                ritem[cname][type].list.push(name);
            }
        }
    };
    if (watchStyleList[formId]) {
        if (watchStyleList[formId].default) {
            for (const index in watchStyleList[formId].default) {
                handler(watchStyleList[formId].default[index], 'style');
            }
        }
        for (const id of panelIds) {
            if (watchStyleList[formId][id]) {
                for (const index in watchStyleList[formId][id]) {
                    handler(watchStyleList[formId][id][index], 'style', id.toString());
                }
            }
        }
    }
    if (watchPropertyObjects[formId]) {
        if (watchPropertyObjects[formId].default) {
            for (const index in watchPropertyObjects[formId].default) {
                handler(watchPropertyObjects[formId].default[index], 'property');
            }
        }
        for (const id of panelIds) {
            if ((_a = watchPropertyObjects[formId]) === null || _a === void 0 ? void 0 : _a[id]) {
                for (const index in watchPropertyObjects[formId][id]) {
                    handler(watchPropertyObjects[formId][id][index], 'property', id.toString());
                }
            }
        }
    }
    if (watchPositionObjects[formId]) {
        if (watchPositionObjects[formId].default) {
            for (const index in watchPositionObjects[formId].default) {
                handler(watchPositionObjects[formId].default[index], 'position');
            }
        }
        for (const id of panelIds) {
            if ((_b = watchPositionObjects[formId]) === null || _b === void 0 ? void 0 : _b[id]) {
                for (const index in watchPositionObjects[formId][id]) {
                    handler(watchPositionObjects[formId][id][index], 'position', id.toString());
                }
            }
        }
    }
    return rtn;
}
let watchTimer = 0;
const watchTimerHandler = function () {
    if (form.getFocus) {
        const formId = form.getFocus();
        if (formId) {
            const panelIds = form.getActivePanel(formId);
            if (watchStyleList[formId]) {
                const handler = (item, panelId, index) => {
                    if (!document.body.contains(item.el)) {
                        delete watchStyleList[formId][panelId][index];
                        if (!Object.keys(watchStyleList[formId][panelId]).length) {
                            delete watchStyleList[formId][panelId];
                        }
                        if (!Object.keys(watchStyleList[formId]).length) {
                            delete watchStyleList[formId];
                        }
                        return;
                    }
                    for (const name in item.names) {
                        if (item.sd[name] === item.names[name].val) {
                            continue;
                        }
                        const old = item.names[name].val;
                        item.names[name].val = item.sd[name];
                        for (const cb of item.names[name].cb) {
                            cb(name, item.sd[name], old);
                        }
                    }
                };
                if (watchStyleList[formId].default) {
                    for (const index in watchStyleList[formId].default) {
                        handler(watchStyleList[formId].default[index], 'default', index);
                    }
                }
                for (const id of panelIds) {
                    if (watchStyleList[formId][id]) {
                        for (const index in watchStyleList[formId][id]) {
                            handler(watchStyleList[formId][id][index], id.toString(), index);
                        }
                    }
                }
            }
            if (watchPropertyObjects[formId]) {
                const handler = (item, panelId, index) => {
                    if (!document.body.contains(item.el)) {
                        delete watchPropertyObjects[formId][panelId][index];
                        if (!Object.keys(watchPropertyObjects[formId][panelId]).length) {
                            delete watchPropertyObjects[formId][panelId];
                        }
                        if (!Object.keys(watchPropertyObjects[formId]).length) {
                            delete watchPropertyObjects[formId];
                        }
                        return;
                    }
                    for (const name in item.names) {
                        if (item.el[name] === item.names[name].val) {
                            continue;
                        }
                        item.names[name].val = item.el[name];
                        for (const cb of item.names[name].cb) {
                            cb(name, item.el[name]);
                        }
                    }
                };
                if (watchPropertyObjects[formId].default) {
                    for (const index in watchPropertyObjects[formId].default) {
                        handler(watchPropertyObjects[formId].default[index], 'default', index);
                    }
                }
                for (const id of panelIds) {
                    if (watchPropertyObjects[formId][id]) {
                        for (const index in watchPropertyObjects[formId][id]) {
                            handler(watchPropertyObjects[formId][id][index], id.toString(), index);
                        }
                    }
                }
            }
            if (watchPositionObjects[formId]) {
                const handler = (item, panelId, index) => {
                    if (!document.body.contains(item.el)) {
                        delete watchPositionObjects[formId][panelId][index];
                        if (!Object.keys(watchPositionObjects[formId][panelId]).length) {
                            delete watchPositionObjects[formId][panelId];
                        }
                        if (!Object.keys(watchPositionObjects[formId]).length) {
                            delete watchPositionObjects[formId];
                        }
                        return;
                    }
                    const rect = item.el.getBoundingClientRect();
                    let position = false;
                    let size = false;
                    if (item.rect.left !== rect.left || item.rect.top !== rect.top) {
                        position = true;
                    }
                    if (item.rect.width !== rect.width || item.rect.height !== rect.height) {
                        size = true;
                    }
                    if (position || size) {
                        item.handler({
                            'position': position,
                            'size': size
                        });
                    }
                    watchPositionObjects[formId][panelId][index].rect = rect;
                };
                if (watchPositionObjects[formId].default) {
                    for (const index in watchPositionObjects[formId].default) {
                        handler(watchPositionObjects[formId].default[index], 'default', index);
                    }
                }
                for (const id of panelIds) {
                    if (watchPositionObjects[formId][id]) {
                        for (const index in watchPositionObjects[formId][id]) {
                            handler(watchPositionObjects[formId][id][index], id.toString(), index);
                        }
                    }
                }
            }
        }
    }
    watchTimer = requestAnimationFrame(watchTimerHandler);
};
watchTimerHandler();
function bindClick(e, handler) {
    if ((e instanceof MouseEvent) && (e.button > 0)) {
        return;
    }
    const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    const time = Date.now();
    bindDown(e, {
        up: (ne) => {
            if (Date.now() - time >= 250) {
                return;
            }
            const nx = ne instanceof MouseEvent ? ne.clientX : ne.changedTouches[0].clientX;
            const ny = ne instanceof MouseEvent ? ne.clientY : ne.changedTouches[0].clientY;
            if (nx === x && ny === y) {
                handler(ne, nx, ny);
            }
        }
    });
}
const lastDblClickData = {
    'time': 0,
    'x': 0,
    'y': 0
};
function bindDblClick(e, handler) {
    bindClick(e, (ne, x, y) => {
        const now = Date.now();
        if (now - lastDblClickData.time <= 300) {
            const xx = Math.abs(x - lastDblClickData.x);
            const xy = Math.abs(y - lastDblClickData.y);
            if (xx < 10 && xy < 10) {
                handler(ne, x, y);
                lastDblClickData.time = 0;
                lastDblClickData.x = 0;
                lastDblClickData.y = 0;
                return;
            }
        }
        lastDblClickData.time = now;
        lastDblClickData.x = x;
        lastDblClickData.y = y;
    });
}
function bindDown(oe, opt) {
    var _a;
    if (hasTouchButMouse(oe)) {
        return;
    }
    let ox, oy;
    if (oe instanceof MouseEvent) {
        ox = oe.clientX;
        oy = oe.clientY;
    }
    else {
        ox = oe.touches[0].clientX;
        oy = oe.touches[0].clientY;
    }
    let isStart = false;
    let end = undefined;
    const move = function (e) {
        if (!e.target || !document.body.contains(e.target) && e.cancelable) {
            e.preventDefault();
        }
        let dir = 'top';
        const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        if (x === ox && y === oy) {
            return;
        }
        const xx = x - ox;
        const xy = y - oy;
        if (Math.abs(xy) > Math.abs(xx)) {
            if (xy < 0) {
                dir = 'top';
            }
            else {
                dir = 'bottom';
            }
        }
        else {
            if (xx < 0) {
                dir = 'left';
            }
            else {
                dir = 'right';
            }
        }
        ox = x;
        oy = y;
        if (!isStart) {
            isStart = true;
            if (opt.start && (opt.start(e) === false)) {
                if (e instanceof MouseEvent) {
                    window.removeEventListener('mousemove', move);
                    window.removeEventListener('mouseup', end);
                }
                else {
                    oe.target.removeEventListener('touchmove', move);
                    oe.target.removeEventListener('touchend', end);
                    oe.target.removeEventListener('touchcancel', end);
                }
                return;
            }
        }
        if (opt.move && (opt.move(e, dir) === false)) {
            if (e instanceof MouseEvent) {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', end);
            }
            else {
                if (oe.target) {
                    oe.target.removeEventListener('touchmove', move);
                    oe.target.removeEventListener('touchend', end);
                    oe.target.removeEventListener('touchcancel', end);
                }
            }
            return;
        }
    };
    end = function (e) {
        var _a, _b;
        if (e instanceof MouseEvent) {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', end);
        }
        else {
            if (oe.target) {
                oe.target.removeEventListener('touchmove', move);
                oe.target.removeEventListener('touchend', end);
                oe.target.removeEventListener('touchcancel', end);
            }
        }
        (_a = opt.up) === null || _a === void 0 ? void 0 : _a.call(opt, e);
        if (isStart) {
            (_b = opt.end) === null || _b === void 0 ? void 0 : _b.call(opt, e);
        }
    };
    if (oe instanceof MouseEvent) {
        window.addEventListener('mousemove', move, {
            'passive': false
        });
        window.addEventListener('mouseup', end);
    }
    else {
        oe.target.addEventListener('touchmove', move, {
            'passive': false
        });
        oe.target.addEventListener('touchend', end);
        oe.target.addEventListener('touchcancel', end);
    }
    (_a = opt.down) === null || _a === void 0 ? void 0 : _a.call(opt, oe);
}
function bindScale(oe, handler) {
    var _a, _b, _c, _d;
    const el = oe.currentTarget;
    if (!el) {
        return;
    }
    if (oe instanceof TouchEvent) {
        if (oe.type === 'touchend') {
            if (oe.touches.length) {
                return;
            }
            el.removeAttribute('data-cg-scale');
            return;
        }
        const ex = [oe.touches[0].clientX, (_b = (_a = oe.touches[1]) === null || _a === void 0 ? void 0 : _a.clientX) !== null && _b !== void 0 ? _b : -1000];
        const ey = [oe.touches[0].clientY, (_d = (_c = oe.touches[1]) === null || _c === void 0 ? void 0 : _c.clientY) !== null && _d !== void 0 ? _d : -1000];
        let ndis = 0;
        const epos = {
            'x': ex[0],
            'y': ey[0]
        };
        if (ex[1] !== -1000) {
            const nx = ex[0] - ex[1];
            const ny = ey[0] - ey[1];
            ndis = Math.hypot(nx, ny);
            const cnx = (ex[0] + ex[1]) / 2;
            const cny = (ey[0] + ey[1]) / 2;
            epos['x'] = cnx;
            epos['y'] = cny;
        }
        if (el.dataset.cgScale === undefined) {
            el.dataset.cgScale = JSON.stringify({
                'dis': ndis,
                'x': ex,
                'y': ey,
                'pos': epos
            });
            return;
        }
        const d = JSON.parse(el.dataset.cgScale);
        let notchange = false;
        if (ex[1] !== -1000) {
            if (d.x[1] === -1000) {
                notchange = true;
            }
        }
        else {
            if (d.x[1] !== -1000) {
                notchange = true;
            }
        }
        const scale = ndis > 0 && d.dis > 0 ? ndis / d.dis : 1;
        handler(oe, scale, {
            'x': notchange ? 0 : epos['x'] - d.pos['x'],
            'y': notchange ? 0 : epos['y'] - d.pos['y']
        });
        el.dataset.cgScale = JSON.stringify({
            'dis': ndis,
            'x': ex,
            'y': ey,
            'pos': epos
        });
        return;
    }
    if (oe instanceof WheelEvent) {
        if (!oe.deltaY) {
            return;
        }
        const delta = Math.abs(oe.deltaY);
        const zoomFactor = delta * (delta > 50 ? 0.0015 : 0.003);
        handler(oe, oe.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor, {
            'x': 0,
            'y': 0
        });
        return;
    }
    bindMove(oe, {
        'move': (e, opt) => {
            handler(oe, 1, {
                'x': opt.ox,
                'y': opt.oy
            });
        }
    });
}
const gestureWheel = {
    'last': 0,
    'offset': 0,
    'done': false,
    'timer': 0,
    'firstTimer': false,
    'dir': ''
};
function bindGesture(oe, before, handler) {
    const el = oe.currentTarget;
    if (!el) {
        return;
    }
    const rect = el.getBoundingClientRect();
    if ((oe instanceof MouseEvent || oe instanceof TouchEvent) && !(oe instanceof WheelEvent)) {
        let offset = 0;
        let origin = 0;
        let first = 1;
        let dir = 'top';
        bindDown(oe, {
            move: (e, d) => {
                if (first < 0) {
                    if (first > -30) {
                        const rtn = before(e, dir);
                        if (rtn === 1) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        else if (rtn === -1) {
                            e.stopPropagation();
                        }
                        --first;
                    }
                    return;
                }
                if (first === 1) {
                    first = 0;
                    switch (d) {
                        case 'top': {
                            dir = 'bottom';
                            break;
                        }
                        case 'bottom': {
                            dir = 'top';
                            break;
                        }
                        case 'left': {
                            dir = 'right';
                            break;
                        }
                        default: {
                            dir = 'left';
                        }
                    }
                    const rtn = before(e, dir);
                    if (rtn === 1) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    else {
                        if (rtn === -1) {
                            e.stopPropagation();
                        }
                        first = -1;
                        return;
                    }
                    switch (dir) {
                        case 'top':
                        case 'bottom': {
                            origin = oe instanceof MouseEvent ? oe.clientY : oe.touches[0].clientY;
                            break;
                        }
                        default: {
                            origin = oe instanceof MouseEvent ? oe.clientX : oe.touches[0].clientX;
                        }
                    }
                }
                let pos = 0;
                switch (dir) {
                    case 'top':
                    case 'bottom': {
                        pos = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
                        if (dir === 'top') {
                            offset = pos - origin;
                        }
                        else {
                            offset = origin - pos;
                        }
                        break;
                    }
                    default: {
                        pos = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
                        if (dir === 'left') {
                            offset = pos - origin;
                        }
                        else {
                            offset = origin - pos;
                        }
                    }
                }
                if (offset >= 90) {
                    offset = 90;
                    form.elements.gesture.style.opacity = '1';
                    form.elements.gesture.classList.add('done');
                }
                else {
                    form.elements.gesture.classList.remove('done');
                    if (offset < 0) {
                        offset = 0;
                        form.elements.gesture.style.opacity = '0';
                    }
                    else {
                        form.elements.gesture.style.opacity = '1';
                    }
                }
                form.elements.gesture.style.transform = 'scale(' + (offset / 90).toString() + ')';
                switch (dir) {
                    case 'top':
                    case 'bottom': {
                        form.elements.gesture.style.left = (rect.left + ((rect.width - 20) / 2)).toString() + 'px';
                        if (dir === 'top') {
                            form.elements.gesture.style.top = (rect.top + (offset / 1.5)).toString() + 'px';
                        }
                        else {
                            form.elements.gesture.style.top = (rect.bottom - 20 - (offset / 1.5)).toString() + 'px';
                        }
                        break;
                    }
                    default: {
                        form.elements.gesture.style.top = (rect.top + ((rect.height - 20) / 2)).toString() + 'px';
                        if (dir === 'left') {
                            form.elements.gesture.style.left = (rect.left + (offset / 1.5)).toString() + 'px';
                        }
                        else {
                            form.elements.gesture.style.left = (rect.right - 20 - (offset / 1.5)).toString() + 'px';
                        }
                    }
                }
            },
            end: () => {
                form.elements.gesture.style.opacity = '0';
                if (offset < 90) {
                    return;
                }
                handler === null || handler === void 0 ? void 0 : handler(dir);
            }
        });
    }
    else {
        (() => __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            if (now - gestureWheel.last > 250) {
                gestureWheel.offset = 0;
                gestureWheel.done = false;
                gestureWheel.timer = 0;
                gestureWheel.firstTimer = false;
                gestureWheel.dir = '';
            }
            gestureWheel.last = now;
            if (gestureWheel.firstTimer) {
                return;
            }
            if (gestureWheel.done) {
                return;
            }
            let deltaY = oe.deltaY;
            let deltaX = oe.deltaX;
            if (clickgo.dom.is.shift) {
                deltaY = oe.deltaX;
                deltaX = oe.deltaY;
            }
            if (gestureWheel.dir === '') {
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    if (deltaY < 0) {
                        gestureWheel.dir = 'top';
                    }
                    else {
                        gestureWheel.dir = 'bottom';
                    }
                }
                else {
                    if (deltaX < 0) {
                        gestureWheel.dir = 'left';
                    }
                    else {
                        gestureWheel.dir = 'right';
                    }
                }
                const rtn = before(oe, gestureWheel.dir);
                if (rtn === 1) {
                    oe.stopPropagation();
                    oe.preventDefault();
                }
                else {
                    if (rtn === -1) {
                        oe.stopPropagation();
                        gestureWheel.done = true;
                    }
                    else {
                        gestureWheel.dir = '';
                    }
                    return;
                }
                form.elements.gesture.style.transform = 'scale(0)';
                switch (gestureWheel.dir) {
                    case 'top':
                    case 'bottom': {
                        form.elements.gesture.style.left = (rect.left + ((rect.width - 20) / 2)).toString() + 'px';
                        if (gestureWheel.dir === 'top') {
                            form.elements.gesture.style.top = (rect.top + 10).toString() + 'px';
                        }
                        else {
                            form.elements.gesture.style.top = (rect.bottom - 10).toString() + 'px';
                        }
                        break;
                    }
                    default: {
                        form.elements.gesture.style.top = (rect.top + ((rect.height - 20) / 2)).toString() + 'px';
                        if (gestureWheel.dir === 'left') {
                            form.elements.gesture.style.left = (rect.left + 10).toString() + 'px';
                        }
                        else {
                            form.elements.gesture.style.left = (rect.right - 10).toString() + 'px';
                        }
                    }
                }
                gestureWheel.firstTimer = true;
                yield tool.sleep(30);
                gestureWheel.firstTimer = false;
                form.elements.gesture.classList.add('ani');
            }
            switch (gestureWheel.dir) {
                case 'top':
                case 'bottom': {
                    gestureWheel.offset += (gestureWheel.dir === 'top') ? -deltaY : deltaY;
                    break;
                }
                default: {
                    gestureWheel.offset += (gestureWheel.dir === 'left') ? -deltaX : deltaX;
                }
            }
            if (gestureWheel.offset < 0) {
                gestureWheel.offset = 0;
                form.elements.gesture.style.opacity = '0';
                return;
            }
            form.elements.gesture.style.opacity = '1';
            let offset = gestureWheel.offset / 1.38;
            if (offset > 90) {
                offset = 90;
                form.elements.gesture.classList.add('done');
            }
            else {
                form.elements.gesture.classList.remove('done');
            }
            form.elements.gesture.style.transform = 'scale(' + (offset / 90).toString() + ')';
            switch (gestureWheel.dir) {
                case 'top': {
                    form.elements.gesture.style.top = (rect.top + (offset / 1.5)).toString() + 'px';
                    break;
                }
                case 'bottom': {
                    form.elements.gesture.style.top = (rect.bottom - 20 - (offset / 1.5)).toString() + 'px';
                    break;
                }
                case 'left': {
                    form.elements.gesture.style.left = (rect.left + (offset / 1.5)).toString() + 'px';
                    break;
                }
                default: {
                    form.elements.gesture.style.left = (rect.right - 20 - (offset / 1.5)).toString() + 'px';
                }
            }
            clearTimeout(gestureWheel.timer);
            if (offset < 90) {
                gestureWheel.timer = window.setTimeout(() => {
                    form.elements.gesture.style.opacity = '0';
                    form.elements.gesture.classList.remove('ani');
                }, 250);
                return;
            }
            gestureWheel.done = true;
            handler === null || handler === void 0 ? void 0 : handler(gestureWheel.dir);
            yield tool.sleep(500);
            form.elements.gesture.style.opacity = '0';
            form.elements.gesture.classList.remove('ani');
        }))().catch((e) => {
            console.log('error', 'dom.bindGesture', e);
        });
    }
}
let lastLongTime = 0;
function allowEvent(e) {
    const now = Date.now();
    if (now - lastLongTime < 5) {
        return false;
    }
    const current = e.currentTarget;
    if (current.dataset.cgDisabled !== undefined) {
        return false;
    }
    if (findParentByData(current, 'cg-disabled')) {
        return false;
    }
    return true;
}
function bindLong(e, long) {
    if (hasTouchButMouse(e)) {
        return;
    }
    const tx = (e instanceof MouseEvent || e.type === 'mousedown') ? e.clientX : e.touches[0].clientX;
    const ty = (e instanceof MouseEvent || e.type === 'mousedown') ? e.clientY : e.touches[0].clientY;
    let ox = 0;
    let oy = 0;
    let isLong = false;
    let timer = window.setTimeout(() => {
        clearTimeout(timer);
        timer = undefined;
        if (ox <= 1 && oy <= 1) {
            isLong = true;
            const rtn = long(e);
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
        }
    }, 300);
    bindDown(e, {
        move: (e) => {
            const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            ox = Math.abs(x - tx);
            oy = Math.abs(y - ty);
        },
        up: () => {
            if (timer !== undefined) {
                clearTimeout(timer);
                timer = undefined;
            }
            else if (isLong) {
                lastLongTime = Date.now();
            }
        }
    });
}
let bindDragData = undefined;
function setDragData(data) {
    bindDragData = data;
}
function bindDrag(e, opt) {
    bindDragData = opt.data;
    let otop = 0;
    let oleft = 0;
    let nel = null;
    bindMove(e, {
        'object': opt.el,
        'start': function (x, y) {
            var _a;
            const rect = opt.el.getBoundingClientRect();
            form.showDrag();
            form.moveDrag({
                'top': rect.top,
                'left': rect.left,
                'width': rect.width,
                'height': rect.height,
                'icon': true
            });
            otop = rect.top;
            oleft = rect.left;
            (_a = opt.start) === null || _a === void 0 ? void 0 : _a.call(opt, x, y);
        },
        'move': function (e, o) {
            var _a;
            const ntop = otop + o.oy;
            const nleft = oleft + o.ox;
            form.moveDrag({
                'top': ntop,
                'left': nleft,
                'icon': false
            });
            otop = ntop;
            oleft = nleft;
            const els = document.elementsFromPoint(o.x, o.y);
            for (const el of els) {
                if (el.dataset.cgDrop === undefined) {
                    continue;
                }
                if (el === opt.el) {
                    continue;
                }
                if (el === nel) {
                    return;
                }
                if (nel !== null) {
                    nel.removeAttribute('data-cg-hover');
                    nel.dispatchEvent(new CustomEvent('dragleave', {
                        'detail': {
                            'value': bindDragData
                        }
                    }));
                }
                el.dataset.cgHover = '';
                nel = el;
                nel.dispatchEvent(new CustomEvent('dragenter', {
                    'detail': {
                        'value': bindDragData
                    }
                }));
                return;
            }
            form.moveDrag({
                'icon': true
            });
            if (nel === null) {
                return;
            }
            nel.removeAttribute('data-cg-hover');
            nel.dispatchEvent(new CustomEvent('dragleave', {
                'detail': {
                    'value': bindDragData
                }
            }));
            nel = null;
            (_a = opt.move) === null || _a === void 0 ? void 0 : _a.call(opt, e, o);
        },
        'end': function (moveTimes, e) {
            var _a;
            form.hideDrag();
            if (nel === null) {
                return;
            }
            nel.removeAttribute('data-cg-hover');
            nel.dispatchEvent(new CustomEvent('drop', {
                'detail': {
                    'value': bindDragData
                }
            }));
            (_a = opt.end) === null || _a === void 0 ? void 0 : _a.call(opt, moveTimes, e);
            bindDragData = undefined;
        }
    });
}
exports.is = clickgo.vue.reactive({
    'move': false,
    'shift': false,
    'ctrl': false,
    'meta': false,
    'full': false
});
window.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'Shift': {
            exports.is.shift = true;
            break;
        }
        case 'Control': {
            exports.is.ctrl = true;
            break;
        }
        case 'Meta': {
            exports.is.meta = true;
            break;
        }
    }
});
window.addEventListener('keyup', function (e) {
    switch (e.key) {
        case 'Shift': {
            exports.is.shift = false;
            break;
        }
        case 'Control': {
            exports.is.ctrl = false;
            break;
        }
        case 'Meta': {
            exports.is.meta = false;
            break;
        }
    }
});
function bindMove(e, opt) {
    var _a, _b, _c, _d;
    if (hasTouchButMouse(e)) {
        return {
            'left': 0,
            'top': 0,
            'right': 0,
            'bottom': 0
        };
    }
    exports.is.move = true;
    setGlobalCursor(opt.cursor ? opt.cursor : getComputedStyle(e.target).cursor);
    let tx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    let ty = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    let left, top, right, bottom;
    if (opt.areaObject) {
        if (!(opt.areaObject instanceof Element)) {
            opt.areaObject = opt.areaObject.$el;
        }
        const areaRect = opt.areaObject.getBoundingClientRect();
        const areaStyle = getComputedStyle(opt.areaObject);
        left = areaRect.left + parseFloat(areaStyle.borderLeftWidth) + parseFloat(areaStyle.paddingLeft);
        top = areaRect.top + parseFloat(areaStyle.borderTopWidth) + parseFloat(areaStyle.paddingTop);
        right = areaRect.left + areaRect.width - (parseFloat(areaStyle.borderRightWidth)
            + parseFloat(areaStyle.paddingRight));
        bottom = areaRect.top + areaRect.height - (parseFloat(areaStyle.borderRightWidth)
            + parseFloat(areaStyle.paddingRight));
    }
    else {
        const area = core.getAvailArea();
        left = (_a = opt.left) !== null && _a !== void 0 ? _a : area.left;
        top = (_b = opt.top) !== null && _b !== void 0 ? _b : area.top;
        right = (_c = opt.right) !== null && _c !== void 0 ? _c : area.width;
        bottom = (_d = opt.bottom) !== null && _d !== void 0 ? _d : area.height;
    }
    if (opt.offsetLeft) {
        left += opt.offsetLeft;
    }
    if (opt.offsetTop) {
        top += opt.offsetTop;
    }
    if (opt.offsetRight) {
        right += opt.offsetRight;
    }
    if (opt.offsetBottom) {
        bottom += opt.offsetBottom;
    }
    let isBorder = false;
    let objectLeft, objectTop, objectWidth, objectHeight;
    let offsetLeft = 0, offsetTop = 0, offsetRight = 0, offsetBottom = 0;
    const moveTimes = [];
    bindDown(e, {
        start: () => {
            var _a, _b, _c, _d;
            if (opt.start) {
                if (opt.start(tx, ty) === false) {
                    setGlobalCursor();
                    return false;
                }
            }
            if (opt.object) {
                if (!(opt.object instanceof Element)) {
                    opt.object = opt.object.$el;
                }
                const rect = opt.object.getBoundingClientRect();
                objectLeft = rect.left;
                objectTop = rect.top;
                objectWidth = rect.width;
                objectHeight = rect.height;
            }
            else {
                objectLeft = (_a = opt.objectLeft) !== null && _a !== void 0 ? _a : 0;
                objectTop = (_b = opt.objectTop) !== null && _b !== void 0 ? _b : 0;
                objectWidth = (_c = opt.objectWidth) !== null && _c !== void 0 ? _c : 0;
                objectHeight = (_d = opt.objectHeight) !== null && _d !== void 0 ? _d : 0;
            }
            if (objectWidth > 0) {
                offsetLeft = tx - objectLeft;
            }
            if (objectHeight > 0) {
                offsetTop = ty - objectTop;
            }
            offsetRight = objectWidth - offsetLeft;
            offsetBottom = objectHeight - offsetTop;
        },
        move: (e, dir) => {
            var _a, _b, _c;
            let x, y;
            x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            if (x === tx && y === ty) {
                return;
            }
            let inBorderTop = false, inBorderRight = false, inBorderBottom = false, inBorderLeft = false;
            const nowLeft = x - offsetLeft;
            const nowRight = x + offsetRight;
            if (nowLeft <= left) {
                inBorderLeft = true;
                if (nowLeft < left && x < tx) {
                    if (tx - offsetLeft > left) {
                        x = left + offsetLeft;
                    }
                    else {
                        x = tx;
                    }
                }
            }
            else if (offsetRight !== 0) {
                if (nowRight >= right) {
                    inBorderRight = true;
                    if (nowRight > right && x > tx) {
                        if (tx + offsetRight < right) {
                            x = right - offsetRight;
                        }
                        else {
                            x = tx;
                        }
                    }
                }
            }
            else if (offsetRight === 0) {
                const r1 = right - 1;
                if (x >= r1) {
                    inBorderRight = true;
                    if (x > r1 && x > tx) {
                        if (tx < r1) {
                            x = r1;
                        }
                        else {
                            x = tx;
                        }
                    }
                }
            }
            const nowTop = y - offsetTop;
            const nowBottom = y + offsetBottom;
            if (nowTop <= top) {
                inBorderTop = true;
                if (nowTop < top && y < ty) {
                    if (ty - offsetTop > top) {
                        y = top + offsetTop;
                    }
                    else {
                        y = ty;
                    }
                }
            }
            else if (offsetBottom !== 0) {
                if (nowBottom >= bottom) {
                    inBorderBottom = true;
                    if (nowBottom > bottom && y > ty) {
                        if (ty + offsetBottom < bottom) {
                            y = bottom - offsetBottom;
                        }
                        else {
                            y = ty;
                        }
                    }
                }
            }
            else if (offsetBottom === 0) {
                const b1 = bottom - 1;
                if (y >= b1) {
                    inBorderBottom = true;
                    if (y > b1 && y > ty) {
                        if (ty < b1) {
                            y = b1;
                        }
                        else {
                            y = ty;
                        }
                    }
                }
            }
            let border = '';
            if (inBorderTop || inBorderRight || inBorderBottom || inBorderLeft) {
                if (inBorderTop) {
                    if (x - left <= 20) {
                        border = 'lt';
                    }
                    else if (right - x <= 20) {
                        border = 'tr';
                    }
                    else {
                        border = 't';
                    }
                }
                else if (inBorderRight) {
                    if (y - top <= 20) {
                        border = 'tr';
                    }
                    else if (bottom - y <= 20) {
                        border = 'rb';
                    }
                    else {
                        border = 'r';
                    }
                }
                else if (inBorderBottom) {
                    if (right - x <= 20) {
                        border = 'rb';
                    }
                    else if (x - left <= 20) {
                        border = 'bl';
                    }
                    else {
                        border = 'b';
                    }
                }
                else if (inBorderLeft) {
                    if (y - top <= 20) {
                        border = 'lt';
                    }
                    else if (bottom - y <= 20) {
                        border = 'bl';
                    }
                    else {
                        border = 'l';
                    }
                }
                if (!isBorder) {
                    isBorder = true;
                    (_a = opt.borderIn) === null || _a === void 0 ? void 0 : _a.call(opt, x, y, border, e);
                }
            }
            else {
                if (isBorder) {
                    isBorder = false;
                    (_b = opt.borderOut) === null || _b === void 0 ? void 0 : _b.call(opt);
                }
            }
            const ox = x - tx;
            const oy = y - ty;
            moveTimes.push({
                'time': Date.now(),
                'ox': ox,
                'oy': oy
            });
            (_c = opt.move) === null || _c === void 0 ? void 0 : _c.call(opt, e, {
                'ox': ox,
                'oy': oy,
                'x': x,
                'y': y,
                'border': border,
                'inBorder': {
                    'top': inBorderTop,
                    'right': inBorderRight,
                    'bottom': inBorderBottom,
                    'left': inBorderLeft
                },
                'dir': dir
            });
            tx = x;
            ty = y;
        },
        up: (e) => {
            var _a;
            exports.is.move = false;
            setGlobalCursor();
            (_a = opt.up) === null || _a === void 0 ? void 0 : _a.call(opt, moveTimes, e);
        },
        end: (e) => {
            var _a;
            (_a = opt.end) === null || _a === void 0 ? void 0 : _a.call(opt, moveTimes, e);
        }
    });
    if (opt.showRect) {
        form.showRectangle(tx, ty, {
            'left': left,
            'top': top,
            'width': right - left,
            'height': bottom - top
        });
        setTimeout(() => {
            form.hideRectangle();
        }, 3000);
    }
    return {
        'left': left,
        'top': top,
        'right': right,
        'bottom': bottom
    };
}
function bindResize(e, opt) {
    var _a, _b;
    if (hasTouchButMouse(e)) {
        return;
    }
    opt.minWidth = (_a = opt.minWidth) !== null && _a !== void 0 ? _a : 0;
    opt.minHeight = (_b = opt.minHeight) !== null && _b !== void 0 ? _b : 0;
    const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    let offsetLeft, offsetTop, offsetRight, offsetBottom;
    let left, top, right, bottom;
    if (opt.objectLeft === undefined
        || opt.objectTop === undefined
        || opt.objectWidth === undefined
        || opt.objectHeight === undefined) {
        if (!opt.object) {
            return;
        }
        if (!(opt.object instanceof Element)) {
            opt.object = opt.object.$el;
        }
        const objectRect = opt.object.getBoundingClientRect();
        opt.objectLeft = objectRect.left;
        opt.objectTop = objectRect.top;
        opt.objectWidth = objectRect.width;
        opt.objectHeight = objectRect.height;
    }
    if (opt.border === 'tr' || opt.border === 'r' || opt.border === 'rb') {
        left = opt.objectLeft + opt.minWidth;
        offsetLeft = x - (opt.objectLeft + opt.objectWidth);
        offsetRight = offsetLeft;
        if (opt.maxWidth) {
            right = opt.objectLeft + opt.maxWidth;
        }
    }
    else if (opt.border === 'bl' || opt.border === 'l' || opt.border === 'lt') {
        right = opt.objectLeft + opt.objectWidth - opt.minWidth;
        offsetLeft = x - opt.objectLeft;
        offsetRight = offsetLeft;
        if (opt.maxWidth) {
            left = opt.objectLeft + opt.objectWidth - opt.maxWidth;
        }
    }
    if (opt.border === 'rb' || opt.border === 'b' || opt.border === 'bl') {
        top = opt.objectTop + opt.minHeight;
        offsetTop = y - (opt.objectTop + opt.objectHeight);
        offsetBottom = offsetTop;
        if (opt.maxHeight) {
            bottom = opt.objectTop + opt.maxHeight;
        }
    }
    else if (opt.border === 'lt' || opt.border === 't' || opt.border === 'tr') {
        bottom = opt.objectTop + opt.objectHeight - opt.minHeight;
        offsetTop = y - opt.objectTop;
        offsetBottom = offsetTop;
        if (opt.maxHeight) {
            top = opt.objectTop + opt.objectHeight - opt.maxHeight;
        }
    }
    bindMove(e, {
        'left': left,
        'top': top,
        'right': right,
        'bottom': bottom,
        'offsetLeft': offsetLeft,
        'offsetTop': offsetTop,
        'offsetRight': offsetRight,
        'offsetBottom': offsetBottom,
        'start': opt.start,
        'move': function (e, o) {
            var _a;
            if (opt.border === 'tr' || opt.border === 'r' || opt.border === 'rb') {
                opt.objectWidth += o.ox;
            }
            else if (opt.border === 'bl' || opt.border === 'l' || opt.border === 'lt') {
                opt.objectWidth -= o.ox;
                opt.objectLeft += o.ox;
            }
            if (opt.border === 'rb' || opt.border === 'b' || opt.border === 'bl') {
                opt.objectHeight += o.oy;
            }
            else if (opt.border === 'lt' || opt.border === 't' || opt.border === 'tr') {
                opt.objectHeight -= o.oy;
                opt.objectTop += o.oy;
            }
            (_a = opt.move) === null || _a === void 0 ? void 0 : _a.call(opt, opt.objectLeft, opt.objectTop, opt.objectWidth, opt.objectHeight, x, y, o.border);
        },
        'end': opt.end
    });
}
function findParentByData(el, name, value) {
    let parent = el.parentNode;
    while (parent) {
        if (!parent.tagName) {
            continue;
        }
        if (parent.tagName.toLowerCase() === 'body') {
            break;
        }
        const v = parent.getAttribute('data-' + name);
        if (v !== null) {
            if (value) {
                if (value === v) {
                    return parent;
                }
                continue;
            }
            return parent;
        }
        parent = parent.parentNode;
    }
    return null;
}
function findParentByClass(el, name) {
    let parent = el.parentNode;
    while (parent) {
        if (!parent.tagName) {
            continue;
        }
        if (parent.tagName.toLowerCase() === 'body') {
            break;
        }
        if (parent.classList.contains(name)) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return null;
}
function findParentByTag(el, name) {
    let parent = el.parentNode;
    while (parent) {
        if (!parent.tagName) {
            continue;
        }
        const tag = parent.tagName.toLowerCase();
        if (tag === 'body') {
            break;
        }
        if (tag === name) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return null;
}
function index(el) {
    let index = 0;
    let p = el.previousElementSibling;
    while (true) {
        if (!p) {
            break;
        }
        ++index;
        p = p.previousElementSibling;
    }
    return index;
}
function siblings(el) {
    if (!el.parentNode) {
        return [];
    }
    const list = [];
    for (let i = 0; i < el.parentNode.children.length; ++i) {
        const e = el.parentNode.children.item(i);
        if (e === el) {
            continue;
        }
        list.push(e);
    }
    return list;
}
function siblingsData(el, name) {
    const list = siblings(el);
    const olist = [];
    for (const item of list) {
        if (item.getAttribute('data-' + name) === null) {
            continue;
        }
        olist.push(item);
    }
    return olist;
}
function fullscreen() {
    return __awaiter(this, void 0, void 0, function* () {
        const he = document.getElementsByTagName('html')[0];
        if (he.webkitRequestFullscreen) {
            yield he.webkitRequestFullscreen();
            return true;
        }
        else if (he.requestFullscreen) {
            yield he.requestFullscreen();
            return true;
        }
        else {
            return false;
        }
    });
}
function exitFullscreen() {
    return __awaiter(this, void 0, void 0, function* () {
        const d = document;
        if (d.webkitExitFullscreen) {
            yield d.webkitExitFullscreen();
            return true;
        }
        else if (d.exitFullscreen) {
            yield d.exitFullscreen();
            return true;
        }
        else {
            return false;
        }
    });
}
function createElement(tagName) {
    return document.createElement(tagName);
}
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        cancelAnimationFrame(watchTimer);
    }
    else {
        watchTimer = requestAnimationFrame(watchTimerHandler);
    }
});
document.addEventListener('fullscreenchange', function () {
    if (document.webkitFullscreenElement) {
        exports.is.full = true;
        return;
    }
    if (document.fullscreenElement) {
        exports.is.full = true;
        return;
    }
    exports.is.full = false;
});
