"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'accept': [],
            'multi': false,
            'dir': false
        };
    }
    get acceptComp() {
        const accept = [];
        for (const item of this.propArray('accept')) {
            accept.push('.' + item);
        }
        return accept.join(',');
    }
    select() {
        this.refs.input.click();
    }
    change(e) {
        e.stopPropagation();
        const inputEl = this.refs.input;
        this.emit('change', inputEl.files);
        inputEl.value = '';
    }
}
exports.default = default_1;
