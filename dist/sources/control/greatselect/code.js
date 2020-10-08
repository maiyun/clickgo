"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.computed = exports.props = void 0;
exports.props = {
    'disabled': {
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
    'popOpen': false,
    'subPop': undefined,
    'popOptions': {
        'left': '0px',
        'top': '0px',
        'width': '0px',
        'zIndex': '0'
    }
};
exports.methods = {
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
        if (this.popOpen) {
            clickgo.form.hidePop(this);
            return;
        }
        this.showPop(e, this.area);
    },
    click: function (event, area) {
        if (this.disabled) {
            return;
        }
        if (this.area === 'arrow') {
            if (area === 'all') {
                if (this.popOpen) {
                    clickgo.form.hidePop(this);
                }
                this.cgTap(event);
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
            clickgo.form.hidePop(this);
            this.cgTap(event);
            return;
        }
        this.showPop();
        this.cgTap(event);
    },
    showPop: function () {
        if (this.popOpen) {
            clickgo.form.hidePop(this);
            return;
        }
        this.popOpen = true;
        this.popOptions = clickgo.form.showPop(this, 'v');
        this.popOptions.width = this.$el.offsetWidth + 'px';
    },
    hidePop: function () {
        var _a;
        if (!this.popOpen) {
            return;
        }
        this.popOpen = false;
        if ((_a = this.subPop) === null || _a === void 0 ? void 0 : _a.itemPopShowing) {
            this.subPop.itemPopShowing.hidePop();
        }
    }
};
