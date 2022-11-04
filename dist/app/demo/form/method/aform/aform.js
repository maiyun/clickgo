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
        this.fid = '0';
        this.sendValue = 'sendValue';
        this.test = 'A';
        this.dr = '';
    }
    ccreateForm() {
        return __awaiter(this, void 0, void 0, function* () {
            const frm = yield this.createForm('test');
            if (typeof frm === 'number') {
                return;
            }
            frm.show();
        });
    }
    ssend() {
        this.send(parseInt(this.fid), {
            'key': this.sendValue
        });
    }
    hhide() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hide();
            yield clickgo.tool.sleep(1000);
            this.show();
        });
    }
    sshowDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            const frm = yield this.createForm('test');
            if (typeof frm === 'number') {
                return;
            }
            this.dr = yield frm.showDialog();
        });
    }
    onMounted() {
        this.watch('test', () => __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('test changed.');
        }));
    }
}
exports.default = default_1;
