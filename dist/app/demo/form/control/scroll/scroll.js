"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.sh1 = 1000;
        this.c1 = 100;
        this.so1 = 500;
        this.sh2 = 0;
        this.c2 = 0;
        this.so2 = 0;
        this.count = 3;
        this.float = false;
        this.disabled = false;
    }
}
exports.default = default_1;
