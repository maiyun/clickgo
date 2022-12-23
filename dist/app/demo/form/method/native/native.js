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
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.val = 'test';
    }
    getListenerList() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(JSON.stringify(clickgo.native.getListenerList()));
        });
    }
    max() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.native.max();
        });
    }
    min() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.native.min();
        });
    }
    restore() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.native.restore();
        });
    }
    ping() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog((_a = yield clickgo.native.ping(this.val)) !== null && _a !== void 0 ? _a : 'undefined');
        });
    }
    isMax() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog((yield clickgo.native.isMax()) ? 'true' : 'false');
        });
    }
}
exports.default = default_1;