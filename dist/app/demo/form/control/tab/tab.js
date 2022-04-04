"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
exports.data = {
    'ntab': '',
    'tabs': [{
            'label': 'Tab1',
            'value': 'tab1'
        }],
    'tabPosition': 'top'
};
exports.methods = {
    add: function () {
        this.tabs.push({ 'label': 'Tab' + (this.tabs.length + 1).toString(), 'value': 'tab' + (this.tabs.length + 1).toString() });
    },
    remove: function () {
        if (this.tabs.length > 0) {
            this.tabs.splice(this.tabs.length - 1);
        }
    },
    position: function () {
        switch (this.tabPosition) {
            case 'top':
                this.tabPosition = 'right';
                break;
            case 'right':
                this.tabPosition = 'bottom';
                break;
            case 'bottom':
                this.tabPosition = 'left';
                break;
            default:
                this.tabPosition = 'top';
        }
    }
};
