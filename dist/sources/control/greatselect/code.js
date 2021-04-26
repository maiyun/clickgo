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
        'default': '7'
    },
    'area': {
        'default': 'all'
    }
};
exports.computed = {
    'widthPx': function () {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    },
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    }
};
exports.data = {
    'popOpen': false,
    'selfPop': undefined,
    'popOptions': {
        'left': '-5000px',
        'top': '0px',
        'width': '500px',
        'zIndex': '0'
    }
};
exports.methods = {
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
    click: function (e, area) {
        if (this.disabled) {
            return;
        }
        if (this.area === 'arrow' && area === 'left') {
            if (this.popOpen) {
                clickgo.form.hidePop(this);
            }
            this.cgTap(e);
            return;
        }
        this.showPop();
        this.cgTap(e);
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
        if ((_a = this.selfPop) === null || _a === void 0 ? void 0 : _a.itemPopShowing) {
            this.selfPop.itemPopShowing.hidePop();
        }
    }
};
