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
exports.clear = exports.all = exports.list = exports.remove = exports.set = exports.get = void 0;
const task = __importStar(require("./task"));
const form = __importStar(require("./form"));
const core = __importStar(require("./core"));
const tool = __importStar(require("./tool"));
const localeData = {
    'en': {
        'sure-clear': 'Are you sure you want to clear all temporary storage for the app "?"?'
    },
    'sc': {
        'sure-clear': '确定清除应用“?”的所有临时存储吗？'
    },
    'tc': {
        'sure-clear': '確定清除應用程式「?」的所有臨時儲存嗎？'
    },
    'ja': {
        'sure-clear': 'アプリ「？」の一時的な保存データをすべて削除しますか？'
    },
    'ko': {
        'sure-clear': '"?" 앱의 모든 임시 저장소를 지우시겠습니까?'
    },
    'th': {
        'sure-clear': 'คุณแน่ใจหรือไม่ที่ต้องการล้างพื้นที่จัดเก็บชั่วคราวของแอป "?" ทั้งหมดหรือไม่?'
    },
    'es': {
        'sure-clear': '¿Estás seguro de que quieres borrar todo el almacenamiento temporal de la aplicación "?"?'
    },
    'de': {
        'sure-clear': 'Möchten Sie wirklich alle temporären Speicher für die App "?" löschen?'
    },
    'fr': {
        'sure-clear': 'Êtes-vous sûr de vouloir effacer tous les stockages temporaires de l\'application "?" ?'
    },
    'pt': {
        'sure-clear': 'Tem a certeza de que pretende limpar todo o armazenamento temporário da aplicação "?"?'
    },
    'ru': {
        'sure-clear': 'Вы уверены, что хотите очистить все временные хранилища для приложения "?"?'
    },
    'vi': {
        'sure-clear': 'Bạn có chắc chắn muốn xóa tất cả lưu trữ tạm thời cho ứng dụng "?" không?'
    }
};
const textEncoder = new TextEncoder();
function get(key, taskId) {
    if (!taskId) {
        return null;
    }
    const t = task.list[taskId];
    if (!t) {
        return null;
    }
    const v = localStorage.getItem('clickgo-item-' + t.path + '-' + key);
    if (v === null) {
        return null;
    }
    return JSON.parse(v);
}
exports.get = get;
function set(key, val, taskId) {
    if (!taskId) {
        return false;
    }
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    const v = JSON.stringify(val);
    const vsize = textEncoder.encode(v).length;
    const sizes = localStorage.getItem('clickgo-size-' + t.path);
    if (sizes === null) {
        if (vsize > 1048576) {
            return false;
        }
        localStorage.setItem('clickgo-size-' + t.path, JSON.stringify({
            [key]: vsize
        }));
    }
    else {
        const sizeso = JSON.parse(sizes);
        sizeso[key] = vsize;
        const allsize = Object.values(sizeso).reduce((a, c) => { return a + c; }, 0);
        if (allsize > 1048576) {
            return false;
        }
        localStorage.setItem('clickgo-size-' + t.path, JSON.stringify(sizeso));
    }
    localStorage.setItem('clickgo-item-' + t.path + '-' + key, v);
    return true;
}
exports.set = set;
function remove(key, taskId) {
    if (!taskId) {
        return false;
    }
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    const sizes = localStorage.getItem('clickgo-size-' + t.path);
    if (sizes === null) {
        return true;
    }
    const sizeso = JSON.parse(sizes);
    if (sizeso[key] === undefined) {
        return true;
    }
    delete sizeso[key];
    if (Object.keys(sizeso).length) {
        localStorage.removeItem('clickgo-size-' + t.path);
    }
    else {
        localStorage.setItem('clickgo-size-' + t.path, JSON.stringify(sizeso));
    }
    localStorage.removeItem('clickgo-item-' + t.path + '-' + key);
    return true;
}
exports.remove = remove;
function list(taskId) {
    if (!taskId) {
        return {};
    }
    const t = task.list[taskId];
    if (!t) {
        return {};
    }
    const sizes = localStorage.getItem('clickgo-size-' + t.path);
    if (sizes === null) {
        return {};
    }
    return JSON.parse(sizes);
}
exports.list = list;
function all() {
    const rtn = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!(key === null || key === void 0 ? void 0 : key.startsWith('clickgo-size-'))) {
            continue;
        }
        const sizes = localStorage.getItem(key);
        if (!sizes) {
            continue;
        }
        const sizeso = JSON.parse(sizes);
        const allsize = Object.values(sizeso).reduce((a, c) => { return a + c; }, 0);
        rtn[key.slice(13)] = allsize;
    }
    return rtn;
}
exports.all = all;
function clear(path) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!path) {
            return 0;
        }
        const loc = (_b = (_a = localeData[core.config.locale]) === null || _a === void 0 ? void 0 : _a['sure-clear']) !== null && _b !== void 0 ? _b : localeData['en']['sure-clear'];
        if (!(yield form.superConfirm(loc.replace('?', tool.escapeHTML(path))))) {
            return 0;
        }
        let count = 0;
        localStorage.removeItem('clickgo-size-' + path);
        const pre = 'clickgo-item-' + path + '-';
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!(key === null || key === void 0 ? void 0 : key.startsWith(pre))) {
                continue;
            }
            localStorage.removeItem(key);
            ++count;
        }
        return count;
    });
}
exports.clear = clear;
