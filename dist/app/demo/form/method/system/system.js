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
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('Version: ' + clickgo.getVersion());
        });
    }
    isNative() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('Native: ' + (clickgo.isNative() ? 'true' : 'false'));
        });
    }
    getPlatform() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('Platform: ' + clickgo.getPlatform());
        });
    }
    isImmersion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('Immersion: ' + (clickgo.isImmersion() ? 'true' : 'false'));
        });
    }
    hasFrame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('hasFrame: ' + (clickgo.hasFrame() ? 'true' : 'false'));
        });
    }
    unblock() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('typeof sessionStorage: ' + typeof sessionStorage);
        });
    }
    ls() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('typeof localStorage: ' + typeof localStorage);
        });
    }
}
exports.default = default_1;
