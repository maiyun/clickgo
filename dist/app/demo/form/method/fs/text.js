"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.title = 'Text viewer';
        this.content = '';
    }
    onMounted(obj) {
        this.title = obj.title + ' - Text viewer';
        this.content = obj.content;
    }
}
exports.default = default_1;
