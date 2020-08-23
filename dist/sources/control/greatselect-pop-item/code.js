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
        if (this.disabled) {
            return;
        }
        clickgo.form.hidePop();
        this.$parent.$parent.$parent.select(this.value);
        this.cgTap(event);
    },
    controlClick: function (e) {
        if (this.disabled) {
            return;
        }
        var menuPopVue = null;
        for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
            var item = _a[_i];
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
    var hasMenuPop = false;
    for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
        var item = _a[_i];
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
