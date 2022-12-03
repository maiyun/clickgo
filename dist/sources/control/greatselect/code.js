"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'multi': false,
            'direction': 'h',
            'area': 'all',
            'pop': 'greatlist',
            'data': [],
            'sizes': {},
            'modelValue': []
        };
        this.padding = '';
        this.font = '';
        this.isSpaceDown = false;
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    showPop() {
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'size': {
                'width': this.element.offsetWidth
            }
        });
    }
    keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click(e, 'arrow');
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isSpaceDown = true;
        }
    }
    keyup(e) {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
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
        this.showPop();
    }
    updateModelValue(val) {
        this.emit('update:modelValue', val);
    }
    itemclick(e, arrow) {
        if (arrow) {
            return;
        }
        if (this.propBoolean('multi')) {
            return;
        }
        clickgo.form.hidePop();
    }
    onMounted() {
        clickgo.dom.watchStyle(this.element, ['font', 'padding'], (n, v) => {
            switch (n) {
                case 'font': {
                    this.font = v;
                    break;
                }
                case 'padding': {
                    this.padding = v;
                    break;
                }
            }
        }, true);
    }
}
exports.default = default_1;
