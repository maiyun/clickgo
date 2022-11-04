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
const form_1 = require("./control/form/form");
const dialog_1 = require("./control/dialog/dialog");
const form_2 = require("./method/form/form");
const aform_1 = require("./method/aform/aform");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ntab = '';
    }
    openForm(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let frm = 0;
            switch (name) {
                case 'cblock': {
                    frm = yield this.createForm('control/block/block');
                    break;
                }
                case 'cform': {
                    frm = yield form_1.default.create();
                    break;
                }
                case 'cdialog': {
                    frm = yield dialog_1.default.create();
                    break;
                }
                case 'mform': {
                    frm = yield form_2.default.create();
                    break;
                }
                case 'aform': {
                    frm = yield aform_1.default.create();
                    break;
                }
            }
            if (typeof frm === 'number') {
                return;
            }
            frm.show();
        });
    }
}
exports.default = default_1;
