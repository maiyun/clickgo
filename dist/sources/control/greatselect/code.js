"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'direction': 'h',
            'area': 'all',
            'pop': 'greatlist',
            'data': [],
            'modelValue': -1
        };
        this.padding = '';
        this.isKeyDown = false;
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
    }
    opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click(e, 'arrow');
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isKeyDown = true;
        }
    }
    keyup(e) {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        this.click(e, 'arrow');
    }
    click(e, area) {
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.element);
            return;
        }
        if (this.props.area === 'arrow' && area === 'left') {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'size': {
                'width': this.element.offsetWidth
            }
        });
    }
    updateModelValue(val) {
        this.emit('update:modelValue', val);
    }
    itemclick(e, arrow) {
        if (arrow) {
            return;
        }
        clickgo.form.hidePop();
    }
    onMounted() {
        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
    }
}
exports.default = default_1;
