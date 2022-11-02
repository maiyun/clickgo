"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'selected': false,
            'opened': false,
            'multi': false
        };
    }
    get isSelected() {
        return clickgo.tool.getBoolean(this.props.selected);
    }
    get isOpened() {
        return clickgo.tool.getBoolean(this.props.opened);
    }
    get isMulti() {
        return clickgo.tool.getBoolean(this.props.multi);
    }
    get position() {
        var _a, _b;
        return (_b = (_a = this.parentByName('task')) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : 'bottom';
    }
    click() {
        if (!this.slots('pop').length) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v');
    }
    contextmenu(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.slots('contextmenu').length) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.contextmenu, 'v');
    }
    down(e) {
        var _a;
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            if (e instanceof MouseEvent && e.button === 2) {
                if (this.element.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop();
                }
            }
            else {
                if (((_a = this.refs.contextmenu) === null || _a === void 0 ? void 0 : _a.dataset.cgOpen) !== undefined) {
                    clickgo.form.hidePop();
                }
            }
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                var _a;
                if (((_a = this.refs.pop) === null || _a === void 0 ? void 0 : _a.dataset.cgOpen) !== undefined) {
                    clickgo.form.hidePop();
                }
                clickgo.form.showPop(this.element, this.refs.contextmenu, 'v');
            });
        }
    }
}
exports.default = default_1;
