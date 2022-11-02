"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'alt': '',
            'type': '',
            'label': '',
            'modelValue': ''
        };
        this.padding = '';
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    enter(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'h');
    }
    touch() {
        clickgo.form.showPop(this.element, this.refs.pop, 'h');
    }
    click() {
        if (!this.props.type) {
            if (!this.slots('pop').length) {
                clickgo.form.hidePop();
            }
            return;
        }
        if (this.props.type === 'radio') {
            this.emit('update:modelValue', this.props.label);
        }
        else if (this.props.type === 'check') {
            this.emit('update:modelValue', this.props.modelValue ? false : true);
        }
        clickgo.form.hidePop();
    }
    onBeforeUnmount() {
        const menulist = this.parentByName('menulist');
        if (!menulist) {
            return;
        }
        if (this.props.type) {
            --menulist.hasTypeItemsCount;
        }
    }
    onMounted() {
        this.watch('type', () => {
            const menulist = this.parentByName('menulist');
            if (!menulist) {
                return;
            }
            if (this.props.type) {
                ++menulist.hasTypeItemsCount;
            }
            else {
                --menulist.hasTypeItemsCount;
            }
        }, {
            'immediate': true
        });
        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
        const menulist = this.parentByName('menulist');
        if (!menulist) {
            return;
        }
        if (this.props.type) {
            ++menulist.hasTypeItemsCount;
        }
    }
}
exports.default = default_1;
