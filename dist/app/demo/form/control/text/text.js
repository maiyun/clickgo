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
        this.value = '';
        this.isFocus = false;
        this.selectionStart = 0;
        this.selectionEnd = 0;
        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.clientHeight = 0;
        this.clientWidth = 0;
        this.scrollHeight = 0;
        this.scrollWidth = 0;
        this.multi = false;
        this.disabled = false;
        this.readonly = false;
        this.password = false;
        this.wrap = true;
        this.menu = false;
        this.gesture = false;
        this.long = false;
        this.lineHeight = 1;
        this.fontSize = 12;
        this.border = 'solid';
        this.background = undefined;
    }
    get textBorder() {
        switch (this.border) {
            case 'underline': {
                return '0 0 .5px 0';
            }
            case 'none': {
                return '0';
            }
        }
        return undefined;
    }
    longClick() {
        this.value = this.long ? 'short\nshort\nshort\nshort\nshort\nshort\nshort\nshort\nshort' : 'long\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong';
        this.long = !this.long;
        this.scrollTop = 0;
    }
    onGesture(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('onGesture: ' + dir);
        });
    }
}
exports.default = default_1;
