"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.message = 'message';
        this.buttons = ['OK'];
        this.btn = 'none';
    }
}
exports.default = default_1;
