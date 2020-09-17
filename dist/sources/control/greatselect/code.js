"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.computed = exports.props = void 0;
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
        'default': undefined
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
    'direction': {
        'default': 'h'
    },
    'flex': {
        'default': ''
    },
    'padding': {
        'default': undefined
    },
    'area': {
        'default': 'all'
    }
};
exports.computed = {
    'widthPx': function () {
        var _a, _b, _c;
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let dir = ((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.$data._controlName) === 'select' ? (_b = this.$parent.$parent) === null || _b === void 0 ? void 0 : _b.direction : (_c = this.$parent) === null || _c === void 0 ? void 0 : _c.direction;
            return dir ? (dir === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        var _a, _b, _c;
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let dir = ((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.$data._controlName) === 'select' ? (_b = this.$parent.$parent) === null || _b === void 0 ? void 0 : _b.direction : (_c = this.$parent) === null || _c === void 0 ? void 0 : _c.direction;
            return dir.direction ? (dir.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};
exports.data = {
    'popOpen': false
};
exports.methods = {
    showPop: function (event, area) {
        if (this.area === 'arrow') {
            if (area === 'all') {
                if (this.popOpen) {
                    clickgo.form.hidePop();
                }
                return;
            }
            else {
                event.stopPropagation();
            }
        }
        else {
            if (area === 'arrow') {
                return;
            }
        }
        if (this.popOpen) {
            clickgo.form.hidePop();
            return;
        }
        let pop = null;
        for (let item of this.$children) {
            if (item.$data._controlName !== 'greatselect-pop') {
                continue;
            }
            pop = item;
            break;
        }
        if (pop) {
            pop.widthData = this.$el.offsetWidth;
            clickgo.form.showPop(pop, this.$el);
        }
        this.cgTap(event);
    },
    down: function (e) {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        this.cgStopPropagation(e);
        this.cgDown(e);
    },
    keydown: function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        this.showPop(e, this.area);
    }
};
