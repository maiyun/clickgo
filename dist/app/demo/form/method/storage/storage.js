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
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.key = 'test';
        this.val = 'val';
        this.list = [];
        this.ppath = '';
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield clickgo.form.dialog((_a = clickgo.storage.get(this.key)) !== null && _a !== void 0 ? _a : 'null');
        });
    }
    set() {
        return __awaiter(this, void 0, void 0, function* () {
            clickgo.storage.set(this.key, this.val);
            yield clickgo.form.dialog('done');
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(clickgo.storage.remove(this.key) ? 'true' : 'false');
        });
    }
    getlist() {
        this.list.length = 0;
        const obj = clickgo.storage.list();
        for (const key in obj) {
            this.list.push(key + ': ' + obj[key].toString() + ' Bytes');
        }
    }
    all() {
        this.list.length = 0;
        this.ppath = '';
        const obj = clickgo.storage.all();
        for (const key in obj) {
            if (!this.ppath) {
                this.ppath = key;
            }
            this.list.push(key + ': ' + obj[key].toString() + ' Bytes');
        }
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('Removed ' + (yield clickgo.storage.clear(this.ppath)).toString() + ' items.');
        });
    }
}
exports.default = default_1;
