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
exports.isMax = exports.ping = exports.maximizable = exports.size = exports.restore = exports.min = exports.max = exports.invoke = exports.getListenerList = exports.clear = exports.off = exports.once = exports.on = exports.getToken = void 0;
const clickgo = __importStar(require("../clickgo"));
const token = (Math.random() * 100000000000000 * (100 + Math.round(Math.random() * (999 - 100)))).toString(32);
function getToken() {
    return token;
}
exports.getToken = getToken;
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
exports.on = on;
function once(name, handler, formId, taskId) {
    on(name, handler, true, formId, taskId);
}
exports.once = once;
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
exports.off = off;
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
exports.clear = clear;
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
exports.getListenerList = getListenerList;
function invoke(name, ...param) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!clickgo.isNative()) {
            return;
        }
        return window.clickgoNative.invoke(name, ...param);
    });
}
exports.invoke = invoke;
invoke('cg-init', token);
function max() {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-set-state', token, 'max');
    });
}
exports.max = max;
function min() {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-set-state', token, 'min');
    });
}
exports.min = min;
function restore() {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-set-state', token, 'restore');
    });
}
exports.restore = restore;
function size(width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-set-size', token, width, height);
    });
}
exports.size = size;
function maximizable(val) {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-maximizable', token, val);
    });
}
exports.maximizable = maximizable;
function ping(val) {
    return __awaiter(this, void 0, void 0, function* () {
        return invoke('cg-ping', val);
    });
}
exports.ping = ping;
function isMax() {
    return __awaiter(this, void 0, void 0, function* () {
        return invoke('cg-is-max');
    });
}
exports.isMax = isMax;
