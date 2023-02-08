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
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
    get(isByterun = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const f = yield clickgo.fs.getContent('/clickgo/theme/' + (isByterun ? 'byterun.cgt' : 'familiar.cgt'));
            if (!f) {
                return null;
            }
            if (typeof f === 'string') {
                return null;
            }
            const t = yield clickgo.theme.read(f);
            if (!t) {
                return null;
            }
            return t;
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const n = clickgo.form.notify({
                'title': 'Info',
                'content': 'Theme loading...',
                'type': 'info'
            });
            const t = yield this.get();
            if (!t) {
                clickgo.form.hideNotify(n);
                return;
            }
            clickgo.form.hideNotify(n);
            const r = yield clickgo.theme.load(t);
            yield clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
        });
    }
    remove() {
        clickgo.theme.remove('familiar').catch((e) => { throw e; });
    }
    clear() {
        clickgo.theme.clear().catch((e) => { throw e; });
    }
    setGlobal(isByterun = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const n = clickgo.form.notify({
                'title': 'Info',
                'content': 'Theme loading...',
                'type': 'info'
            });
            const t = yield this.get(isByterun);
            if (!t) {
                clickgo.form.hideNotify(n);
                return;
            }
            clickgo.form.hideNotify(n);
            yield clickgo.theme.setGlobal(t);
            yield clickgo.form.dialog('Done.');
        });
    }
    clearGlobal() {
        clickgo.theme.clearGlobal();
    }
}
exports.default = default_1;
