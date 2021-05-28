"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.data = exports.props = void 0;
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
    'greatlist': undefined
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    }
};
exports.methods = {
    click: function (e) {
        var _a, _b, _c;
        if (this.disabled) {
            return;
        }
        clickgo.form.hidePop();
        if (!this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        this.greatlist.itemClick = true;
        if ((_a = this.greatlist) === null || _a === void 0 ? void 0 : _a.multi) {
            (_b = this.greatlist) === null || _b === void 0 ? void 0 : _b.select(this.value, e.shiftKey, true);
        }
        else {
            (_c = this.greatlist) === null || _c === void 0 ? void 0 : _c.select(this.value, e.shiftKey, e.ctrlKey);
        }
    },
    contextmenu: function (e) {
        var _a;
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.disabled) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        (_a = this.greatlist) === null || _a === void 0 ? void 0 : _a.cgShowPop(e);
    },
    down: function (e) {
        var _a;
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.disabled) {
            return;
        }
        this.greatlist.itemDown = true;
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
        }
        else if (this.cgParentPopLayer.cgChildPopItemShowing) {
            this.cgParentPopLayer.cgChildPopItemShowing.cgHidePop();
        }
        if (e instanceof MouseEvent) {
            (_a = this.greatlist) === null || _a === void 0 ? void 0 : _a.select(this.value, e.shiftKey, e.ctrlKey);
        }
        else {
            clickgo.dom.bindLong(e, () => {
                var _a, _b;
                (_a = this.greatlist) === null || _a === void 0 ? void 0 : _a.select(this.value, e.shiftKey, e.ctrlKey);
                (_b = this.greatlist) === null || _b === void 0 ? void 0 : _b.showPop(e);
            });
        }
    },
    controlClick: function (e) {
        var _a;
        if (this.disabled) {
            return;
        }
        this.greatlist.itemClick = true;
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            (_a = this.greatlist) === null || _a === void 0 ? void 0 : _a.select(this.value, e.shiftKey, e.ctrlKey);
        }
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
            return;
        }
        this.cgShowPop(e);
    },
    controlContextmenu: function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    controlDown: function (e) {
        var _a;
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.disabled) {
            return;
        }
        if (this.greatlist) {
            this.greatlist.itemDown = true;
        }
        if (e instanceof MouseEvent) {
            (_a = this.greatlist) === null || _a === void 0 ? void 0 : _a.select(this.value, e.shiftKey, e.ctrlKey);
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
