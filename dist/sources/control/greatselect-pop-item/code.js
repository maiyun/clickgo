"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updated = exports.methods = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'padding': {
        'default': undefined
    },
    'value': {
        'default': ''
    }
};
exports.data = {
    'popOpen': false,
    'hasMenuPop': false
};
exports.methods = {
    click: function (event) {
        var _a, _b, _c;
        if (this.disabled) {
            return;
        }
        clickgo.form.hidePop();
        (_c = (_b = (_a = this.$parent) === null || _a === void 0 ? void 0 : _a.$parent) === null || _b === void 0 ? void 0 : _b.$parent) === null || _c === void 0 ? void 0 : _c.select(this.value);
        this.cgTap(event);
    },
    controlClick: function (e) {
        if (this.disabled) {
            return;
        }
        let menuPopVue = null;
        for (let item of this.$children) {
            if (item.$data._controlName !== 'menu-pop') {
                continue;
            }
            menuPopVue = item;
        }
        if (menuPopVue) {
            clickgo.form.showPop(menuPopVue, e.pageX, e.pageY);
        }
    }
};
exports.updated = function () {
    let hasMenuPop = false;
    for (let item of this.$children) {
        if (item.$data._controlName !== 'menu-pop') {
            continue;
        }
        hasMenuPop = true;
        break;
    }
    if (this.hasMenuPop !== hasMenuPop) {
        this.hasMenuPop = hasMenuPop;
    }
};
