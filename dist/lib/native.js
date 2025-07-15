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
function invoke(name, ...param) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!clickgo.isNative()) {
            return;
        }
        return window.clickgoNative.invoke(name, ...param);
    });
}
invoke('cg-init', token);
function quit() {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-quit', token);
    });
}
function size(width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-set-size', token, width, height);
    });
}
function max() {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-set-state', token, 'max');
    });
}
function min() {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-set-state', token, 'min');
    });
}
function restore() {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-set-state', token, 'restore');
    });
}
function activate() {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-activate', token);
    });
}
function close() {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-close', token);
    });
}
function maximizable(val) {
    return __awaiter(this, void 0, void 0, function* () {
        yield invoke('cg-maximizable', token, val);
    });
}
function open(options = {}) {
    return invoke('cg-form-open', token, options);
}
function save(options = {}) {
    return invoke('cg-form-save', token, options);
}
function ping(val) {
    return __awaiter(this, void 0, void 0, function* () {
        return invoke('cg-ping', val);
    });
}
function isMax() {
    return __awaiter(this, void 0, void 0, function* () {
        return invoke('cg-is-max');
    });
}
