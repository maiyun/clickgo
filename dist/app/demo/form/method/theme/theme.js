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
exports.methods = void 0;
const clickgo = require("clickgo");
exports.methods = {
    get: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const f = yield clickgo.fs.getContent('/clickgo/theme/familiar.cgt');
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
    },
    load: function () {
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
    },
    remove: function () {
        clickgo.theme.remove('familiar').catch((e) => { throw e; });
    },
    clear: function () {
        clickgo.theme.clear().catch((e) => { throw e; });
    },
    setGlobal: function () {
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
            yield clickgo.theme.setGlobal(t);
            yield clickgo.form.dialog('Done.');
        });
    },
    clearGlobal: function () {
        clickgo.theme.clearGlobal();
    }
};
