"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.props = void 0;
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
        if (!clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        let greatlist = this.cgParentByName('greatlist');
        if (!greatlist) {
            return;
        }
        greatlist.itemClick = true;
        if (greatlist.multi) {
            greatlist.select(this.value, e.shiftKey, true);
        }
        else {
            greatlist.select(this.value, e.shiftKey, e.ctrlKey);
        }
    },
    contextmenu: function (e) {
        var _a;
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.disabled) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        (_a = this.cgParentByName('greatlist')) === null || _a === void 0 ? void 0 : _a.cgShowPop(e);
    },
    down: function (e) {
        var _a;
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.disabled) {
            return;
        }
        if (this.cgParentByName('greatlist')) {
            this.cgParentByName('greatlist').itemDown = true;
        }
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
        }
        else if (this.cgParentPopLayer.cgChildPopItemShowing) {
            this.cgParentPopLayer.cgChildPopItemShowing.cgHidePop();
        }
        if (e instanceof MouseEvent) {
            (_a = this.cgParentByName('greatlist')) === null || _a === void 0 ? void 0 : _a.select(this.value, e.shiftKey, e.ctrlKey);
        }
        else {
            clickgo.dom.bindLong(e, () => {
                var _a, _b;
                (_a = this.cgParentByName('greatlist')) === null || _a === void 0 ? void 0 : _a.select(this.value, e.shiftKey, e.ctrlKey);
                (_b = this.cgParentByName('greatlist')) === null || _b === void 0 ? void 0 : _b.showPop(e);
            });
        }
    },
    controlClick: function (e) {
        var _a;
        if (this.disabled) {
            return;
        }
        if (this.cgParentByName('greatlist')) {
            this.cgParentByName('greatlist').itemClick = true;
        }
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            (_a = this.cgParentByName('greatlist')) === null || _a === void 0 ? void 0 : _a.select(this.value, e.shiftKey, e.ctrlKey);
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
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.disabled) {
            return;
        }
        if (this.cgParentByName('greatlist')) {
            this.cgParentByName('greatlist').itemDown = true;
        }
        if (e instanceof MouseEvent) {
            (_a = this.cgParentByName('greatlist')) === null || _a === void 0 ? void 0 : _a.select(this.value, e.shiftKey, e.ctrlKey);
        }
    }
};
