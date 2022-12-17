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
class Sd extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.dr = '';
    }
    newDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            const frm = yield Sd.create();
            if (typeof frm === 'number') {
                return;
            }
            this.dr = yield frm.showDialog();
        });
    }
}
exports.default = Sd;
