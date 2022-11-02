"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'alt': ''
        };
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
    }
    enter(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const length = clickgo.dom.siblingsData(this.element, 'cg-pop-open').length;
        if (length === 0) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'null': true
        });
    }
    click() {
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.refs.pop);
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'null': true
        });
    }
}
exports.default = default_1;
