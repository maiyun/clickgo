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
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
    async get(name) {
        const f = await clickgo.fs.getContent('/clickgo/theme/' + name + '.cgt');
        if (!f) {
            return null;
        }
        if (typeof f === 'string') {
            return null;
        }
        const t = await clickgo.theme.read(f);
        if (!t) {
            return null;
        }
        return t;
    }
    async load() {
        const n = clickgo.form.notify({
            'title': 'Info',
            'content': 'Theme loading...',
            'type': 'info'
        });
        const t = await this.get('blue');
        if (!t) {
            clickgo.form.hideNotify(n);
            return;
        }
        clickgo.form.hideNotify(n);
        const r = await clickgo.theme.load(t);
        await clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
    }
    remove() {
        clickgo.theme.remove('blue').catch((e) => { throw e; });
    }
    clear() {
        clickgo.theme.clear().catch((e) => { throw e; });
    }
    async setGlobal(name) {
        const n = clickgo.form.notify({
            'title': 'Info',
            'content': 'Theme loading...',
            'type': 'info'
        });
        const t = await this.get(name);
        if (!t) {
            clickgo.form.hideNotify(n);
            return;
        }
        clickgo.form.hideNotify(n);
        await clickgo.theme.setGlobal(t);
        await clickgo.form.dialog('Done.');
    }
    clearGlobal() {
        clickgo.theme.clearGlobal();
    }
}
exports.default = default_1;
