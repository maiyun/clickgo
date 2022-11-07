"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.accept = 'txt';
        this.multi = 'false';
        this.dir = 'false';
        this.list = [];
    }
    select() {
        this.refs.file.select();
    }
    change(files) {
        this.list = [];
        if (!files) {
            return;
        }
        for (const file of files) {
            this.list.push((file.webkitRelativePath || file.name) + ' (' + file.size.toString() + ')');
        }
    }
}
exports.default = default_1;
