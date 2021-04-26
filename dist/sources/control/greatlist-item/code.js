"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.methods = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'direction': {
        'default': 'h'
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
    'selfPop': undefined,
    'greatlist': undefined,
    'popOptions': {
        'left': '-5000px',
        'top': '0px',
        'zIndex': '0'
    }
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    }
};
exports.methods = {
    click: function (e) {
        if (this.disabled) {
            return;
        }
        clickgo.form.hidePop();
        if (!this.cgHasTouch) {
            return;
        }
        this.greatlist.itemClick = true;
        if (this.greatlist.multi) {
            this.greatlist.select(this.value, e.shiftKey, true);
        }
        else {
            this.greatlist.select(this.value, e.shiftKey, e.ctrlKey);
        }
    },
    contextmenu: function (e) {
        if (this.cgHasTouch) {
            return;
        }
        if (this.disabled) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        this.greatlist.showPop(e);
    },
    down: function (e) {
        if (e instanceof MouseEvent && this.cgHasTouch) {
            return;
        }
        if (this.disabled) {
            return;
        }
        this.greatlist.itemDown = true;
        if (this.popOpen) {
            clickgo.form.hidePop(this);
        }
        else if (this.greatlist.itemPopShowing) {
            clickgo.form.hidePop(this.greatlist.itemPopShowing);
        }
        if (e instanceof MouseEvent) {
            this.greatlist.select(this.value, e.shiftKey, e.ctrlKey);
        }
        else {
            clickgo.dom.bindLong(e, () => {
                this.greatlist.select(this.value, e.shiftKey, e.ctrlKey);
                this.greatlist.showPop(e);
            });
        }
    },
    controlClick: function (e) {
        if (this.disabled) {
            return;
        }
        this.greatlist.itemClick = true;
        if (this.cgHasTouch) {
            this.greatlist.select(this.value, e.shiftKey, e.ctrlKey);
        }
        if (this.popOpen) {
            clickgo.form.hidePop(this);
            return;
        }
        this.showPop(e);
    },
    controlContextmenu: function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    controlDown: function (e) {
        if (e instanceof MouseEvent && this.cgHasTouch) {
            return;
        }
        if (this.disabled) {
            return;
        }
        this.greatlist.itemDown = true;
        if (e instanceof MouseEvent) {
            this.greatlist.select(this.value, e.shiftKey, e.ctrlKey);
        }
    },
    showPop: function (e) {
        if (this.popOpen) {
            return;
        }
        if (this.greatlist.itemPopShowing) {
            clickgo.form.hidePop(this.greatlist.itemPopShowing);
        }
        this.greatlist.itemPopShowing = this;
        this.popOpen = true;
        this.popOptions = clickgo.form.showPop(this, e instanceof MouseEvent ? e.clientX : e.touches[0].clientX, e instanceof MouseEvent ? e.clientY : e.touches[0].clientY);
    },
    hidePop: function () {
        var _a;
        if (!this.popOpen) {
            return;
        }
        this.popOpen = false;
        if (this.greatlist.itemPopShowing === this) {
            this.greatlist.itemPopShowing = undefined;
        }
        if ((_a = this.selfPop) === null || _a === void 0 ? void 0 : _a.itemPopShowing) {
            this.selfPop.itemPopShowing.hidePop();
        }
    }
};
exports.mounted = function () {
    let greatlist = this.cgFindParent('greatlist');
    if (!greatlist) {
        return;
    }
    this.greatlist = greatlist;
};
exports.unmounted = function () {
    if (this === this.greatlist.itemPopShowing) {
        clickgo.form.hidePop(this);
    }
};
