"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'accept': undefined,
            'multi': false,
            'dir': false
        };
    }
    get isMulti() {
        return clickgo.tool.getBoolean(this.props.multi);
    }
    get isDir() {
        return clickgo.tool.getBoolean(this.props.dir);
    }
    get acceptComp() {
        if (!this.props.accept) {
            return undefined;
        }
        if (!Array.isArray(this.props.accept)) {
            return undefined;
        }
        const accept = [];
        for (const item of this.props.accept) {
            if (typeof item !== 'string') {
                continue;
            }
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
