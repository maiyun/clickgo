"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cgInnerReceive = exports.cgInnerGetSends = exports.size = exports.restore = exports.min = exports.max = exports.clearListener = exports.off = exports.once = exports.on = exports.send = exports.getListeners = exports.getToken = void 0;
const clickgo = require("../clickgo");
let sendId = 0;
let sendList = [];
const listeners = {};
const token = (Math.random() * 100000000000000 * (100 + Math.round(Math.random() * (999 - 100)))).toString(32);
function getToken() {
    return token;
}
exports.getToken = getToken;
function getListeners() {
    const list = [];
    for (const name in listeners) {
        for (const item of listeners[name]) {
            list.push({
                'id': item.id,
                'name': name,
                'once': item.once,
                'taskId': item.taskId
            });
        }
    }
    return list;
}
exports.getListeners = getListeners;
function send(name, param, handler, taskId) {
    if (!clickgo.getNative()) {
        return 0;
    }
    const id = ++sendId;
    sendList.push({
        'id': id,
        'name': name,
        'param': param
    });
    if (handler) {
        on(name, handler, id, true, taskId);
    }
    return id;
}
exports.send = send;
function on(name, handler, id, once = false, taskId) {
    if (!clickgo.getNative()) {
        return;
    }
    if (!listeners[name]) {
        listeners[name] = [];
    }
    listeners[name].push({
        'id': id !== null && id !== void 0 ? id : 0,
        'once': once,
        'taskId': taskId,
        'handler': handler
    });
}
exports.on = on;
function once(name, handler, id, taskId) {
    on(name, handler, id, true, taskId);
}
exports.once = once;
function off(name, handler, taskId) {
    if (!listeners[name]) {
        return;
    }
    for (let i = 0; i < listeners[name].length; ++i) {
        if (listeners[name][i].handler !== handler) {
            continue;
        }
        if (taskId && (listeners[name][i].taskId !== taskId)) {
            continue;
        }
        listeners[name].splice(i, 1);
        if (listeners[name].length === 0) {
            delete listeners[name];
            break;
        }
        --i;
    }
}
exports.off = off;
function clearListener(taskId) {
    if (!taskId) {
        return;
    }
    for (const name in listeners) {
        for (let i = 0; i < listeners[name].length; ++i) {
            if (listeners[name][i].taskId !== taskId) {
                continue;
            }
            listeners[name].splice(i, 1);
            if (listeners[name].length === 0) {
                delete listeners[name];
                break;
            }
        }
    }
}
exports.clearListener = clearListener;
function max() {
    send('cg-set-state', JSON.stringify({
        'token': token,
        'state': 'max'
    }));
}
exports.max = max;
function min() {
    send('cg-set-state', JSON.stringify({
        'token': token,
        'state': 'min'
    }));
}
exports.min = min;
function restore() {
    send('cg-set-state', JSON.stringify({
        'token': token,
        'state': 'restore'
    }));
}
exports.restore = restore;
function size(width, height) {
    send('cg-set-size', JSON.stringify({
        'token': token,
        'width': width,
        'height': height
    }));
}
exports.size = size;
function cgInnerGetSends() {
    const json = JSON.stringify(sendList);
    sendList = [];
    return json;
}
exports.cgInnerGetSends = cgInnerGetSends;
function cgInnerReceive(id, name, result) {
    if (!listeners[name]) {
        return;
    }
    for (let i = 0; i < listeners[name].length; ++i) {
        const item = listeners[name][i];
        if (item.id > 0) {
            if (item.id !== id) {
                continue;
            }
            const r = item.handler(result);
            if (r instanceof Promise) {
                r.catch(function (e) {
                    console.log(e);
                });
            }
        }
        else {
            const r = item.handler(result);
            if (r instanceof Promise) {
                r.catch(function (e) {
                    console.log(e);
                });
            }
        }
        if (item.once) {
            listeners[name].splice(i, 1);
            --i;
        }
    }
}
exports.cgInnerReceive = cgInnerReceive;
window.clickGoNative = {
    isReady: true,
    cgInnerGetSends: cgInnerGetSends,
    cgInnerReceive: cgInnerReceive
};
