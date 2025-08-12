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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = getToken;
exports.on = on;
exports.once = once;
exports.off = off;
exports.clear = clear;
exports.getListenerList = getListenerList;
exports.invoke = invoke;
exports.quit = quit;
exports.size = size;
exports.max = max;
exports.min = min;
exports.restore = restore;
exports.activate = activate;
exports.close = close;
exports.maximizable = maximizable;
exports.open = open;
exports.save = save;
exports.dialog = dialog;
exports.ping = ping;
exports.isMax = isMax;
const clickgo = __importStar(require("../clickgo"));
const token = (Math.random() * 100000000000000 * (100 + Math.round(Math.random() * (999 - 100)))).toString(32);
function getToken() {
    return token;
}
const methods = {};
window.clickgoNativeWeb = {
    invoke: function (name, ...param) {
        for (const taskId in methods) {
            for (const n in methods[taskId]) {
                if (!n.startsWith(name + '-')) {
                    continue;
                }
                methods[taskId][n].handler(...param);
                if (methods[taskId][n].once) {
                    delete methods[taskId][n];
                    if (!Object.keys(methods[taskId]).length) {
                        delete methods[taskId];
                    }
                }
            }
        }
    }
};
function on(name, handler, once = false, formId, taskId) {
    if (!taskId) {
        return;
    }
    if (!methods[taskId]) {
        methods[taskId] = {};
    }
    methods[taskId][name + '-' + (formId ? formId.toString() : '0')] = {
        'once': once,
        'handler': handler
    };
}
function once(name, handler, formId, taskId) {
    on(name, handler, true, formId, taskId);
}
function off(name, formId, taskId) {
    if (!taskId) {
        return;
    }
    if (!methods[taskId]) {
        return;
    }
    const key = name + '-' + (formId ? formId.toString() : '0');
    if (!methods[taskId][key]) {
        return;
    }
    delete methods[taskId][key];
}
function clear(formId, taskId) {
    if (!taskId) {
        return;
    }
    if (!methods[taskId]) {
        return;
    }
    if (!formId) {
        delete methods[taskId];
        return;
    }
    for (const key in methods[taskId]) {
        if (!key.endsWith('-' + formId.toString())) {
            continue;
        }
        delete methods[taskId][key];
    }
}
function getListenerList(taskId) {
    const rtn = {};
    for (const tid in methods) {
        if (taskId) {
            if (tid !== taskId.toString()) {
                continue;
            }
        }
        rtn[tid] = {};
        for (const key in methods[tid]) {
            const lio = key.lastIndexOf('-');
            const name = key.slice(0, lio);
            const id = key.slice(lio + 1);
            if (!rtn[tid][id]) {
                rtn[tid][id] = {};
            }
            if (rtn[tid][id][name]) {
                ++rtn[tid][id][name];
            }
            else {
                rtn[tid][id][name] = 1;
            }
        }
    }
    return rtn;
}
async function invoke(name, ...param) {
    if (!clickgo.isNative()) {
        return;
    }
    return window.clickgoNative.invoke(name, ...param);
}
invoke('cg-init', token);
async function quit() {
    await invoke('cg-quit', token);
}
async function size(width, height) {
    await invoke('cg-set-size', token, width, height);
}
async function max() {
    await invoke('cg-set-state', token, 'max');
}
async function min() {
    await invoke('cg-set-state', token, 'min');
}
async function restore() {
    await invoke('cg-set-state', token, 'restore');
}
async function activate() {
    await invoke('cg-activate', token);
}
async function close() {
    await invoke('cg-close', token);
}
async function maximizable(val) {
    await invoke('cg-maximizable', token, val);
}
function open(options = {}) {
    return invoke('cg-form-open', token, options);
}
function save(options = {}) {
    return invoke('cg-form-save', token, options);
}
function dialog(options = {}) {
    return invoke('cg-form-dialog', token, options);
}
async function ping(val) {
    return invoke('cg-ping', val);
}
async function isMax() {
    return invoke('cg-is-max');
}
