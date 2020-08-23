"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'focus': {
        'default': false
    },
    'width': {
        'default': undefined
    },
    'height': {
        'default': 30
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    }
};
exports.computed = {
    'widthPx': function () {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            return this.$parent.direction ? (this.$parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            return this.$parent.direction ? (this.$parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};
exports.methods = {
    keydown: function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        this.cgTap(e);
    },
    down: function (e) {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        this.cgStopPropagation(e);
        this.cgDown(e);
    }
};
