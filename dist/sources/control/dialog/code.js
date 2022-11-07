"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.padding = '';
        this.props = {
            'direction': 'h',
            'gutter': '',
            'buttons': ['OK']
        };
    }
    get paddingMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    click(item) {
        this.emit('select', item);
    }
    onMounted() {
        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
    }
}
exports.default = default_1;
